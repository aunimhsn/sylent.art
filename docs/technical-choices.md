# Technical choices

The technical choices of the [roadmap](../roadmap.md), with their reasons and the alternatives rejected. Chosen with the owner on 2026-10-27 (step 2) and applied by the project skeleton of step 6 (2026-10-28).

## Stack

| Topic | Choice | Reason |
|---|---|---|
| Hosting | GitHub Pages, custom domain `sylent.art` | Free for a public repository, no server to maintain, HTTPS included. The site must work without a server. |
| Static site generator | [Astro](https://astro.build/) 7, static output | Built-in redirects, validated content collections, image optimization and zero JavaScript by default (see [Astro](#astro)). Its syntax (HTML, CSS, a little JavaScript, close to Vue) is familiar to the owner, who edits the site too. |
| Runtime and packages | Node.js 24 LTS, npm (`package-lock.json`) | Astro 7 needs Node.js 22.23.4 or later. The version is pinned in `.nvmrc` and in `engines` of `package.json`, and CI uses the same one. npm is already installed: no other package manager to learn. |
| Styles | Native CSS, design tokens as CSS custom properties | See [Styles](#styles). Tailwind CSS may come later. |
| Content | Markdown files in Astro content collections; interface texts in a French translation file | The French content stays out of the layout and components, so that a translation can be added later (see [Content](#content)). |
| Contact form | Formspree, free plan | No server needed, 50 submissions a month (far above the expected volume), spam filter. Web3Forms rejected: its documentation contradicts itself on storage. See [external-services.md](external-services.md). |
| Audience measurement | GoatCounter | No cookie, so no consent banner; data hosted in the European Union; free for a small business. Google Analytics rejected: consent banner required. See [external-services.md](external-services.md). |
| Formatter | Prettier, with `prettier-plugin-astro` | The usual formatter for Astro, CSS, JavaScript, JSON, YAML and the Markdown content: one tool for every file of the site. The project documentation (`*.md` at the root, `docs/`, `.claude/`) is left out (`.prettierignore`): Prettier would pad every table to its widest cell, which makes the long tables unreadable in an editor. |
| Linter | ESLint with `typescript-eslint`, `eslint-plugin-astro` and its strict accessibility rules (`jsx-a11y-strict`, with `eslint-plugin-jsx-a11y-x`); Stylelint with `stylelint-config-standard` and `stylelint-config-html` (the `<style>` blocks of the components); `astro check` | ESLint catches errors and missing accessibility attributes (`alt`, labels) in the templates, Stylelint invalid or duplicate CSS, `astro check` type errors and wrong component props. `eslint-plugin-jsx-a11y-x` is the maintained fork that `eslint-plugin-astro` supports: the original `eslint-plugin-jsx-a11y` has had no release since 2024 and refuses ESLint 10. Stylelint keeps the colors in six-digit hex (`color-hex-length: long`), as `docs/branding.md` writes them. |
| Link check | linkinator on the built site, plus a script for the former URLs | See [Link check](#link-check). |
| Deployment | GitHub Actions workflow (`.github/workflows/deploy.yml`) on every push to `main`, with `withastro/action` and `actions/deploy-pages` | A merged pull request is deployed without a manual step, using the actions documented by Astro and GitHub. See [Deployment](#deployment). |
| Checks in CI | GitHub Actions workflow (`.github/workflows/ci.yml`) on every pull request | Runs the same commands as before a commit: build, format, lint, links. |

## Astro

- **URLs with a final slash**: Astro writes each page as a folder with an `index.html` (`build.format: "directory"`, its default), and GitHub Pages serves `about/index.html` at `/about/` and redirects `/about` to it (301): the former URLs keep working and keep their ranking. The links and canonical URLs end with a slash, and `trailingSlash: "always"` makes the development server behave the same way. Rejected: one `about.html` file per page, which GitHub Pages serves at `/about` without a redirect, but whose behavior is not documented when a folder of the same name exists (`courses.html` beside `courses/`).
- **Redirects**: in a static build, Astro's `redirects` option writes, for each former URL, a page with a canonical link and an immediate `<meta http-equiv="refresh">`, which is what `specs.md` asks for since GitHub Pages has no server-side redirects. Astro doesn't add the base path to their destination: `astro.config.mjs` adds it. The redirects of `/courses/<id>` are computed from the `former-ids` of the offer files, and those of `/articles/<id>` from a `former-id` field of the articles, so a former URL cannot be forgotten.
- **Content collections**: each offer and article is a Markdown file whose front matter is validated by a schema at build time (title, summary, slug, `former-ids`, modules…). A missing field or a duplicate former id fails the build instead of publishing a broken page.
- **Images**: the `astro:assets` `<Image>` component converts the images to WebP at the size they are shown and sets their width and height, which avoids layout shifts.
- **JavaScript**: the approved mock-up moves (section headings, reveals, the 3D cube and covers, the orange fluid of the grids; see [docs/branding.md](branding.md#motion)), so the site bundles [GSAP](https://gsap.com/) (with ScrollTrigger and SplitText) and, from step 7b, [Three.js](https://threejs.org/), installed with npm: Astro bundles the `<script>` of the components and the modules of `src/scripts/` into a few files served by the site itself, without a CDN. The content never depends on them: the pages are complete HTML, the elements an animation reveals show after 4 s if the scripts don't start, and nothing moves when the visitor asked their system to reduce motion (`data-motion`, set in the `<head>` before the first paint; `?motion=off` does the same, for checks and screenshots). The contact form is sent with `fetch` so that the visitor stays on the page, and still posts to Formspree without JavaScript. Chosen on 2026-10-28 (step 7), replacing « no JavaScript but the form and GoatCounter », written before the mock-up.
- **Licenses of the scripts**: Three.js is under the MIT license. GSAP is free for commercial use under its own [standard license](https://gsap.com/standard-license), which is not an open source license: it forbids only using GSAP in a tool that competes with Webflow, its owner, which the site doesn't. Noted with the owner on 2026-10-28.
- **`CNAME`**: kept in `public/CNAME`, which Astro copies as is to the root of the published site.
- **Fonts**: Astro's Fonts API (`fonts` in `astro.config.mjs`, `<Font />` in the layout) downloads Manrope, Anaheim and Bodoni Moda (SIL Open Font License) from Google Fonts at build time and serves them from the site itself, with a fallback font adjusted to their metrics so that the text doesn't move when they load. Only what the site uses is downloaded: the Latin characters, Manrope from 600 to 800, Anaheim 500, and the letters I, V and X of Bodoni Moda with its optical size axis, which gives the large numerals their high contrast (under 2 KB). Manrope and Anaheim are preloaded. They replace the `public/fonts/` folder first planned: no font file to download and update by hand.
- Rejected:
  - **Eleventy**: just as capable for a static site, but the redirects, image conversion and content validation have to be assembled from plugins and configuration by hand.
  - **Hugo**: one fast binary, but its Go template language is harder to read and to edit for the owner.
  - **Hand-written HTML**: the header, navigation and footer would be copied in every page, and nothing would check the content or the redirects.
  - **Laravel or Vue (as an application)**: known to the owner, but they need a server or ship a JavaScript application, while the site is a handful of static pages.

## Deployment

- `.github/workflows/deploy.yml` follows the [Astro guide](https://docs.astro.build/en/guides/deploy/github/): `withastro/action` installs, builds and uploads `dist/`, then `actions/deploy-pages` publishes it. In the repository's **Settings → Pages**, the source is **GitHub Actions**.
- **Until the launch**, the owner checks the site at https://aunimhsn.github.io/sylent.art/, a project site under the `/sylent.art` base path. The workflow sets `SITE_URL` and `BASE_PATH`, read by `astro.config.mjs`; without them (development server, checks, CI) the site is built for `https://sylent.art` at the root. So every internal link and asset path must go through the base: Astro prefixes the files it builds (styles, fonts, images), and the links written in the templates start with `import.meta.env.BASE_URL`. `npm run check:base` builds this preview into `dist-base/sylent.art/` and checks its links, so a link without the base fails the checks. Under a base, the layout adds `noindex`, so that search engines don't index the preview beside the former site.
- **At the launch** (step 11), once the DNS of `sylent.art` points to GitHub Pages: remove the two variables from `deploy.yml` and the `check:base` script, set the custom domain in the Pages settings and enforce HTTPS. A workflow with `actions/deploy-pages` ignores the `CNAME` file for the domain; `public/CNAME` is kept as `CLAUDE.md` asks.
- `.github/workflows/ci.yml` runs `npm run check` on every pull request, with the Node.js version of `.nvmrc`. A ruleset on `main` (created on 2026-10-28) requires a pull request, merged by squash only, whose `check` job passes, and forbids force pushes and deleting the branch; the owner, as administrator, can bypass it in an emergency.
- Only the `deploy` job may write to GitHub Pages (`pages: write`, `id-token: write`); the build job, which runs the dependencies, only reads the repository. The actions are referenced by major version, as in the guides; pinning them by commit and Dependabot are left for after the launch.

## Styles

- **Design tokens** are the named values of the visual design: `--signal: #d3450e`, `--space-4: 16px`, `--size-card-title: 21px`. They were written in step 5, in [docs/branding.md](branding.md).
- In native CSS, they are CSS custom properties declared once in `src/styles/tokens.css`, and every component uses them (`color: var(--signal)`). Changing the main color then means changing one line.
- This matches the mock-up: its components use only these variables. The `:root` block of `docs/mockups/shared/site.css` becomes `tokens.css` as is, and the CSS of the mock-up's components can be copied into the Astro components without translation.
- The **breakpoints** (640, 760, 900 and 1100 px) can't be CSS variables, since a media query doesn't read them: they are written as numbers in the media queries, and listed in [docs/branding.md](branding.md#layout-and-shapes).
- Component styles live in the `<style>` block of each Astro component, which Astro scopes to that component: a class name in one component cannot break another. A component styles the inside of a child component (an SVG logo, an icon) with `:global(...)` inside one of its own selectors, which Stylelint accepts.
- The classes shared by every page (`.wrap`, `.section`, `.button`, `.lead`, `.motto`, `.glass`, `.reveal`, `.visually-hidden`…) are in `src/styles/global.css`. They are those of the mock-up without its `app-` prefix, which only kept the mock-up's names apart: a style copied from the mock-up drops the prefix.
- **Tailwind CSS** (liked by the owner for quick changes) is not used for now. If the project moves to it later, Tailwind 4 declares its theme with CSS variables (`@theme`), so the same tokens carry over; record that change here.

## Content

- `src/content/offers/<slug>.md`: one file per domain, named after its slug (see `specs.md`), with its modules and `former-ids`.
- `src/content/articles/<slug>.md`: one file per article, with its date and `former-id` for the two former articles.
- `src/i18n/fr.json`: the interface texts (navigation, footer, buttons, form labels and messages), so that no French text is hard-coded in a component. A script that shows a text (« Copiée », the label of the menu button) reads it from a data attribute that the component fills from this file.
- `src/data/contact.json`: the public contact details (email, phone, LinkedIn, GitHub) and the NDA, shared by the footer, the contact page and the legal notice.
- `src/lib/url.ts`: every internal link goes through `href("/about/")`, which adds the base path of the github.io preview (see [Deployment](#deployment)).
- Other French page texts (home, about, contact, legal notice) are Markdown or data files in `src/content/`.
- The site is edited by the owner and Claude Code only, in the repository: no content management system.

## Link check

- **linkinator** serves the built site (`dist/`) as a static host would, so `/about` resolves to `about/index.html` as on GitHub Pages, and follows every internal link of every page. External links are skipped in the regular check, so that a slow third-party site doesn't break the CI.
- **`scripts/check-former-urls.mjs`** checks that every former URL (`/`, `/courses`, `/courses/1` to `/courses/12`, `/articles`, `/articles/1`, `/articles/2`, `/about`, `/contact`, `/policy`) exists in `dist/`, that each redirect points to a page that exists (a redirect whose target it can't read fails), and that the dropped URLs (`/creations`, `/register`, `/login`) are not built. The URLs whose page a later step builds are in its `pending` list, with the step: each step removes its own (the check fails if a pending URL is built), and the list is empty at the launch (step 11).
- linkinator's options are in `linkinator.config.json`: it follows the internal links, checks the URLs of the CSS (fonts) and the anchors (`#…`), and skips every address that isn't its local server.
- **Links to pages still to build**: the header and the footer link to `/courses/`, `/about/`, `/contact/`, `/legal/` and `/policy/` from step 7, before their pages exist (steps 8 and 10). linkinator skips them through the second pattern of `skip` in `linkinator.config.json`, as `check-former-urls.mjs` keeps its `pending` list: each step removes the pages it builds from that pattern, and the pattern is gone at the launch (step 11).
- Rejected: **lychee**, faster, but a Rust binary that the owner would install apart from npm; linkinator runs from `npm ci` locally and in CI alike.

## Commands

Run `npm ci` first. They are also in the `scripts` of `package.json`.

| Command | What it does |
|---|---|
| `npm run dev` | Local development server, reloads on every change (`http://localhost:4321`). |
| `npm run build` | Production build to `dist/`; must finish without errors or warnings. |
| `npm run preview` | Serves the production build of `dist/` locally. |
| `npm run format` | Formats every file with Prettier. |
| `npm run format:check` | Checks the formatting without changing files (used in CI). |
| `npm run lint` | `astro check`, ESLint and Stylelint. |
| `npm run check:links` | Checks the internal links and the former URLs on `dist/` (run after `npm run build`). |
| `npm run check:base` | Builds the github.io preview (`/sylent.art` base) into `dist-base/` and checks its links; removed at the launch. |
| `npm run check` | Everything run before a commit and in CI: format check, lint, build, links, links of the preview. |

## Exceptions to the naming conventions

Imposed by Astro or the tools, everything else in kebab-case:

- Dynamic route files use brackets: `src/pages/courses/[slug].astro`, `src/pages/articles/[slug].astro`.
- Configuration files keep the names the tools look for: `astro.config.mjs`, `src/content.config.ts`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.stylelintrc.json`, `linkinator.config.json`, `.nvmrc`, `tsconfig.json`, `.vscode/extensions.json` (the VS Code extensions of Astro, Prettier, ESLint and Stylelint, proposed when the folder is opened).
- Component files stay in kebab-case (`src/components/site-header.astro`), although the Astro documentation names them in PascalCase; they are imported under a PascalCase name (`import SiteHeader from ...`), as Astro requires for components in templates.
