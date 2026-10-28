# Technical choices

The technical choices of the [roadmap](../roadmap.md), with their reasons and the alternatives rejected. Chosen with the owner on 2026-10-27 (step 2); the project skeleton that applies them is built in step 6.

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
| Formatter | Prettier, with `prettier-plugin-astro` | The usual formatter for Astro, CSS, JavaScript, JSON and Markdown: one tool for every file. |
| Linter | ESLint with `eslint-plugin-astro` and its accessibility rules (`eslint-plugin-jsx-a11y`); Stylelint with `stylelint-config-standard`; `astro check` | ESLint catches errors and missing accessibility attributes (`alt`, labels) in the templates, Stylelint invalid or duplicate CSS, `astro check` type errors and wrong component props. |
| Link check | linkinator on the built site, plus a script for the former URLs | See [Link check](#link-check). |
| Deployment | GitHub Actions workflow (`.github/workflows/deploy.yml`) on every push to `main`, with `withastro/action` and `actions/deploy-pages` | A merged pull request is deployed without a manual step, using the actions documented by Astro and GitHub. |
| Checks in CI | GitHub Actions workflow (`.github/workflows/ci.yml`) on every pull request | Runs the same commands as before a commit: build, format, lint, links. |

## Astro

- **Redirects**: in a static build, Astro's `redirects` option writes, for each former URL, a page with a canonical link and an immediate `<meta http-equiv="refresh">`, which is what `specs.md` asks for since GitHub Pages has no server-side redirects. The redirects of `/courses/<id>` are computed from the `former-ids` of the offer files, and those of `/articles/<id>` from a `former-id` field of the articles, so a former URL cannot be forgotten.
- **Content collections**: each offer and article is a Markdown file whose front matter is validated by a schema at build time (title, summary, slug, `former-ids`, modules…). A missing field or a duplicate former id fails the build instead of publishing a broken page.
- **Images**: the `astro:assets` `<Image>` component converts the images to WebP at the size they are shown and sets their width and height, which avoids layout shifts.
- **JavaScript**: none by default. The only scripts are the contact form (sent with `fetch` so that the visitor stays on the page; the form still posts to Formspree without JavaScript) and the GoatCounter counter.
- **`CNAME`**: kept in `public/CNAME`, which Astro copies as is to the root of the published site.
- **Fonts**: self-hosted from `public/fonts/` (license allowing it, e.g. SIL Open Font License) and preloaded; chosen in step 5.
- Rejected:
  - **Eleventy**: just as capable for a static site, but the redirects, image conversion and content validation have to be assembled from plugins and configuration by hand.
  - **Hugo**: one fast binary, but its Go template language is harder to read and to edit for the owner.
  - **Hand-written HTML**: the header, navigation and footer would be copied in every page, and nothing would check the content or the redirects.
  - **Laravel or Vue (as an application)**: known to the owner, but they need a server or ship a JavaScript application, while the site is a handful of static pages.

## Styles

- **Design tokens** are the named values of the visual design: `--signal: #d3450e`, `--space-4: 16px`, `--size-card-title: 21px`. They were written in step 5, in [docs/branding.md](branding.md).
- In native CSS, they are CSS custom properties declared once in `src/styles/tokens.css`, and every component uses them (`color: var(--signal)`). Changing the main color then means changing one line.
- This matches the mock-up: its components use only these variables. The `:root` block of `docs/mockups/shared/site.css` becomes `tokens.css` as is, and the CSS of the mock-up's components can be copied into the Astro components without translation.
- The **breakpoints** (640, 760, 900 and 1100 px) can't be CSS variables, since a media query doesn't read them: they are written as numbers in the media queries, and listed in [docs/branding.md](branding.md#layout-and-shapes).
- Component styles live in the `<style>` block of each Astro component, which Astro scopes to that component: a class name in one component cannot break another.
- **Tailwind CSS** (liked by the owner for quick changes) is not used for now. If the project moves to it later, Tailwind 4 declares its theme with CSS variables (`@theme`), so the same tokens carry over; record that change here.

## Content

- `src/content/offers/<slug>.md`: one file per domain, named after its slug (see `specs.md`), with its modules and `former-ids`.
- `src/content/articles/<slug>.md`: one file per article, with its date and `former-id` for the two former articles.
- `src/i18n/fr.json`: the interface texts (navigation, footer, buttons, form labels and messages), so that no French text is hard-coded in a component.
- Other French page texts (home, about, contact, legal notice) are Markdown or data files in `src/content/`.
- The site is edited by the owner and Claude Code only, in the repository: no content management system.

## Link check

- **linkinator** serves the built site (`dist/`) as a static host would, so `/about` resolves to `about/index.html` as on GitHub Pages, and follows every internal link of every page. External links are skipped in the regular check, so that a slow third-party site doesn't break the CI.
- **`scripts/check-former-urls.mjs`** checks that every former URL (`/`, `/courses`, `/courses/1` to `/courses/12`, `/articles`, `/articles/1`, `/articles/2`, `/about`, `/contact`, `/policy`) exists in `dist/`, and that each redirect points to a page that exists.
- Rejected: **lychee**, faster, but a Rust binary that the owner would install apart from npm; linkinator runs from `npm ci` locally and in CI alike.

## Commands

Available from step 6, once the project skeleton exists. Run `npm ci` first.

| Command | What it does |
|---|---|
| `npm run dev` | Local development server, reloads on every change (`http://localhost:4321`). |
| `npm run build` | Production build to `dist/`; must finish without errors or warnings. |
| `npm run preview` | Serves the production build of `dist/` locally. |
| `npm run format` | Formats every file with Prettier. |
| `npm run format:check` | Checks the formatting without changing files (used in CI). |
| `npm run lint` | `astro check`, ESLint and Stylelint. |
| `npm run check:links` | Checks the internal links and the former URLs on `dist/` (run after `npm run build`). |
| `npm run check` | Everything run before a commit and in CI: format check, lint, build, links. |

## Exceptions to the naming conventions

Imposed by Astro or the tools, everything else in kebab-case:

- Dynamic route files use brackets: `src/pages/courses/[slug].astro`, `src/pages/articles/[slug].astro`.
- Configuration files keep the names the tools look for: `astro.config.mjs`, `src/content.config.ts`, `eslint.config.js`, `.prettierrc`, `.stylelintrc.json`, `.nvmrc`, `tsconfig.json`.
- Component files stay in kebab-case (`src/components/site-header.astro`), although the Astro documentation names them in PascalCase; they are imported under a PascalCase name (`import SiteHeader from ...`), as Astro requires for components in templates.
