// Checks that every URL of the former site still resolves in the built site (dist/): either a
// page, or a redirect to the page that specs.md gives it (URLs and redirects), which exists; and
// that the dropped ones show the not-found page. Also checks the redirects of the site, which no
// page links to: /domaines/ leads to the formations page, and the address of a formation of a
// single module to its module. And the pages of step 14b: the not-found page is built, every
// redirect page is the French one of src/pages/3xx.astro, Astro's template /3xx.html is not
// published, and the sitemap lists only pages, no redirect. And the Open Graph tags of every page:
// the title of its card is its own, the URL is its canonical one, and the image is built.
// Run after `npm run build`, or on a build under a base:
// `node scripts/check-former-urls.mjs <folder> <base>`.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import redirectPage from "../src/content/redirect.json" with { type: "json" };

const [dist = "dist", base = ""] = process.argv.slice(2);

// Each former URL, with the path it redirects to (without the base), or null for a page at the
// same path. A draft's former course leads to the page of its formation, until the module is
// published (specs.md, Training offers).
const formerUrls = new Map([
  ["/", null],
  ["/courses", "/formations/"],
  ["/courses/1", "/formations/html/fondamentaux/"],
  ["/courses/2", "/formations/css/fondamentaux/"],
  ["/courses/3", "/formations/javascript/fondamentaux/"],
  ["/courses/4", "/formations/php/fondamentaux/"],
  ["/courses/5", "/formations/mysql/fondamentaux/"],
  ["/courses/6", "/formations/python/fondamentaux/"],
  ["/courses/7", "/formations/algorithmique/robomind/"],
  ["/courses/8", "/formations/cypress/fondamentaux/"],
  ["/courses/9", "/formations/javascript/"], // Vue, a draft
  ["/courses/10", "/formations/javascript/alpine/"],
  ["/courses/11", "/formations/php/laravel/"],
  ["/courses/12", "/formations/python/"], // Django, a draft
  ["/articles", "/"],
  ["/articles/1", "/"],
  ["/articles/2", "/"],
  ["/about", "/a-propos/"],
  ["/contact", null],
  ["/policy", "/confidentialite/"],
]);

/** The folders of a folder of the built site. */
const foldersOf = (path) =>
  readdirSync(join(dist, path), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map(({ name }) => name);

// The redirects of the site (specs.md, URLs and redirects): /domaines/ leads to the formations
// page, and the address of a formation of a single module, the only folder in it, to that
// module; a formation of several modules has its page.
const siteRedirects = new Map([
  ["/domaines", "/formations/"],
  ...foldersOf("formations").map((name) => {
    const modules = foldersOf(`formations/${name}`);
    const path = `/formations/${name}`;
    return [path, modules.length === 1 ? `${path}/${modules[0]}/` : null];
  }),
]);

// The former URLs that specs.md drops: no page and no redirect.
const droppedUrls = ["/creations", "/register", "/login"];

// The former URLs whose page or redirect a later step of roadmap.md builds. Remove each one
// with its step: the list must be empty for the launch (step 14).
const pending = new Map();

/** The file that GitHub Pages serves for a URL path, as written by Astro. */
const fileOf = (path) => join(dist, path, "index.html");

/**
 * The path a redirect page leads to, or null for a regular page. Fails on a redirect whose
 * target can't be read, rather than taking it for a page.
 */
const redirectOf = (html) => {
  if (!/http-equiv=["']?refresh/i.test(html)) return null;
  const target = html.match(/content=["']?\d+\s*;\s*url=([^"'\s>]+)/i)?.[1];
  if (!target) throw new Error("a redirect page without a readable target");
  return target;
};

const errors = [];
const waiting = [];

for (const [url, expected] of [...formerUrls, ...siteRedirects]) {
  const file = fileOf(url);
  if (!existsSync(file)) {
    if (pending.has(url)) waiting.push(`${url} (step ${pending.get(url)})`);
    else errors.push(`${url}: no page in ${dist}/`);
    continue;
  }
  if (pending.has(url)) {
    errors.push(`${url}: built, remove it from the pending list`);
  }
  let target;
  try {
    target = redirectOf(readFileSync(file, "utf8"));
  } catch (error) {
    errors.push(`${url}: ${error.message}`);
    continue;
  }
  if (target === null) {
    if (expected !== null) {
      errors.push(`${url}: a page, instead of a redirect to ${expected}`);
    }
    continue;
  }
  const { pathname, hash } = new URL(target, "https://sylent.art");
  const path = pathname.startsWith(`${base}/`)
    ? `${pathname.slice(base.length)}${hash}`
    : null;
  if (path !== expected) {
    errors.push(
      `${url}: redirects to ${target}, instead of ` +
        (expected ? `${base}${expected}` : "a page"),
    );
    continue;
  }
  const page = fileOf(pathname.slice(base.length));
  if (!existsSync(page)) {
    errors.push(`${url}: redirects to ${target}, which doesn't exist`);
  } else if (
    hash &&
    !readFileSync(page, "utf8").includes(`id="${hash.slice(1)}"`)
  ) {
    errors.push(`${url}: redirects to ${target}, whose anchor doesn't exist`);
  }
}

for (const url of droppedUrls) {
  if (existsSync(fileOf(url))) errors.push(`${url}: dropped, but built`);
}

if (!existsSync(join(dist, "404.html"))) errors.push("404.html: not built");
if (existsSync(join(dist, "3xx.html"))) {
  errors.push("3xx.html: the template of the redirect pages is published");
}

// Every redirect page of the site, those of the former URLs and the others alike, is the French
// one: Astro falls back to its own page in English if src/pages/3xx.astro fails.
const htmlFiles = readdirSync(dist, { recursive: true }).filter((file) =>
  file.endsWith(".html"),
);
const redirectPages = new Set();
/** The content of a meta tag, or of the canonical link, as Astro writes them. */
const meta = (html, property) =>
  html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`))?.[1];
for (const file of htmlFiles) {
  const html = readFileSync(join(dist, file), "utf8");
  if (!/http-equiv=["']?refresh/i.test(html)) {
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
    if (meta(html, "og:title") !== title) {
      errors.push(`${file}: og:title differs from the title`);
    }
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    if (meta(html, "og:url") !== canonical) {
      errors.push(`${file}: og:url differs from the canonical link`);
    }
    const image = meta(html, "og:image");
    const imagePath = image && new URL(image).pathname;
    if (
      !imagePath?.startsWith(`${base}/`) ||
      !existsSync(join(dist, imagePath.slice(base.length)))
    ) {
      errors.push(`${file}: og:image ${image} is not built`);
    }
    continue;
  }
  redirectPages.add(file);
  if (!html.includes(redirectPage.text)) {
    errors.push(`${file}: a redirect page that isn't the French one`);
  }
}

// The sitemap lists pages that exist, and no redirect or not-found page.
const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  const { pathname } = new URL(loc);
  const file = join(pathname.slice(base.length), "index.html").replace(
    /^\//,
    "",
  );
  if (!existsSync(join(dist, file))) {
    errors.push(`sitemap.xml: ${loc} has no page`);
  } else if (redirectPages.has(file)) {
    errors.push(`sitemap.xml: ${loc} is a redirect`);
  }
}

if (waiting.length > 0) {
  console.log(`Former URLs left to later steps: ${waiting.join(", ")}`);
}
if (errors.length > 0) {
  console.error(`URLs that don't resolve:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `${formerUrls.size - waiting.length} former URLs and ` +
    `${siteRedirects.size} addresses of the site resolve in ${dist}/.`,
);
