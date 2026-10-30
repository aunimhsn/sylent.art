// Checks that no page of the built site (dist/) is wider than a phone screen. A block that runs
// past the right edge (a large faded word, a grid) lets Chrome on Android widen the page to show
// it, which leaves a black band beside the grids (step 10 of roadmap.md). Each page is loaded in
// Chromium as on a phone, then scrolled to the bottom, since the faded words slide with the
// scroll. It also checks that the large white titles of the module, domain and section headings
// hold on one line, as the owner asked, on a phone and on a computer, where « Développement web »
// once broke mid-word. Those titles are sized from the metrics of their font measured once
// (src/data/manrope-800.json): it first checks that they were measured on the font the site
// serves, which Google Fonts may update. Run after `npm run build`:
// `node scripts/check-overflow.mjs [dist]`.
import {
  createReadStream,
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { createServer } from "node:http";
import { extname, join, relative, sep } from "node:path";
import { chromium } from "playwright";

const [dist = "dist"] = process.argv.slice(2);

// The narrowest screen still met, the narrowest common Android one, and a wider one (the owner's
// phone is about 393 px); then a small and a large computer screen.
const widths = [320, 360, 412];
const desktops = [1024, 1440];

const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

/**
 * Every page of the site, as its URL path, the not-found page (404.html) included: the redirect
 * pages are left out.
 */
const pagesOf = (folder) =>
  readdirSync(folder).flatMap((name) => {
    const path = join(folder, name);
    if (statSync(path).isDirectory()) return pagesOf(path);
    const notFound = name === "404.html" && folder === dist;
    if (name !== "index.html" && !notFound) return [];
    if (/http-equiv=["']?refresh/i.test(readFileSync(path, "utf8"))) return [];
    if (notFound) return ["/404.html"];
    const parent = relative(dist, folder).split(sep).join("/");
    return [parent ? `/${parent}/` : "/"];
  });

// A static server, as GitHub Pages serves dist/: a folder serves its index.html.
const server = createServer((request, response) => {
  let path = join(dist, decodeURIComponent(request.url.split("?")[0]));
  if (existsSync(path) && statSync(path).isDirectory()) {
    path = join(path, "index.html");
  }
  if (!existsSync(path)) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    "content-type": types[extname(path)] ?? "application/octet-stream",
  });
  createReadStream(path).pipe(response);
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

// Scrolls the page down to the bottom and returns the largest width it reached. It runs in the
// page, with the globals of the browser. Each step jumps at once: the smooth scrolling of the
// site would only start a scroll that the next step interrupts.
/* global document, getComputedStyle, innerHeight, scrollTo */
const widest = async () => {
  await document.fonts.ready;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const root = document.documentElement;
  let width = root.scrollWidth;
  for (let y = 0; y <= root.scrollHeight; y += innerHeight / 2) {
    scrollTo({ top: y, behavior: "instant" });
    await wait(50);
    width = Math.max(width, root.scrollWidth);
  }
  return width;
};

// The large white titles on more than one line, with their number of lines: their line height
// is at most their font size. Runs in the page.
const wrappedTitles = () =>
  [...document.querySelectorAll(".page-title, .heading-title")].flatMap(
    (title) => {
      const size = parseFloat(getComputedStyle(title).fontSize);
      const lines = Math.round(title.getBoundingClientRect().height / size);
      return lines > 1
        ? [`« ${title.textContent.trim()} » on ${lines} lines`]
        : [];
    },
  );

// The measured file is named after the font file the build serves, in dist/_astro/fonts/.
const { font } = JSON.parse(readFileSync("src/data/manrope-800.json", "utf8"));
const served = `${font.match(/-([0-9a-f]+)\.woff2$/)?.[1]}.woff2`;
if (!existsSync(join(dist, "_astro", "fonts", served))) {
  console.error(
    `src/data/manrope-800.json measures ${font}, which the site no longer serves: run \`npm run fonts:metrics\`.`,
  );
  process.exit(1);
}

const pages = pagesOf(dist);
if (pages.length === 0) {
  console.error(`No page in ${dist}/: build the site first.`);
  process.exit(1);
}
const browser = await chromium.launch();
const errors = [];

try {
  for (const width of [...widths, ...desktops]) {
    const phone = widths.includes(width);
    const context = await browser.newContext({
      viewport: { width, height: 800 },
      deviceScaleFactor: phone ? 3 : 1,
      isMobile: phone,
      hasTouch: phone,
    });
    // Only the local server is reached: the script of GoatCounter, in the build for sylent.art,
    // would otherwise be fetched for every page, and a slow gc.zgo.at would fail the check.
    await context.route(
      (url) => url.origin !== origin,
      (route) => route.abort(),
    );
    // A few tabs at once, each taking the next page of the list. A page that fails to load, or
    // whose scripts throw, is reported with the others instead of stopping the check.
    const queue = [...pages];
    const tab = async () => {
      const page = await context.newPage();
      let current = "";
      page.on("pageerror", (error) => {
        errors.push(
          `${current}: script error at ${width} px, ${error.message}`,
        );
      });
      for (let path; (path = queue.shift());) {
        current = path;
        try {
          await page.goto(`${origin}${path}`, { waitUntil: "load" });
          const reached = await page.evaluate(widest);
          if (reached > width) {
            errors.push(`${path}: ${reached} px wide on a ${width} px screen`);
          }
          for (const title of await page.evaluate(wrappedTitles)) {
            errors.push(`${path}: ${title} at ${width} px`);
          }
        } catch (error) {
          errors.push(`${path}: not checked at ${width} px, ${error.message}`);
        }
      }
    };
    await Promise.all(Array.from({ length: 4 }, tab));
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

if (errors.length > 0) {
  const report = errors.sort().join("\n- ");
  console.error(
    `Pages wider than the screen, titles on several lines, or pages not checked:\n- ${report}`,
  );
  process.exit(1);
}
console.log(
  `${pages.length} pages and their titles fit a screen of ${[...widths, ...desktops].join(", ")} px.`,
);
