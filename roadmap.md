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
- [x] **10. Feedback on the preview** (#18–#28, #32, #34–#37, #40, #42, #43): the owner's remarks on the preview, the module texts reviewed one by one with the owner, the titles on one line at every width, checked by `npm run check`.
- [x] **11. French URLs in a tree** (#30): `/domaines/<domain>/modules/<module>/`, `/a-propos/`, `/confidentialite/`, `/mentions-legales/`, redirects from every former path.
- [x] **12. Domain pages** (#31): `/domaines/<domain>/` over the faded word « Domaine », reached from the domain cards (« Explorer le domaine »); `/domaines/` shows the domain cards; the former courses of the drafts lead to their domain page.
- [x] **13. Classification of the offers**: domains → formations → modules, addresses `/formations/<formation>/<module>/`; 13a specifications (#38), 13b wireframe and mock-up (#39), 13c build (#41).
- [ ] **14. Launch**, announced on LinkedIn, Instagram and the owner's Facebook page (asked on 2026-10-30): the supports are prepared before the switch, and published after it.
  - [x] 14a. Communication supports (#45): teaser and launch video, story and feed, the text of the post; kept by the owner out of the repository.
  - [x] 14b. Site ready to share (#46, #47): 404 page, French redirect pages, sitemap, `robots.txt`, GoatCounter on `sylent.art` only, Open Graph tags and preview card.
  - [ ] 14c. Switch. Before it, on the preview: paste `https://aunimhsn.github.io/sylent.art/` in the LinkedIn Post Inspector and the Facebook Sharing Debugger, with `?ref=linkedin` and `?ref=facebook`, and a former address (`/about/`): check that the card shows, that the link keeps its `?ref=` (otherwise decide with the owner: accept it, or remove `og:url` from the home page), and that a redirect page shows a card (otherwise give `3xx.astro` the tags, or exclude it in `specs.md`). Then: the DNS records described for the owner, their TTL lowered to 5 minutes a day or two before; once the DNS points to GitHub Pages, remove `SITE_URL` and `BASE_PATH` from `deploy.yml` and the `check:base` script, set the custom domain in the Pages settings and enforce HTTPS; check that `www.sylent.art`, the address shown on the preview card, redirects to `sylent.art` (see [Deployment](docs/technical-choices.md#deployment)); check the cards of the links with the LinkedIn Post Inspector and the Facebook Sharing Debugger; show the owner how to stop counting their own visits (`#toggle-goatcounter`, [External services](docs/external-services.md)).
  - [ ] 14d. Publication by the owner: the teaser before the switch, which it announces on 3 November 2026; the launch video and the post once `sylent.art` is online, the link `https://sylent.art/?ref=linkedin` on LinkedIn and `?ref=facebook` on Facebook, so that GoatCounter tells the networks apart. The owner's Google Business Profile (asked on 2026-10-30): before the switch, the address hidden (a service area instead, the home address is never shown), the description of the new positioning, the category (« Formateur »), the phone; after the switch only, the link to the site `https://sylent.art/?ref=google`.
- [ ] **15. Testimonials**: once the owner has collected at least three (LinkedIn recommendations, feedback from schools and learners, with consent to publish), add a testimonials section.
- [ ] **16. More modules** (after the launch): TypeScript, C, an advanced Python module (data classes, Pydantic), and the modules to come of the tree of step 13 (DOM, PDO, POO in JavaScript, data visualization, CSS split into Flexbox and Grid), from the course material of `sylent-courses`; update the offers of `specs.md` first. Publish « UX / UI » (a draft in « Conception logicielle » since 2026-10-30, its program from the owner's course « Maquetter une application », brought up to Excalidraw, HTML and Claude Code) when the owner decides: a scene of its own instead of `layout`, its place among the formations of the domain, and the summary of the domain widened to the interface (e.g. « Penser un logiciel avant de l’écrire : ses données, sa structure, son interface. »). A formation card lists four modules at most, then a row « Et 6 autres » in gray to the page of the formation, so that a large formation doesn't stretch its row of cards (asked by the owner on 2026-10-30; four at most at the launch).
- [ ] **17. Site in line with the course material**: the owner writes, in `sylent-courses`, the material of the 16 modules that have none yet, some of them from the owner's slides on Google Slides (HTML, CSS, PHP, Vue, Alpine, Laravel, Django, Cypress, Robomind, Machine learning, PostgreSQL, UML, Design patterns, CI/CD, Claude Code, Prompt engineering); then each module page is updated from its lessons and exercises, as in step 8b (chapter themes and exercise names only, the repository being private).

The steps may be split into sub-steps when a pull request grows too large.
