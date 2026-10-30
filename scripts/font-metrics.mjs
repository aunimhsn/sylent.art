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
// the titles (« CI/CD », « Git / GitHub »). A title with another one fails the build.
const characters = [
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  ..."ÀÂÄÆÇÉÈÊËÎÏÔÖŒÙÛÜŸàâäæçéèêëîïôöœùûüÿ",
  ..."   /-–'’.,:;!?&+()«»",
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
const metrics = await page.evaluate(
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
    context.font = `800 ${size}px Measured`;
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
    for (const character of characters) {
      advance[character] = em(context.measureText(character).width);
      const start = inkStart(character);
      if (start !== undefined) bearing[character] = em(start);
    }
    for (const first of characters) {
      for (const second of characters) {
        const pair = em(
          context.measureText(first + second).width -
            context.measureText(first).width -
            context.measureText(second).width,
        );
        if (pair !== 0) kerning[first + second] = pair;
      }
    }
    return { advance, bearing, kerning };
  },
  { font, characters },
);
await browser.close();

writeFileSync(
  output,
  `${JSON.stringify({ font: file, ...metrics }, null, 2)}\n`,
);
console.log(
  `${output}: ${characters.length} characters, ${Object.keys(metrics.kerning).length} kerning pairs.`,
);
