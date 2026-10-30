// Measures Manrope 800, the font of the large titles, and writes its metrics to
// src/data/manrope-800.json, which the build reads (src/lib/title-metrics.ts): the advance of each
// character, the side bearing on the left of its ink, and the kerning of each pair of characters,
// all in em. The titles are then sized and aligned from their own text, without JavaScript in the
// page (docs/branding.md, Typography). The font is the file the site serves, downloaded by
// `npm run build`; it is measured in the Chromium of Playwright, which applies the kerning as the
// browsers do. Run again when the font or the characters of the titles change:
// `npm run build && npm run fonts:metrics`.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "playwright";

const fonts = ".astro/fonts";
const output = "src/data/manrope-800.json";

// The characters a large title may hold: the letters of French, the digits and the punctuation of
// the titles (« CI / CD », « Git / GitHub »). A title with another one fails the build, as one that
// the served file lacks (« Ÿ », outside its latin subset), which is left out. The narrow no-break
// space is left out too: Chromium doesn't track it, so the width of a title would be wrong.
const characters = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  ..."ÀÂÄÆÇÉÈÊËÎÏÔÖŒÙÛÜŸàâäæçéèêëîïôöœùûüÿ",
  ..." \u00a0/-–'’.,:;!?&+()«»",
];

const file = readdirSync(fonts).find((name) =>
  /^font-manrope-.*-latin-.*\.woff2$/.test(name),
);
if (!file) {
  throw new Error(`No Manrope file in ${fonts}: run \`npm run build\` first.`);
}
const font = readFileSync(join(fonts, file)).toString("base64");

// Run in the page, by Playwright.
/* global document, FontFace */
const browser = await chromium.launch();
const page = await browser.newPage();
const { missing, metrics } = await page.evaluate(
  async ({ font, characters }) => {
    const face = new FontFace(
      "Measured",
      `url(data:font/woff2;base64,${font})`,
      {
        weight: "600 800",
      },
    );
    document.fonts.add(await face.load());
    const size = 1000;
    const context = document.createElement("canvas").getContext("2d");
    // A character the font lacks is drawn by a fallback font: its width then depends on it.
    const inFont = (character) =>
      ["serif", "monospace"]
        .map((fallback) => {
          context.font = `800 ${size}px Measured, ${fallback}`;
          return context.measureText(character).width;
        })
        .reduce((serif, monospace) => serif === monospace);
    const measured = characters.filter(inFont);
    context.font = `800 ${size}px Measured`;
    // As in the page, where the titles are tracked: a letter spacing turns the ligatures off
    // (« ff ») and keeps the kerning. It is taken off each width.
    context.letterSpacing = "1px";
    const widthOf = (text) =>
      context.measureText(text).width - [...text].length;
    const em = (value) => Math.round((value / size) * 1000) / 1000;
    // The side bearing is read on the pixels of the letter drawn at the pen position `origin`:
    // measureText rounds its ink box to 1/64 em.
    const origin = size / 2;
    const ink = document.createElement("canvas").getContext("2d", {
      willReadFrequently: true,
    });
    ink.canvas.width = size * 2;
    ink.canvas.height = size * 1.5;
    ink.font = context.font;
    const inkStart = (character) => {
      ink.clearRect(0, 0, ink.canvas.width, ink.canvas.height);
      ink.fillText(character, origin, size);
      const { data, width, height } = ink.getImageData(
        0,
        0,
        ink.canvas.width,
        ink.canvas.height,
      );
      for (let x = 0; x < width; x += 1) {
        for (let y = 0; y < height; y += 1) {
          if (data[(y * width + x) * 4 + 3] > 127) return x - origin;
        }
      }
      return undefined;
    };
    const advance = {};
    const bearing = {};
    const kerning = {};
    for (const character of measured) {
      advance[character] = em(widthOf(character));
      const start = inkStart(character);
      if (start !== undefined) bearing[character] = em(start);
    }
    for (const first of measured) {
      for (const second of measured) {
        const pair = em(
          widthOf(first + second) - widthOf(first) - widthOf(second),
        );
        if (pair !== 0) kerning[first + second] = pair;
      }
    }
    const missing = characters.filter(
      (character) => !measured.includes(character),
    );
    return { missing, metrics: { advance, bearing, kerning } };
  },
  { font, characters },
);
await browser.close();

writeFileSync(
  output,
  `${JSON.stringify({ font: file, ...metrics }, null, 2)}\n`,
);
if (missing.length > 0) {
  console.log(`Not in ${file}, left out: ${missing.join(" ")}`);
}
console.log(
  `${output}: ${Object.keys(metrics.advance).length} characters, ${Object.keys(metrics.kerning).length} kerning pairs.`,
);
