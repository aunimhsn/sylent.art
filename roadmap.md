# Roadmap

Steps of the redesign described in [specs.md](specs.md), following the phases of [process.md](process.md). Each step is delivered in its own pull request, which checks its box.

## Reference

Read only by the steps that need them:

- [Technical choices](docs/technical-choices.md): the stack, the commands and the main designs, with their reasons.
- [Branding](docs/branding.md): the visual identity and every design decision of the mock-up (colors, fonts, components, motion, the orange).
- [External services](docs/external-services.md): limits and terms of GitHub Pages, Formspree and GoatCounter, and the risks accepted by the owner.
- [Roadmap archive](docs/roadmap-archive.md): the detail of the steps done, moved there once their pull request is merged.

## Steps

- [x] **0. Project setup** (#1): conventions, process, folders, Claude Code setup, first draft of `specs.md`.
- [x] **1. Specifications** (#2): audiences, value proposition, offers by domain, form, URLs, legal information; Formspree and GoatCounter chosen.
- [x] **2. Technical choices** (#3): Astro, native CSS with tokens, Prettier, ESLint, Stylelint, linkinator.
- [x] **3. Wireframes** (#4): one Excalidraw wireframe per page type, set 1 kept and approved.
- [x] **4. Mock-up** (#5): Night style, every page of the first release in `docs/mockups/` (`python3 docs/mockups/serve.py 8781`), the reference of the build; decisions in `docs/branding.md`; wireframes removed.
- [x] **5. Design system** (#6): tokens in `docs/branding.md` (4 px spacing scale, one size per typographic role, four breakpoints), the mock-up rewritten to use only them, entry in `design-journal.md`.
- [x] **6. Project and deployment** (#7): Astro skeleton (tokens, fonts, base layout, temporary home page), checks (`npm run check`), CI and deployment to `aunimhsn.github.io/sylent.art`, `CNAME`.
- [x] **7. Layout and home page**, in two pull requests:
  - [x] **7a. Shared layout** (#8): header, mobile menu, footer and its orange fluid, call to action, back-to-top button, section heading, shared animations (GSAP bundled), `src/i18n/fr.json`, `src/lib/url.ts`.
  - [x] **7b. Home page**: hero with the cube (`src/scripts/cube.ts`, Three.js bundled) and its intro, partners (`src/data/partners.json`, IGENSIA Tech still without logo), audiences, domain cards that turn (a `shortTitle` on the back, « POO »), pedagogy with the spiral, « Qui suis-je ? » and the key figures; the texts in `src/content/home.json` and `src/content/pedagogy.json` (steps and figures, shared with the about page); the offers collection (`src/content.config.ts`, `src/content/offers/`, one file per domain) with the sample data of the mock-up; the covers (`src/scripts/covers.ts`) with the scenes of the domains and the spiral.
- [ ] **8. Offers**: offer list and one page per module (`/courses/<module>`), redirects of `/courses/<id>` generated from the modules' former ids (and their URLs removed from the `pending` list of `scripts/check-former-urls.mjs`, and `courses` from the skipped links of `linkinator.config.json`). Refine the domains and the modules with the owner first, and decide whether each module gets its own content file (as `specs.md` says) or stays in the file of its domain (as built in 7b). Port from `docs/mockups/shared/covers.js` the scenes of the modules, the `custom` scene, the helpers they use (`along`, `circle`, `random`, `edges`) and the tilt of the module cards into `src/scripts/covers.ts`, and the module card styles (`.card-domain`, `.card[id]`) and the drawn rules (`data-draw`) of the program. From the code review of 7b: write each figure once (« 900+ h », « 2021 », « 5 » are in the cube and in `pedagogy.json`; « Huit domaines » should follow the number of offer files), make the schema refuse an unknown `scene` and a duplicate `order`, and read the colors of the cube and the covers from the tokens (`--secondary`, `--text`, `--cover-bg`).
- [ ] **9. Articles** (after the launch): article list and the two former articles at readable URLs, redirects of `/articles/1` and `/articles/2` to them. Until then, the first release redirects `/articles`, `/articles/1` and `/articles/2` to the home page and has no « Articles » link.
- [ ] **10. About and contact**: about page, contact form (Formspree), legal notice (`/legal`) and privacy policy (`/policy`); their former URLs removed from the `pending` list of `scripts/check-former-urls.mjs`, and their pages from the skipped links of `linkinator.config.json`. Decide with the owner how the links in running text stand out (underline or 3:1 contrast, WCAG 1.4.1), since the mock-up doesn't underline them, and record it in `docs/branding.md`. SIRET and NDA in `specs.md`. Decide with the owner whether the « Qui suis-je ? » block of the home page stays there or moves to the about page. Reuse `partner-reel.astro`, `pedagogy-steps.astro` and `key-figures.astro` (the figures larger there, `--size-figure-large`).
- [ ] **11. Launch**: 404 page, GoatCounter, sitemap, final checks on `github.io` (the `pending` list of `scripts/check-former-urls.mjs` and the skipped internal links of `linkinator.config.json` empty), DNS records described for the owner; redirect pages in French (`experimental.redirectPage`, `src/pages/3xx.astro`, if still experimental decide with the owner); once the DNS points to GitHub Pages, remove `SITE_URL` and `BASE_PATH` from `deploy.yml` and the `check:base` script, set the custom domain in the Pages settings and enforce HTTPS (see [Deployment](docs/technical-choices.md#deployment)).
- [ ] **12. Testimonials**: once the owner has collected at least three (LinkedIn recommendations, feedback from schools and learners, with consent to publish), add a testimonials section.

The steps may be split into sub-steps when a pull request grows too large.
