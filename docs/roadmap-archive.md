# Roadmap archive

The detail of the steps of [roadmap.md](../roadmap.md) once their pull request is merged, newest first.

## 11. French URLs in a tree (#30)

Decided by the owner on 2026-10-29, before the launch, while changing the paths costs nothing:

- Every page at a French path following the tree of the offers: `/domaines/<domain>/modules/<module>/` (`src/pages/domaines/[domain]/modules/[module].astro`, `modulePath` in `src/lib/offers.ts`), `/a-propos/`, `/confidentialite/`, `/mentions-legales/`.
- `/domaines/` holds the former offer list until the domain pages of step 12; the domain cards of the home page lead there, to the first module of their domain (`/domaines/#<domain>`).
- The domain slugs `developpement-ia` and `python`; the module slugs after their short names, `git-github`, `methode-agile`, `poo`. A slug is unique within its domain only (the module `python` of the domain `python`).
- Redirects: `/courses`, `/about` and `/policy` to their French paths (`astro.config.mjs`), `/courses/<id>` to its module (`src/pages/courses/[id].astro`), a draft's to `/domaines/#<domain>`. The module pages and the legal notice of the preview moved without a redirect: they were never on `sylent.art`.
- `scripts/check-former-urls.mjs` checks the exact destination of each redirect and its anchor, on `dist/` and on the github.io preview (`npm run check:base`).

## 9b. Contact page (#14)

Built on 2026-10-29 from the mock-up (`docs/mockups/contact-site.html`):

- The contact page (`/contact/`, the URL of the former site): the form beside « Autres moyens », its texts in `src/content/contact.json` and in the `form` group of `src/i18n/fr.json`, the address of the Formspree form in `src/data/contact.json`.
- The form (`src/components/contact-form.astro`, `src/scripts/contact-form.ts`): two fields checked when the visitor leaves them, then as they correct them; sent with `fetch` (`Accept: application/json`), and posted to Formspree without JavaScript, the browser checking the fields; the honeypot `_gotcha`; the confirmation, whose title takes the focus; the failure with the email address as an `.inline-link`, the text kept; the button stays focusable while sending (`aria-disabled`).
- The thick caret and the scrollbar of the message (`src/scripts/thick-caret.ts`).
- `/contact` out of the `pending` list of `scripts/check-former-urls.mjs`, and the skipped internal links of `linkinator.config.json` gone: every page of the first release exists.

## 9a. About and legal pages (#13)

Built on 2026-10-28 from the mock-up (`docs/mockups/about-site.html`, `legal-site.html`, `privacy-site.html`):

- The about page (`/about/`, figures larger), the legal notice (`/legal/`) and the privacy policy (`/policy/`) on a shared `text-page.astro` with its table of contents; their texts in `src/content/about.json`, `legal.json` and `policy.json`.
- Links and stressed text written `[text](url)` and `**text**` in the content files (`src/lib/rich-text.ts`), the contact details read from `src/data/contact.json` (SIRET and the sentence on the agrément added); links in running text underlined (`.inline-link`, decided with the owner on 2026-10-28).
- The « Qui suis-je ? » block stays on the home page; the sentence on the agrément after the NDA of the footer.
- The grid textures written once in `global.css` (`.grid-lines`, `.grid-texture`, `.is-page-top`); the dates through `src/lib/dates.ts`.

## 8b. Module content (#11)

Written on 2026-10-28 with the owner, module by module, then aligned on the course material of the private `sylent-courses` repository (chapters and exercise names only):

- The presentation, audience, level, prerequisites, objectives and program of the 14 modules still without content; the first drafts of the former courses reviewed against their lessons (Algorithmique, Merise, MySQL, JavaScript, Python, POO, SOLID, Git et GitHub, Scrum).
- The modules stay independent: MySQL and PostgreSQL both start from the basics, since a client asks for one or the other. Both last 3 days, as MySQL on the former site; Vue and Alpine keep 2 days and 1 day.
- `audience`, `level`, `prerequisites`, `objectives` and `program` required, and never empty, in `src/content.config.ts`; `toSpecify` and `programToCome` dropped from `src/content/courses.json`.

## 8a. Offer pages (#10)

Built on 2026-10-28 from the mock-up (`docs/mockups/courses-site.html`, `docs/mockups/module-site.html`):

- The offer list (`/courses/`), one page per module (`/courses/<module>/`) and the redirects of the former `/courses/<id>`.
- The collections split into `src/content/domains/` and `src/content/modules/`, one file per module, checked across files by `src/lib/offers.ts`.
- The scenes of the modules, the `custom` scene and the tilt of the cards (`src/scripts/module-scenes.ts`, `src/scripts/cover-kit.ts`).
- A first draft of the 12 former courses and of Claude Code.
- From the code review of 7b: the figures of the cube read from `pedagogy.json`, « Huit domaines » counted, unknown scenes and duplicate orders refused, the colors of the cube and the covers read from the tokens.

## 7b. Home page (#9)

Built on 2026-10-28 from the mock-up (`docs/mockups/home-site.html`):

- Hero with the cube (`src/scripts/cube.ts`, Three.js bundled) and its intro, partners (`src/data/partners.json`, IGENSIA Tech still without logo), audiences, domain cards that turn (a `shortTitle` on the back, « POO »), pedagogy with the spiral, « Qui suis-je ? » and the key figures.
- The texts in `src/content/home.json` and `src/content/pedagogy.json` (steps and figures, shared with the about page).
- The offers collection, one file per domain with the sample data of the mock-up (split into domains and modules in step 8a), and the covers (`src/scripts/covers.ts`) with the scenes of the domains and the spiral.

## 7a. Shared layout (#8)

Built on 2026-10-28 from the mock-up (`docs/mockups/shared/`):

- Header with its navigation and mobile menu (the page made inert while it is open, closed past 900 px), footer with its wordmark and the orange fluid of its grid (`src/scripts/grid-fluid.ts`), call to action, back-to-top button, section heading (titles without accents, their real name in `aria-label`).
- Shared animations in `src/scripts/motion.ts` with GSAP bundled (ScrollTrigger, SplitText); nothing moves with reduced motion (`data-motion`, `?motion=off`), and the revealed elements show after 4 s if the scripts don't start.
- Interface texts in `src/i18n/fr.json` (scripts read theirs from data attributes), contact details in `src/data/contact.json`, internal links through `src/lib/url.ts`; the email copies itself, with the mail application as fallback.
- The links to pages still to build skipped by linkinator (`linkinator.config.json`), each later step removing its own.

## 6. Project and deployment (#7)

Built on 2026-10-28, as chosen in `docs/technical-choices.md` (which records the details):

- Astro 7.4 project: `src/styles/tokens.css` (the `:root` of the mock-up, unchanged values), the base styles, a base layout (language, title, description, canonical URL, fonts) and a temporary home page; the interface texts in `src/i18n/fr.json`; `public/CNAME`.
- Fonts through Astro's Fonts API, downloaded from Google Fonts at build time and self-hosted: Manrope 600–800, Anaheim 500, only I, V and X of Bodoni Moda; Manrope and Anaheim preloaded.
- URLs with a final slash (`/about/`), which GitHub Pages reaches from the former `/about` by a redirect; the redirects of `/articles`, `/articles/1` and `/articles/2` to the home page.
- Checks: Prettier (without the project documentation), `astro check`, ESLint with the strict accessibility rules (`eslint-plugin-jsx-a11y-x`, the maintained fork), Stylelint, linkinator and `scripts/check-former-urls.mjs`, whose `pending` list holds the former URLs of steps 8 and 10; all in `npm run check`, run by `ci.yml` on every pull request.
- `deploy.yml` from the Astro guide, building for https://aunimhsn.github.io/sylent.art/ until the launch (`SITE_URL`, `BASE_PATH`), with `noindex` and its links checked by `npm run check:base`; GitHub Pages enabled with the « GitHub Actions » source, and a ruleset requiring the CI on `main`.
- Code review applied: Bodoni Moda with its optical size axis, the preview's links checked, a non-breaking space, a stricter former URL check (unreadable redirects, dropped URLs), Pages permissions on the deploy job only, `noindex` on the preview.

## 5. Design system (#6)

Written on 2026-10-28, in `docs/branding.md`:

- The tokens of the mock-up: a 4 px spacing scale, one size token per typographic role, four breakpoints (640, 760, 900 and 1100 px; 960 merged into 900).
- The mock-up rewritten to use only the tokens; the tone of the texts settled; the back of the flipped card spaced.
- An entry in `design-journal.md`; the code review applied.

## 4. Mock-up (#5)

Approved by the owner on 2026-10-28, in `docs/mockups/` (viewer `home.html`, pages `*-site.html`, shared parts in `shared/`); every decision is in `docs/branding.md`:

- Night style: neutral blacks and white, Manrope for the titles, Anaheim medium for the text, the SYLENT logo, the section headings of the former site over a large faded word; an orange signal color used sparingly, with a meaning (trails, glow on arrival, small stories). Console, Atelier and a red signal were set aside.
- Every page of the first release: home, course list (one card per module), module page, about, contact (two fields, Formspree simulated in every state), legal notice, privacy policy, not-found page.
- A small Three.js scene for every domain and module; on the home page the domain cards turn to show their modules, the custom request is a dashed band, and the pedagogy shows a spiral of the cycle of a lesson (theory 20 %, practice 50 %, correction 30 %).
- New domain « Conception logicielle » (object-oriented programming, UML, SOLID, design patterns); one short sentence per module; Roman numerals in Bodoni Moda for the steps.
- `specs.md` settled with the mock-up: one page per module at `/courses/<module>`, `/courses/1` to `12` redirected to their module, no domain pages in the first release, `/policy` for the privacy policy and `/legal` for the legal notice, SIRET and NDA, no photo.
- `CLAUDE.md`: the large uppercase titles are shown without accents, an exception accepted by the owner.
- Two code reviews applied; the wireframes of step 3 removed, the mock-up being the reference.

## 3. Wireframes (#4)

Approved by the owner on 2026-10-28, in `docs/wireframes/1/`:

- Three layout directions drawn for every page type (home, course list, course, article list, article, about, contact), at phone and desktop width, in grayscale, one group per block.
- Set 1 (« Editorial ») kept and edited by the owner in Excalidraw; sets 2 and 3 set aside.
- The wireframes fixed the first layout only: the HTML mock-up of step 4 becomes the visual reference.

## 2. Technical choices (#3)

Chosen with the owner on 2026-10-27, in `docs/technical-choices.md`:

- Astro 7 in static output, on Node.js 24 LTS with npm: built-in redirects for the former URLs, validated content collections, WebP images, no JavaScript by default. Eleventy, Hugo, hand-written HTML and Laravel or Vue rejected.
- Native CSS with the design tokens as CSS custom properties, scoped component styles. The owner likes Tailwind CSS: it may come later, the tokens carry over to its `@theme`.
- Prettier, ESLint (Astro and accessibility rules), Stylelint and `astro check`; linkinator and a script for the former URLs, rather than lychee (a binary outside npm).
- Content in Markdown collections and interface texts in `src/i18n/fr.json`; no content management system, since only the owner and Claude Code edit the site.

## 1. Specifications (#2)

Settled with the owner on 2026-10-27, in `specs.md`:

- Audiences: schools, training organizations and companies; the wording speaks of « vos apprenants ».
- Promise: « Je prends vos apprenants par la main, jusqu'à la maîtrise. », signature « Une vie, mille leçons »; differentiators centered on pedagogy, not on field experience.
- Proofs: five current partners (AN 21 removed, IPI renamed IGENSIA Tech), more than 900 training hours per year; testimonials collected after the launch (step 12).
- Offers: one page per domain (seven domains), all former courses kept as modules, indicative durations marked adaptable, no rates.
- URLs: former paths kept, `/courses/<id>` and `/articles/<id>` redirected, `/creations`, `/register`, `/login` dropped.
- Services: Formspree (form), GoatCounter (audience); limits and accepted risks (GitHub Pages commercial use, no home address in the legal notice) in `docs/external-services.md`.
