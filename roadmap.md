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
  Next, asked on 2026-10-29, in this order:
  - [x] The modules one by one with the owner: their texts as close as possible to what the owner will teach, and their layout (e.g. the title « Prompt engineering » of its module page breaks in the middle of « engineering »).
    - [x] The module titles are no longer hyphenated: « Prompt engineering » broke in the middle of « engineering ». (#20)
    - [x] Claude Code: the practice designs an application from scratch; on every module page, the public is shown one audience per line. (#21)
    - [x] « Méthode et IA » removed, too vague: the owner builds with AI rather than governs it, which the module Claude Code already covers. (#23)
    - [x] Module pages: no breadcrumb, the badge « Nouveau » at the very top, the domain as the large faded word behind the title. (#24)
    - [x] Algorithmique: approved by the owner as it is. (#24)
    - [x] RoboMind: its presentation in two paragraphs; the domain « Initiation à la prog. » takes a period, the mark of an abbreviation. (#25)
    - [x] HTML, CSS and JavaScript: a part on the developer console in their program; the practice of HTML is one's own portfolio, that of RoboMind handling the robot. (#25)
    - [x] Rename the module « Prog orientée objet » to « POO », which speaks more. (#25)
    - [x] CSS: a part on the CSS frameworks (Bootstrap and Tailwind, components or utilities); the practice keeps the centered square and styles one's own portfolio. (#25)
    - [x] PHP: the basics of the language only, its summary no longer promises a database (PDO and SQL in a later module of a PHP collection, step 13). (#25)
    - [x] Vue: Pinia and Firebase named (Firebase rather than Cloud Firestore, which speaks more). (#25)
    - [x] A module may be a draft (`draft: true`), kept out of the site until the owner publishes it; Vue is one for now. (#26)
    - [x] Alpine: approved by the owner as it is. (#26)
    - [x] Laravel: no tests and deployment; the program follows the router, the data, the controllers, then the views with Blade. (#26)
    - [x] Python: the basics of the language only, as it is; Django is a draft until the collections of modules (step 13); Machine learning stays, its course being ready. (#27)
    - [x] Merise: approved by the owner as it is. (#27)
    - [x] Machine learning: approved as it is. MySQL: the part on the structure is named « Altérer la structure », after ALTER. PostgreSQL is a draft for now. (#28)
    - [x] POO and UML: approved as they are, published at the launch. (#28)
    - [x] Principes SOLID: the practice is five refactorings that show what each principle brings, in any language. Design patterns: no language named either. (#28)
    - [x] Git / GitHub: Fork and Fourchette dropped from the tools. (#28)
    - [x] Cypress: no API testing (maybe later); continuous integration and deployment; the practice tests the Caesar cipher and a Lightbox component. (#28)
    - [x] « Intégration continue » and « Déploiement continu » merged into one module, « CI/CD » (`/courses/ci-cd/`; both pages were only on the preview); the scene of the deployment removed. (#28)
    - [x] Méthode agile: approved as it is. (#28)
    - [x] Prompt engineering: kept as it is for the launch, so that the AI offer shows; the owner reworks the AI courses for a didactic approach around Christmas 2026, then adjusts these offers to the demand. (#28)
    - [x] JavaScript: the practice keeps only the Caesar cipher; the DOM and fetch are left out until the owner's course covers them (a module « JavaScript et le DOM » to come, see the collections, step 13). (#25)
  - [ ] Polish: the last small remarks of the owner before the release.
    - [x] The faded word « Echanger » of the call to action ends its slide at the bottom of every page, whatever its length and the height of the screen. (#22)
    - [x] A black band on the right of the home page on the owner's Android phone: the faded words of the headings made the page wider than the screen (about 460 px for 393 on the home and about pages, up to 686 px on the module pages); the content now clips them, and `npm run check` loads every page in Chromium at phone width (Playwright). (#32)
    - [x] On a phone, every module, domain and section title holds on one line (« Prompt engineering », « DANS LE MEME DOMAINE »): its size follows the width of its heading, and `npm run check` fails on a title on two lines; the faded words may still run past the screen, and the owner's name may take two lines on the about page. (#34)
    - [x] The domain cards slide their content up and show their modules in its place instead of turning, which jerked under a fast pointer; every domain and module title holds on one line on a computer too (« Développement web » broke mid-word); no « DOMAINE » behind the domain titles; the first Python module named « Fondamentaux », the domain in the title of every module tab. (#36)
    - [x] The modules of a domain as tags at the bottom of its card (« #html #css »), the band « Voir les modules » instead of « Explorer le domaine ». (#37)
    - [ ] The large titles and faded words aligned on the left edge by the ink of their first letter, not its side bearing (optical alignment, see [Branding](docs/branding.md), Typography; asked on 2026-10-30).
    - [ ] Each module and domain title as large as the display size allows on one line, from its own width measured on Manrope 800, instead of `9.6cqi` for every title (« Laravel » 44 px instead of 34 px on a phone), and the faded word behind it at 60 % of the width (see [Branding](docs/branding.md), Typography; asked on 2026-10-30).
  - [x] A photo of the owner: large and faded behind the name (about page) and behind « Qui suis-je ? » (home page), and on the first face of the hero cube, in place of « 2021 »; « Connaitre » behind « Qui suis-je ? »; the captions of the key figures shortened to one line on a phone. (#35)
- [x] **11. French URLs in a tree** (#30): `/domaines/<domain>/modules/<module>/`, `/a-propos/`, `/confidentialite/`, `/mentions-legales/`, redirects from every former path.
- [x] **12. Domain pages** (#31): `/domaines/<domain>/` over the faded word « Domaine », reached from the domain cards (« Explorer le domaine »); `/domaines/` shows the domain cards; the former courses of the drafts lead to their domain page.
- [ ] **13. Classification of the offers** (before the launch): the groups mixed fields and a technology (« Python »). Agreed with the owner on 2026-10-30, on the tree `docs/wireframes/offer-classification.excalidraw`: domains (shelves) → formations (one subject each, the address) → modules; a module lives in one formation and is filed under one or more domains; addresses `/formations/<formation>/<module>/`; « IA générative » and « Programmation » replace « Développement IA » and « Initiation à la prog. », the domain « Python » is gone, the POO is a module of PHP and of Python; the word « domaine » stays (see `specs.md`, Training offers).
  - [x] **13a. Classification in `specs.md`** (#38).
  - [x] **13b. Wireframe and mock-up**: `docs/wireframes/formations.excalidraw`, then the mock-up (`domain-site.html`, `formation-site.html`, `module-site.html`), the reference: formation cards that list their modules, the formation page (domains above its name alone, « 3 modules », the modules along an orange rail over their cards), the module page under its formation (its name as the faded word, the mark « Framework » (an orange rule and the word) under the title, « Voir le programme » and « Voir la formation PHP » or « Revenir en arrière » after a page of the site, « Dans la même formation »), the framework mark across the top edge of a card, no duration anywhere; decisions in `specs.md` and `docs/branding.md`. After the launch: a dialog that lists the modules of a formation from its card.
  - [ ] **13c. Build**: the content (formation files, the domains of each module, the POO split into PHP and Python, the new module « Modules et packages » from the owner's slides of 2022 (text agreed on 2026-10-30) and the draft Tailwind, the module and domain renames), the pages `/formations/…` and `/domaines/<domain>/`, the redirects (`/courses/<id>/`, `/domaines/`, a formation of a single module), the domain card tags as formations, the layout of the mock-up of 13b (formation cards, formation page and its rail, module hero and neighbors, framework mark, no duration on the cards, the key facts nor the meta descriptions), the checks.
- [ ] **14. Launch**: 404 page, GoatCounter, sitemap, final checks on `github.io`, DNS records described for the owner; redirect pages in French (`experimental.redirectPage`, `src/pages/3xx.astro`, if still experimental decide with the owner), checked on the redirects of `/courses/<id>/` too, written by `src/pages/courses/[id].astro`; the sitemap without any redirect page (the former courses `/courses/<id>/`, `/courses/`, `/domaines/`, `/about/`, `/policy/`, the articles, a formation of a single module); once the DNS points to GitHub Pages, remove `SITE_URL` and `BASE_PATH` from `deploy.yml` and the `check:base` script, set the custom domain in the Pages settings and enforce HTTPS (see [Deployment](docs/technical-choices.md#deployment)). Check the phone number of GitHub in `src/content/legal.json` on GitHub's own pages.
- [ ] **15. Testimonials**: once the owner has collected at least three (LinkedIn recommendations, feedback from schools and learners, with consent to publish), add a testimonials section.
- [ ] **16. More modules** (after the launch): TypeScript, C, an advanced Python module (data classes, Pydantic), and the modules to come of the tree of step 13 (DOM, PDO, POO in JavaScript, data visualization, CSS split into Flexbox and Grid), from the course material of `sylent-courses`; update the offers of `specs.md` first.
- [ ] **17. Site in line with the course material**: the owner writes, in `sylent-courses`, the material of the 16 modules that have none yet, some of them from the owner's slides on Google Slides (HTML, CSS, PHP, Vue, Alpine, Laravel, Django, Cypress, Robomind, Machine learning, PostgreSQL, UML, Design patterns, CI/CD, Claude Code, Prompt engineering); then each module page is updated from its lessons and exercises, as in step 8b (chapter themes and exercise names only, the repository being private).

The steps may be split into sub-steps when a pull request grows too large.
