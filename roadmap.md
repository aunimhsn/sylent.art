# Roadmap

The steps chosen for the site described in [specs.md](specs.md), following [process.md](process.md). Each step is delivered in its own pull request, which checks its box. What is noted and not chosen yet lives in [backlog.md](backlog.md).

## Size of the project

A brand site of a few page types: every tool, in order, for the first cycle (steps 0 to 14); since the launch, each change runs only the tools it needs (`process.md`, Size a change).

## Reference

Read only by the steps that need them:

- [Technical choices](docs/technical-choices.md): the stack, the commands and the main designs, with their reasons.
- [Branding](docs/branding.md): the visual identity and every design decision of the mock-up (colors, fonts, components, motion, the orange).
- [External services](docs/external-services.md): limits and terms of GitHub Pages, Formspree and GoatCounter, and the risks accepted by the owner.
- [Roadmap archive](docs/roadmap-archive.md): the detail of the steps done, moved there once their pull request is merged.
- [Backlog](backlog.md): what is noted and not chosen yet (testimonials, more modules, the polish…), read when the next work is chosen.

## Steps

### Cycle 1: the site online

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
  - [ ] 14c. Switch, on 2026-10-30 evening, as soon as possible as the owner asked (TTL left at 4 hours). Done: on the preview, the LinkedIn Post Inspector keeps `?ref=linkedin` in the link and shows a card for `/about/` (it follows the redirect page); its card of the home page is a blurry 160 px thumbnail, to check in a draft post after the switch. The DNS records given to the owner (GitHub Pages `A` and `AAAA` on the apex, `www` CNAME `aunimhsn.github.io.`); `SITE_URL`, `BASE_PATH` and `check:base` removed. To do: set the custom domain in the Pages settings and enforce HTTPS; check that `www.sylent.art`, the address shown on the preview card, redirects to `sylent.art` (see [Deployment](docs/technical-choices.md#deployment)); check the cards of the links with the LinkedIn Post Inspector and the Facebook Sharing Debugger; show the owner how to stop counting their own visits (`#toggle-goatcounter`, [External services](docs/external-services.md)).
  - [ ] 14d. Publication by the owner: the teaser before the switch, which it announces on 3 November 2026; the launch video and the post once `sylent.art` is online, the link `https://sylent.art/?ref=linkedin` on LinkedIn and `?ref=facebook` on Facebook, so that GoatCounter tells the networks apart. The owner's Google Business Profile (asked on 2026-10-30): before the switch, the address hidden (a service area instead, the home address is never shown), the description of the new positioning, the category (« Formateur »), the phone; after the switch only, the link to the site `https://sylent.art/?ref=google`.
- [x] **18. Retrospective** (#52, #53, #54): lessons in `process.md` and `design-journal.md`; [astro-static-website-template](https://github.com/aunimhsn/astro-static-website-template) ([#1](https://github.com/aunimhsn/astro-static-website-template/pull/1), [#4](https://github.com/aunimhsn/astro-static-website-template/pull/4)); [rust-cli-template](https://github.com/aunimhsn/rust-cli-template) ([#17](https://github.com/aunimhsn/rust-cli-template/pull/17), [#18](https://github.com/aunimhsn/rust-cli-template/pull/18)); the process as a toolbox around a backlog, with its diagram.

The steps may be split into sub-steps when a pull request grows too large. When no step is left, Claude Code proposes the next items of the backlog to the owner.
