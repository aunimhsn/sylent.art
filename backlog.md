# Backlog

What is noted and not being done: an evolving list, read when the next work is chosen (`process.md`, The backlog), not at every session. When the owner picks an item, it leaves this file and becomes a step of [roadmap.md](roadmap.md). Started on 2026-10-31 from the steps 15 to 17 of the roadmap and the ideas kept until then in Claude Code's memory.

## Polish

- **Texts not reviewed in detail**: written by Claude Code, not yet read closely by the owner: `src/content/modules/php/poo.md`, `src/content/modules/python/poo.md`, `src/content/modules/css/tailwind.md`, and the summaries of the formations in `src/content/collections/`. Noted on 2026-10-30.
- **The orange fluid of the grids**: its energy, which the owner loves, to tune by eye. Noted on 2026-10-28.
- **The Twitch link**: in the footer and the contact page, once the owner's streams start. Waits on: the first streams, around December 2026. Noted on 2026-10-27.
- **Comments and docs from the preview era**: `src/lib/url.ts`, `src/pages/robots.txt.ts`, `src/layouts/base-layout.astro` and `docs/external-services.md` still speak of the `github.io` preview as served; `docs/technical-choices.md` (Deployment) gives no complete recipe to rebuild a preview under a base (`astro build --outDir` outside the repository, linkinator with `--server-root`, `scripts/check-former-urls.mjs <folder> <base>`), and the base support is no longer checked: keep it with a check, or remove it (`href()`, `isPreview`). From the code review of PR #48. Noted on 2026-10-30.

## Edge cases

- **Touch screens with a mouse too** (`pointer: coarse` mixed with a fine pointer): check the flip of the domain cards and the magnetic buttons. Noted on 2026-10-28.

## Features

- **A « predict the output » game**: guess what a piece of code prints, as a playful page of the site. Noted on 2026-10-30.

## Large works

- **More modules** (after the launch): TypeScript, C, an advanced Python module (data classes, Pydantic), and the modules to come of the tree of step 13 (DOM, PDO, POO in JavaScript, data visualization, CSS split into Flexbox and Grid), from the course material of `sylent-courses`; update the offers of `specs.md` first. Publish « UX / UI » (a draft in « Conception logicielle » since 2026-10-30, its program from the owner's course « Maquetter une application », brought up to Excalidraw, HTML and Claude Code) when the owner decides: a scene of its own instead of `layout`, its place among the formations of the domain, and the summary of the domain widened to the interface (e.g. « Penser un logiciel avant de l’écrire : ses données, sa structure, son interface. »). A formation card lists four modules at most, then a row « Et 6 autres » in gray to the page of the formation, so that a large formation doesn't stretch its row of cards (asked by the owner on 2026-10-30; four at most at the launch). Noted on 2026-10-30.
- **Site in line with the course material**: the owner writes, in `sylent-courses`, the material of the 16 modules that have none yet, some of them from the owner's slides on Google Slides (HTML, CSS, PHP, Vue, Alpine, Laravel, Django, Cypress, Robomind, Machine learning, PostgreSQL, UML, Design patterns, CI/CD, Claude Code, Prompt engineering); then each module page is updated from its lessons and exercises, as in step 8b (chapter themes and exercise names only, the repository being private). Noted on 2026-10-30.

- **A course « Product engineering with Claude Code »**: the process of the templates (`process.md` and its diagram `docs/process.svg`: the toolbox, the backlog, the sizing of a change, urgent fixes and explorations), told from the making of this site, as course material in `sylent-courses` and maybe a module of the « Claude Code » formation on the site. Noted on 2026-10-31.

## Waiting on others

- **Testimonials**: once the owner has collected at least three (LinkedIn recommendations, feedback from schools and learners, with consent to publish), add a testimonials section. Waits on: the people who give a testimonial. Noted on 2026-10-29.

## Explorations kept

- **`docs/communication-kit`**: the temporary tool that made the launch videos (a Vite page, GSAP and Three.js scenes rendered frame by frame, `sound.js`, `render.mjs`), 15 commits, not merged and not reviewed. Kept until it moves to a repository of its own for content creation (the owner's idea of a « Content Maker », 2026-10-30), then deleted. Noted on 2026-10-30.
