// Checks that every URL of the former site still resolves in the built site (dist/): either a
// page, or a redirect to the page that specs.md gives it (URLs and redirects), which exists; and
// that the dropped ones show the not-found page. Run after `npm run build`, or on the preview
// built under its base: `node scripts/check-former-urls.mjs dist-base/sylent.art /sylent.art`.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const [dist = "dist", base = ""] = process.argv.slice(2);

const web = "/domaines/developpement-web/modules";

// Each former URL, with the path it redirects to (without the base), or null for a page at the
// same path. A draft's former course leads to the offer list, at the card of its domain, until
// the module is published (specs.md, Training offers).
const formerUrls = new Map([
  ["/", null],
  ["/courses", "/domaines/"],
  ["/courses/1", `${web}/html/`],
  ["/courses/2", `${web}/css/`],
  ["/courses/3", `${web}/javascript/`],
  ["/courses/4", `${web}/php/`],
  ["/courses/5", "/domaines/bases-de-donnees/modules/mysql/"],
  ["/courses/6", "/domaines/python/modules/python/"],
  ["/courses/7", "/domaines/initiation-a-la-programmation/modules/robomind/"],
  ["/courses/8", "/domaines/methodologie-et-tests/modules/cypress/"],
  ["/courses/9", "/domaines/#developpement-web"], // Vue, a draft
  ["/courses/10", `${web}/alpine/`],
  ["/courses/11", `${web}/laravel/`],
  ["/courses/12", "/domaines/#python"], // Django, a draft
  ["/articles", "/"],
  ["/articles/1", "/"],
  ["/articles/2", "/"],
  ["/about", "/a-propos/"],
  ["/contact", null],
  ["/policy", "/confidentialite/"],
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

for (const [url, expected] of formerUrls) {
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

if (waiting.length > 0) {
  console.log(`Former URLs left to later steps: ${waiting.join(", ")}`);
}
if (errors.length > 0) {
  console.error(`Former URLs that don't resolve:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `${formerUrls.size - waiting.length} former URLs resolve in ${dist}/.`,
);
