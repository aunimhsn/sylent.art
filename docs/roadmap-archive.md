# Roadmap archive

The detail of the steps of [roadmap.md](../roadmap.md) once their pull request is merged, newest first.

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
