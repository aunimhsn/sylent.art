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
- [x] **5. Design system**: tokens in `docs/branding.md` (4 px spacing scale, one size per typographic role, four breakpoints), the mock-up rewritten to use only them, entry in `design-journal.md`.
- [ ] **6. Project and deployment**: project skeleton, checks, CI (`ci.yml`) and deployment to GitHub Pages (`deploy.yml`), `CNAME`.
- [ ] **7. Layout and home page**: shared layout (header, navigation, footer, calls to action) and home page.
- [ ] **8. Offers**: offer list and one page per module (`/courses/<module>`), redirects of `/courses/<id>` generated from the modules' former ids. Refine the domains and the modules with the owner first.
- [ ] **9. Articles** (after the launch): article list and the two former articles at readable URLs, redirects of `/articles/1` and `/articles/2` to them. Until then, the first release redirects `/articles`, `/articles/1` and `/articles/2` to the home page and has no « Articles » link.
- [ ] **10. About and contact**: about page, contact form (Formspree), legal notice (`/legal`) and privacy policy (`/policy`). SIRET and NDA in `specs.md`. Decide with the owner whether the « Qui suis-je ? » block of the home page stays there or moves to the about page.
- [ ] **11. Launch**: 404 page, GoatCounter, sitemap, final checks on `github.io`, DNS records described for the owner.
- [ ] **12. Testimonials**: once the owner has collected at least three (LinkedIn recommendations, feedback from schools and learners, with consent to publish), add a testimonials section.

The steps may be split into sub-steps when a pull request grows too large.
