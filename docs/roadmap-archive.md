# Roadmap archive

The detail of the steps of [roadmap.md](../roadmap.md) once their pull request is merged, newest first.

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
