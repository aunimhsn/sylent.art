// Checks that every URL of the former site still resolves in the built site (dist/): either a
// page, or a redirect to a page that exists. Run after `npm run build`.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";

const formerUrls = [
  "/",
  "/courses",
  ...Array.from({ length: 12 }, (_, index) => `/courses/${index + 1}`),
  "/articles",
  "/articles/1",
  "/articles/2",
  "/about",
  "/contact",
  "/policy",
];

// The former URLs whose page or redirect a later step of roadmap.md builds. Remove each one
// with its step: the list must be empty for the launch (step 11).
const pending = new Map([
  ["/courses", 8],
  ...Array.from({ length: 12 }, (_, index) => [`/courses/${index + 1}`, 8]),
  ["/about", 10],
  ["/contact", 10],
  ["/policy", 10],
]);

/** The file that GitHub Pages serves for a URL path, as written by Astro. */
const fileOf = (path) => join(dist, path, "index.html");

/** The path a redirect page of Astro leads to, or null for a regular page. */
const redirectOf = (html) =>
  html.match(/<meta http-equiv="refresh" content="\d+;\s*url=([^"]+)"/i)?.[1] ??
  null;

const errors = [];
const waiting = [];

for (const url of formerUrls) {
  const file = fileOf(url);
  if (!existsSync(file)) {
    if (pending.has(url)) waiting.push(`${url} (step ${pending.get(url)})`);
    else errors.push(`${url}: no page in ${dist}/`);
    continue;
  }
  if (pending.has(url)) {
    errors.push(`${url}: built, remove it from the pending list`);
  }
  const target = redirectOf(readFileSync(file, "utf8"));
  if (
    target !== null &&
    !existsSync(fileOf(new URL(target, "https://sylent.art").pathname))
  ) {
    errors.push(`${url}: redirects to ${target}, which doesn't exist`);
  }
}

if (waiting.length > 0) {
  console.log(`Former URLs left to later steps: ${waiting.join(", ")}`);
}
if (errors.length > 0) {
  console.error(`Former URLs that don't resolve:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(
  `${formerUrls.length - waiting.length} former URLs resolve in ${dist}/.`,
);
