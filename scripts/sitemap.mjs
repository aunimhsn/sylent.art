// The Astro integration that writes sitemap.xml once the site is built (astro.config.mjs): the
// canonical address of every page that is its own, read from the built pages. A redirect page
// points its canonical link to its target, and the not-found page has none, so neither is listed,
// and a new page is listed without changing this file (docs/technical-choices.md, Astro).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** The canonical address of a built page, if it is the page itself. */
const canonicalOf = (html) => {
  if (/http-equiv=["']?refresh/i.test(html)) return null;
  return html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? null;
};

/** @returns {import("astro").AstroIntegration} */
export default function sitemap() {
  return {
    name: "sitemap",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const urls = readdirSync(root, { recursive: true })
          .filter((file) => file.endsWith(".html"))
          .flatMap((file) => {
            const url = canonicalOf(readFileSync(join(root, file), "utf8"));
            return url ? [url] : [];
          })
          .sort();
        const entries = urls.map((url) => `  <url><loc>${url}</loc></url>`);
        writeFileSync(
          join(root, "sitemap.xml"),
          [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            ...entries,
            "</urlset>",
            "",
          ].join("\n"),
        );
        logger.info(`sitemap.xml: ${urls.length} pages`);
      },
    },
  };
}
