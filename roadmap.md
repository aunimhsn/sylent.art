# Roadmap

Steps of the redesign described in [specs.md](specs.md), following the phases of [process.md](process.md). Each step is delivered in its own pull request, which checks its box.

## Reference

Read only by the steps that need them:

- [Technical choices](docs/technical-choices.md): the stack, the commands and the main designs, with their reasons.
- [External services](docs/external-services.md): limits and terms of GitHub Pages, Formspree and GoatCounter, and the risks accepted by the owner.
- [Roadmap archive](docs/roadmap-archive.md): the detail of the steps done, moved there once their pull request is merged.

## Steps

- [x] **0. Project setup** (#1): conventions, process, folders, Claude Code setup, first draft of `specs.md`.
- [x] **1. Specifications** (#2): audiences, value proposition, offers by domain, form, URLs, legal information; Formspree and GoatCounter chosen.
- [x] **2. Technical choices** (#3): Astro, native CSS with tokens, Prettier, ESLint, Stylelint, linkinator.
- [ ] **3. Wireframes**: one Excalidraw wireframe per page type (home, course list, course, article, about, contact), approved by the owner.
- [ ] **4. Mock-up**: 3 or 4 styles compared on the approved wireframes, then iterated until the owner approves one.
- [ ] **5. Design system**: tokens in `docs/design-system.md`, entry in `design-journal.md`.
- [ ] **6. Project and deployment**: project skeleton, checks, CI (`ci.yml`) and deployment to GitHub Pages (`deploy.yml`), `CNAME`.
- [ ] **7. Layout and home page**: shared layout (header, navigation, footer, calls to action) and home page.
- [ ] **8. Offers**: offer list and one page per domain, redirects of `/courses/<id>` generated from the offers' former ids. Refine the domains with the owner first.
- [ ] **9. Articles**: article list and the two former articles at readable URLs, redirects of `/articles/1` and `/articles/2`.
- [ ] **10. About and contact**: about page, contact form (Formspree), legal notice and privacy policy (`/policy`). Ask the owner for the phone number, the LinkedIn URL, the SIRET, the NDA and the photo. Decide with the owner whether the « Qui suis-je ? » block of the home page stays there or moves to the about page.
- [ ] **11. Launch**: 404 page, GoatCounter, sitemap, final checks on `github.io`, DNS records described for the owner.
- [ ] **12. Testimonials**: once the owner has collected at least three (LinkedIn recommendations, feedback from schools and learners, with consent to publish), add a testimonials section.

The steps may be split into sub-steps when a pull request grows too large.
