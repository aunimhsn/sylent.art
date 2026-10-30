// @ts-check
import { rmSync } from "node:fs";
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "./scripts/sitemap.mjs";

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
  // GitHub Pages serves a-propos/index.html at /a-propos/ and redirects /a-propos to it: links and
  // canonical URLs end with a slash, in the development server too.
  trailingSlash: "always",
  // The former URLs that must keep resolving, toward their French paths (specs.md, URLs and
  // redirects); the redirects of /courses/<id> are written by src/pages/courses/[id].astro. The
  // site has no articles: their former URLs go to the home page.
  redirects: {
    "/courses": to("/formations/"),
    "/domaines": to("/formations/"),
    "/about": to("/a-propos/"),
    "/policy": to("/confidentialite/"),
    "/articles": to("/"),
    "/articles/1": to("/"),
    "/articles/2": to("/"),
  },
  integrations: [
    // Astro also builds src/pages/3xx.astro as a page of its own, /3xx.html, without a redirect
    // to fill it: it is removed.
    {
      name: "redirect-page",
      hooks: {
        "astro:build:done": ({ dir }) => rmSync(new URL("3xx.html", dir)),
      },
    },
    sitemap(),
  ],
  experimental: {
    // Each redirect is written with src/pages/3xx.astro, a page in French, instead of Astro's
    // page in English (docs/technical-choices.md, Astro).
    redirectPage: true,
  },
  vite: {
    build: {
      // Three.js (the cube and the covers, docs/technical-choices.md) is one module of about
      // 540 kB minified, 135 kB compressed, that Vite can't split: the warning starts above it,
      // so that any other large chunk still shows.
      chunkSizeWarningLimit: 600,
    },
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
  ],
});
