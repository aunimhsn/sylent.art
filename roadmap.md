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
- [x] **7. Layout and home page**: 7a shared layout (#8), 7b home page (#9).
- [x] **8. Offers**: 8a offer pages (#10), 8b module content (#11).
- [x] **9. About and contact**: 9a about and legal pages (#13), 9b contact page (#14).
- [ ] **10. Feedback on the preview**: the owner reviews the site online at `aunimhsn.github.io/sylent.art` and gives a series of small remarks; each one is written below, then fixed in a small pull request (several close ones may share one), checked here with its number. The remarks that would delay the launch past its deadline (between 5 and 19 November 2026) wait until after it.
  Remarks of 2026-10-29 (the slugs, hence the URLs, stay as they are):
  - [x] Rename the domain « IA pour le développement » to « Développement IA ». (#18)
  - [x] Rename the domain « Initiation à la programmation » to « Initiation à la prog ». (#18)
  - [x] Rename the domain « Python et données » to « Python ». (#18)
  - [x] Rename the module « Intégrer l’IA avec méthode » to « Méthode et IA ». (#18)
  - [x] Rename the module « Programmation orientée objet » to « Prog orientée objet », so that it holds on one line. (#18)
  - [x] Rename the module « Git et GitHub » to « Git / GitHub ». (#18)
  - [x] Rename the module « Initiation à l’agilité avec Scrum » to « Méthode agile ». (#18)
  - [x] The back of a domain card shows only the names of its modules, without their line of program. (#19)
  - [x] The Roman numerals of the pedagogy section in Manrope. (#19)
  - [x] The columns Navigation, Contact and Informations of the footer a little closer, so that « Cet enregistrement ne vaut pas agrément de l’État » holds on one line. (#19)
- [ ] **11. Launch**: 404 page, GoatCounter, sitemap, final checks on `github.io`, DNS records described for the owner; redirect pages in French (`experimental.redirectPage`, `src/pages/3xx.astro`, if still experimental decide with the owner), checked on the redirects of `/courses/<id>/` too, which are pages of the module route; the sitemap without those redirects (`filter: (page) => !/\/courses\/\d+\/$/.test(page)`); once the DNS points to GitHub Pages, remove `SITE_URL` and `BASE_PATH` from `deploy.yml` and the `check:base` script, set the custom domain in the Pages settings and enforce HTTPS (see [Deployment](docs/technical-choices.md#deployment)). Check the phone number of GitHub in `src/content/legal.json` on GitHub's own pages.
- [ ] **12. Testimonials**: once the owner has collected at least three (LinkedIn recommendations, feedback from schools and learners, with consent to publish), add a testimonials section.
- [ ] **13. More modules** (after the launch): TypeScript, C, and an advanced Python module (data classes, Pydantic), from the course material of `sylent-courses`; update the offers of `specs.md` first.
- [ ] **14. Site in line with the course material**: the owner writes, in `sylent-courses`, the material of the 18 modules that have none yet, some of them from the owner's slides on Google Slides (HTML, CSS, PHP, Vue, Alpine, Laravel, Django, Cypress, Robomind, Machine learning, PostgreSQL, UML, Design patterns, Intégration continue, Déploiement continu, Claude Code, Prompt engineering, Intégrer l’IA avec méthode); then each module page is updated from its lessons and exercises, as in step 8b (chapter themes and exercise names only, the repository being private).

The steps may be split into sub-steps when a pull request grows too large.
