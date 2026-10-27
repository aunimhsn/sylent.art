# Roadmap

Steps of the redesign described in [specs.md](specs.md), following the phases of [process.md](process.md). Each step is delivered in its own pull request, which checks its box.

## Reference

Read only by the steps that need them:

- [Technical choices](docs/technical-choices.md): the stack, the commands and the main designs, with their reasons.
- [Roadmap archive](docs/roadmap-archive.md): the detail of the steps done, moved there once their pull request is merged.

## Steps

- [x] **0. Project setup**: conventions, process, folders, Claude Code setup, first draft of `specs.md`.
- [ ] **1. Specifications**: settle the open questions of `specs.md` (value proposition, audiences' needs, offer grouping, page contents, form fields, legal pages); choose the form service and record the limits of GitHub Pages and of the form service in `docs/`.
- [ ] **2. Technical choices**: choose the static site generator, the formatter, the linter and the link check; write them with their reasons and commands in `docs/technical-choices.md`.
- [ ] **3. Wireframes**: one Excalidraw wireframe per page type (home, course list, course, article, about, contact), approved by the owner.
- [ ] **4. Mock-up**: 3 or 4 styles compared on the approved wireframes, then iterated until the owner approves one.
- [ ] **5. Design system**: tokens in `docs/design-system.md`, entry in `design-journal.md`.
- [ ] **6. Project and deployment**: project skeleton, checks, CI (`ci.yml`) and deployment to GitHub Pages (`deploy.yml`), `CNAME`.
- [ ] **7. Layout and home page**: shared layout (header, navigation, footer, calls to action) and home page.
- [ ] **8. Offers**: offer list and offer pages, redirects of `/courses/<id>`.
- [ ] **9. Articles**: article list and the two former articles, at `/articles/<id>`.
- [ ] **10. About and contact**: about page, contact form with the chosen service, legal notice and privacy policy (`/policy`).
- [ ] **11. Launch**: redirects of the removed pages, sitemap, final checks on `github.io`, DNS records described for the owner.

The steps may be split into sub-steps when a pull request grows too large.
