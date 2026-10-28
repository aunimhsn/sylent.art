// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// The deployment workflow sets SITE_URL and BASE_PATH so that the owner can check the site at
// https://aunimhsn.github.io/sylent.art before the domain points to GitHub Pages. Without
// them, the site is built for https://sylent.art, as the checks expect.
const site = process.env.SITE_URL ?? "https://sylent.art";
const base = process.env.BASE_PATH ?? "/";

/** Prefixes a redirect destination with the base, which Astro leaves out. */
const to = (/** @type {string} */ path) => `${base.replace(/\/$/, "")}${path}`;

export default defineConfig({
  site,
  base,
  // GitHub Pages serves about/index.html at /about/ and redirects /about to it: links and
  // canonical URLs end with a slash, in the development server too.
  trailingSlash: "always",
  // The former URLs that must keep resolving; the redirects of /courses/<id> are generated
  // from the offers in step 8. Without articles in the first release, they go to the home page.
  redirects: {
    "/articles": to("/"),
    "/articles/1": to("/"),
    "/articles/2": to("/"),
  },
  // Self-hosted fonts, downloaded at build time (docs/branding.md, Type).
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Manrope",
      cssVariable: "--font-manrope",
      weights: ["600 800"],
      styles: ["normal"],
      display: "block",
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Anaheim",
      cssVariable: "--font-anaheim",
      weights: [500],
      styles: ["normal"],
      display: "block",
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      // Only the letters of the Roman numerals of the pedagogy, a file of a few kilobytes,
      // with the optical size axis: at their large size the browser draws the high-contrast
      // letters, as in the mock-up.
      provider: fontProviders.google(),
      name: "Bodoni Moda",
      cssVariable: "--font-bodoni-moda",
      weights: [400],
      styles: ["normal"],
      display: "block",
      fallbacks: ["serif"],
      options: {
        experimental: {
          glyphs: ["I", "V", "X"],
          variableAxis: { opsz: [["6", "96"]] },
        },
      },
    },
  ],
});
