/**
 * The width and the left edge of the large titles and faded words, computed at build time from
 * the metrics of Manrope 800 (src/data/manrope-800.json, written by scripts/font-metrics.mjs), so
 * that each title is sized and aligned from its own text without JavaScript in the page
 * (docs/branding.md, Typography).
 */
import metrics from "../data/manrope-800.json";

const advances: Record<string, number> = metrics.advance;
const bearings: Record<string, number> = metrics.bearing;
const kernings: Record<string, number> = metrics.kerning;

/** The letter spacing of the titles and of the faded words, as in src/styles/tokens.css. */
export const TRACKING_TITLE = -0.045;
export const TRACKING_GHOST = -0.06;

// A round letter looks further right than a straight one whose ink starts at the same place:
// it moves 0.01 em further left, as typographers do.
const ROUND = new Set([..."CGOQSÇ"]);
const OVERSHOOT = 0.01;

const advanceOf = (character: string) => {
  const advance = advances[character];
  if (advance === undefined) {
    throw new Error(
      `« ${character} » is not measured in src/data/manrope-800.json: add it to scripts/font-metrics.mjs and run it again.`,
    );
  }
  return advance;
};

/**
 * The width of a text in em, in Manrope 800 with the given letter spacing, kerning included: the
 * width of its box in the browser.
 */
export const widthEm = (text: string, tracking: number) => {
  const characters = [...text];
  return characters.reduce(
    (width, character, index) =>
      width +
      advanceOf(character) +
      tracking +
      (index > 0 ? (kernings[characters[index - 1] + character] ?? 0) : 0),
    0,
  );
};

/**
 * How far a text moves left so that the ink of its first letter starts on the edge, in em: the
 * side bearing of that letter, a little more for a round one.
 */
export const bearingEm = (text: string) => {
  const first = [...text.trim()][0] ?? "";
  advanceOf(first);
  return (bearings[first] ?? 0) + (ROUND.has(first) ? OVERSHOOT : 0);
};

/** The side bearing of a text as the custom property `--bearing` of its element. */
export const bearingStyle = (text: string) => ({
  "--bearing": `${bearingEm(text).toFixed(3)}em`,
});
