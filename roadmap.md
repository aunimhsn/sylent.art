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
- [x] **8. Offers**: 8a offer pages (#10), 8b module content (this pull request).
- [ ] **9. Articles** (after the launch): article list and the two former articles at readable URLs, redirects of `/articles/1` and `/articles/2` to them. Until then, the first release redirects `/articles`, `/articles/1` and `/articles/2` to the home page and has no « Articles » link.
- [ ] **10. About and contact**: about page, contact form (Formspree), legal notice (`/legal`) and privacy policy (`/policy`); their former URLs removed from the `pending` list of `scripts/check-former-urls.mjs`, and their pages from the skipped links of `linkinator.config.json`. Decide with the owner how the links in running text stand out (underline or 3:1 contrast, WCAG 1.4.1), since the mock-up doesn't underline them, and record it in `docs/branding.md`. SIRET and NDA in `specs.md`. Decide with the owner whether the « Qui suis-je ? » block of the home page stays there or moves to the about page. Reuse `partner-reel.astro`, `pedagogy-steps.astro` and `key-figures.astro` (the figures larger there, `--size-figure-large`).
- [ ] **11. Launch**: 404 page, GoatCounter, sitemap, final checks on `github.io` (the `pending` list of `scripts/check-former-urls.mjs` and the skipped internal links of `linkinator.config.json` empty), DNS records described for the owner; redirect pages in French (`experimental.redirectPage`, `src/pages/3xx.astro`, if still experimental decide with the owner), checked on the redirects of `/courses/<id>/` too, which are pages of the module route; the sitemap without those redirects (`filter: (page) => !/\/courses\/\d+\/$/.test(page)`); once the DNS points to GitHub Pages, remove `SITE_URL` and `BASE_PATH` from `deploy.yml` and the `check:base` script, set the custom domain in the Pages settings and enforce HTTPS (see [Deployment](docs/technical-choices.md#deployment)).
- [ ] **12. Testimonials**: once the owner has collected at least three (LinkedIn recommendations, feedback from schools and learners, with consent to publish), add a testimonials section.
- [ ] **13. More modules** (after the launch): TypeScript, C, and an advanced Python module (data classes, Pydantic), from the course material of `sylent-courses`; update the offers of `specs.md` first.

The steps may be split into sub-steps when a pull request grows too large.
