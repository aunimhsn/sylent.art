# Roadmap archive

The detail of the steps of [roadmap.md](../roadmap.md) once their pull request is merged, newest first.

## 18b. The astro-static-website-template repository ([#1](https://github.com/aunimhsn/astro-static-website-template/pull/1))

Step 18, retrospective (2026-10-31): the public template [aunimhsn/astro-static-website-template](https://github.com/aunimhsn/astro-static-website-template), for static brand websites built with Astro and hosted on GitHub Pages, made from this project. The conventions (`CLAUDE.md`, with the rules added to the Rust template since and the owner's preferences), `process.md` with two new phases asked by the owner (9. Polish, optional; 10. Next cycle, fed by a « Later » list of `roadmap.md`), the skeletons of `specs.md`, `roadmap.md` and the notes of `docs/` (`docs/branding.md` starting with the brand assets to ask for), the `code-reviewer` subagent and the two skills updated with the lessons. The Astro skeleton: base layout with metadata, favicon and Open Graph, tokens, home page, legal notice, not-found and French redirect pages, sitemap and `robots.txt`; the former addresses in `src/data/urls.json`; the checks of the addresses and of the width of every page; `npm run brand:images` for the favicon and the preview card; CI, deployment (skipped on the template itself) and Dependabot. Left out: Formspree, GoatCounter, GSAP, Three.js and the font metrics. The repository has the single topic `template`, as `rust-cli-template`, which the Rust template was renamed to the same day.

## 18a. Lessons of the project (#52)

The retrospective of the project in `process.md` (content tree in Excalidraw before the wireframes, brand assets to ask for, scripts chosen after the mock-up, a scale of tokens from the start, the mock-up checked on the owner's phone, a mock-up server of its own port without cache, the width check from the skeleton, a launch checklist) and in its table of lessons; three lessons in `design-journal.md`; the `excalidraw-wireframes` and `html-mockups` skills copied into `.claude/skills/`, the owner's personal copy removed (one source of truth per project).

## 14b. Site ready to share (#46, #47)

Step 14, launch: what the site needs before its links are shared, in two pull requests.

- 14b-1 (#46): the not-found page; the redirect pages in French (`src/pages/3xx.astro`, Astro's experimental `redirectPage`); `sitemap.xml` and `robots.txt` without the redirect pages (`scripts/sitemap.mjs`); GoatCounter on `sylent.art` only, its script pinned with its hash; the phone number of GitHub checked (none on its own pages, the public one kept); the owner's Google Business Profile added to step 14d.
- 14b-2 (#47): the Open Graph tags on every page (title, description, URL, site name, locale) and one preview card of 1200 × 630 px, the SYLENT logo and « www.sylent.art » in Manrope, centered over the faded photo of the owner, settled with the owner on 2026-10-30 after two rounds of layouts (a frame of the cube of the launch video set aside), served in JPEG (see [Branding](branding.md#icons-and-images) and [Technical choices](technical-choices.md#astro)).

## 14a. Communication supports (#45)

Step 14, launch, announced on LinkedIn, Instagram and the owner's Facebook page (asked on 2026-10-30): the supports are prepared before the switch, and published after it. Made on 2026-10-30 and kept by the owner out of the repository: the teaser « L'impact » (« 3/11/26 », « nouveau site », « sylent.art », « bientôt ») and the launch video « Le cube » (« Disponible dès maintenant »), each as an Instagram story (1080 × 1920) and a feed video for LinkedIn and Facebook (1080 × 1350), with a synthesized sound; the text of the post, the same on both networks, with the link in the post itself. The temporary tool that made them (a Vite page, GSAP and Three.js videos, `sound.js`, `render.mjs`) stays on the branch `docs/communication-kit`, not merged and not reviewed: a repository dedicated to content creation may come later.

## 10. Feedback on the preview (#18–#28, #32, #34–#37, #40, #42, #43)

The owner reviewed the site online at `aunimhsn.github.io/sylent.art` on 2026-10-29 and 2026-10-30; each remark was fixed in a small pull request, the slugs (hence the URLs) kept:

- Renames (#18, #25, #36): domains and modules shortened so that they hold on one line (« Git / GitHub », « Méthode agile », « POO », « Fondamentaux »), « Initiation à la prog. » with the period of an abbreviation; step 13 later replaced some domains.
- The modules one by one with the owner (#20, #21, #23 to #28): their texts as close as possible to what the owner teaches; « Méthode et IA » removed; « CI/CD » merges continuous integration and deployment; a module may be a draft (`draft: true`, kept out of the site: Vue, Django, PostgreSQL); the others reworked or approved as they are, Prompt engineering kept for the launch until the owner reworks the AI courses.
- Module pages (#20, #21, #24): titles no longer hyphenated, one audience per line, no breadcrumb, the badge « Nouveau » at the very top, the domain as the faded word behind the title.
- Home page and layout (#19, #22, #35 to #37): domain cards that slide their content up and show their modules as tags, with the band « Voir les modules »; Roman numerals in Manrope; closer footer columns; the faded word « Echanger » ends its slide at the bottom of every page; the owner's photo behind the name, behind « Qui suis-je ? » and on the hero cube.
- Phone (#32, #34): the faded words no longer widen the page; every title holds on one line; `npm run check` loads every page in Chromium at phone width (Playwright) and fails on an overflow or a title on two lines.
- Titles (#42): each module and domain title as large as one line allows, from its own width measured on Manrope 800, and aligned on the ink of its first letter (see [Branding](branding.md), Typography).
- About page (#40): the role « Formateur depuis 2021 ».
- Formations (#43): the domains of a formation page as small cards beside its hero, the custom request as the eighth domain card, the framework mark on the formation cards, new summaries for « Gestion de projet » and « IA générative », the band « Un besoin sur mesure ? » under the formations of a domain page; the draft « UX / UI ».

## 13c. Build of the formations (#41)

Step 13, classification of the offers, before the launch: the groups mixed fields and a technology (« Python »). Agreed with the owner on 2026-10-30, on the tree `docs/wireframes/offer-classification.excalidraw`: domains (shelves) → formations (one subject each, the address) → modules; a module lives in one formation and is filed under one or more domains; addresses `/formations/<formation>/<module>/`; « IA générative » and « Programmation » replace « Développement IA » and « Initiation à la prog. », the domain « Python » is gone, the POO is a module of PHP and of Python; the word « domaine » stays (see `specs.md`, Training offers).

Built in 13c: the content (formation files, the domains of each module, the POO split into PHP and Python, the new module « Modules et packages » from the owner's slides of 2022 (text agreed on 2026-10-30) and the draft Tailwind, the module and domain renames), the pages `/formations/…` and `/domaines/<domain>/`, the redirects (`/courses/<id>/`, `/domaines/`, a formation of a single module), the domain card tags as formations, the layout of the mock-up of 13b (formation cards, formation page and its rail, module hero and neighbors, framework mark, no duration on the cards, the key facts nor the meta descriptions), the checks.

## 13b. Wireframe and mock-up of the formations (#39)

Agreed with the owner on 2026-10-30, on `docs/wireframes/formations.excalidraw`, then on the mock-up (`domain-site.html`, `formation-site.html`, `module-site.html`, `shared/formations.{js,css}`, `shared/paths.js`), the reference of step 13c:

- Formation cards that list their modules filed under the domain, « 3 modules » for the whole formation, the band « Voir la formation »; a formation of a single module keeps the module card, named after the formation.
- The formation page: its domains as chips above its name alone, « 3 modules », its summary; « Modules » over « PARCOURS », the modules along an orange rail over the right of their cards, beside « Organiser cette formation »; no rail on a phone.
- The module page under its formation: its name as the faded word (the one word of its first domain for a module alone), the mark « Framework » (an orange rule and the word) under the title, « Voir le programme » and « Voir la formation PHP », or « Revenir en arrière » after a page of the site; « Dans la même formation ».
- The framework mark on the cover of a card and across the top edge of a card of the path; no duration anywhere. Decisions in `specs.md` and `docs/branding.md`. After the launch: a dialog that lists the modules of a formation from its card.

## 13a. Classification of the offers in `specs.md` (#38)

Agreed with the owner on 2026-10-30, on the tree `docs/wireframes/offer-classification.excalidraw` (kept):

- Three levels: domains (shelves where a school looks for a speaker) → formations (one subject each, which gives the address) → modules (the unit a client books). A module lives in one formation and is filed under one or more domains; a domain shows only its own modules of a formation.
- Addresses `/formations/<formation>/<module>/`, independent of the domains, replacing `/domaines/<domain>/modules/<module>/` (only on the preview, no redirect); a formation of a single module is named after it and its address leads to the module.
- « IA générative » and « Programmation » replace « Développement IA » and « Initiation à la prog. »; the domain « Python » is gone; the POO is a module of PHP and of Python; a framework is a module of the formation of its language, marked as such.
- Sections Training offers, Domain pages, Formation pages and URLs and redirects of `specs.md` rewritten.

## 12. Domain pages (#31)

Asked by the owner on 2026-10-29, before the launch; the layout agreed on the wireframe `docs/wireframes/domain-page.excalidraw`, removed once the page was built (it stays in the history):

- One page per domain at `/domaines/<domain>/` (`src/pages/domaines/[domain]/index.astro`, `domainPath` in `src/lib/offers.ts`): the hero of the module page, now shared (`src/components/page-hero.astro`), over the faded word « Domaine », chosen by the owner; the cards of its published modules and of a custom request; « Autres domaines » over « Explorer », the cards of the other domains; the call to action « Un domaine qui vous intéresse ? ».
- `/domaines/` shows one card per domain, as the home page, instead of the former list of every module. The band of a domain card reads « Explorer le domaine » (asked by the owner) and leads to its page.
- `/domaines/<domain>/modules/` redirects to the domain page. The former courses of the drafts (Vue `/courses/9`, Django `/courses/12`) lead to the page of their domain.
- No link of its own from a module page to its domain page: the section « Dans le même domaine » is enough (decided by the owner).

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
