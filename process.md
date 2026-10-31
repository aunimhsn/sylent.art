# Process

How `sylent.art` goes from an idea to a site online, with Claude Code. It follows the process of [rust-cli-template](https://github.com/aunimhsn/rust-cli-template/blob/main/process.md) (formerly `rust-project-template`), adapted to a static website: the release becomes the launch on GitHub Pages. Each phase ends with something to validate before the next one starts: changing a sentence in the specifications costs less than changing a wireframe, which costs less than changing code.

This file is a living document: update it with what worked and what didn't (see [Retrospective](#8-retrospective)), and bring back to the template the lessons that apply to every project.

```
1. Repository ─▶ 2. Specs ─▶ 3. Wireframes ─▶ 4. Mock-up ─▶ 5. Design system ─▶ 6. Build ─▶ 7. Launch ─▶ 8. Retrospective
   setup           specs.md     Excalidraw       HTML           tokens             one PR       github.io     process.md
                   roadmap.md                                                      per step     then DNS
```

| Phase | Output | Done when |
|---|---|---|
| [1. Repository](#1-repository) | Conventions, folders, Claude Code setup | `main` is protected and the setup pull request is merged. |
| [2. Specifications](#2-specifications) | `specs.md`, `roadmap.md`, notes of `docs/` | The owner has answered the open questions and merged them. |
| [3. Wireframes](#3-wireframes) | `docs/wireframes/*.excalidraw` | The owner has edited and approved the layout of every page type. |
| [4. Mock-up](#4-mock-up) | `docs/mockups/*.html` | Every page and state looks right at every width. |
| [5. Design system](#5-design-system) | Design tokens in `docs/branding.md` | Colors, sizes and typography are written as tokens. |
| [6. Build](#6-build) | One pull request per roadmap step | Every box of `roadmap.md` is checked. |
| [7. Launch](#7-launch) | Site on `github.io`, then on `sylent.art` | The owner has checked the site and switched the DNS. |
| [8. Retrospective](#8-retrospective) | Changes to this file and to the template | The lessons are written down. |

## 1. Repository

1. Apply the pull request settings: squash merging only, branches deleted once merged.
2. Protect `main` with a ruleset. On a free GitHub account, rulesets only apply to **public** repositories (this one is public).
3. Setup pull request: `CLAUDE.md`, this file, `specs.md`, `roadmap.md`, `docs/`, the `inputs/` and `outputs/` folders, the `code-reviewer` subagent, the skills in `.claude/skills/` (copied into every project, never shared from `~/.claude/skills`, so that each project has one source of truth) and `.claude/settings.json`.
4. Open Claude Code in the project folder. Its memory is stored per project: a new session doesn't remember a conversation held in another project. To carry context over, paste a summary of it.
5. Check the connectors: `.claude/settings.json` turns off the claude.ai connectors (`disableClaudeAiConnectors`), whose instructions and tools would be sent with every message. If the project needs one, remove the setting; `/mcp` lists the servers that are on, and `/context` what fills the context. In the same file, `skillOverrides` hides from the model the skills the project doesn't use (still available with `/<name>`): adjust the list, or use `/skills`.

## 2. Specifications

Goal: agree on **what** the site says and does before deciding **how**.

1. Describe the idea in a few sentences, then let Claude Code ask its questions, in batches of a few at a time. The usual ones for this site:
   - Who decides to hire the trainer, and what must they find before getting in touch?
   - What is the promise, what are the differentiators, what proves them?
   - Which offers, grouped how, with which details?
   - What is the main action of the visitor, and what happens after it?
2. **Draw the content tree in Excalidraw** before the wireframes: what the site offers, grouped how (here domains, formations and modules), with the current state and two leads side by side, one group per item so that the owner moves them by hand. The URLs follow from it: settle them in the same phase. On sylent.art, the classification came at step 13, after the build: the URLs changed twice (#30, #41) and the offer pages were rebuilt.
3. **Ask for the brand assets** the site needs, and record what is missing: the logo (symbol and wordmark) on a dark and on a light background, in SVG if possible; a square icon for the favicon; the colors and fonts of an existing charter, with the license of each font; the photos of the owner and their rights; the logos of the partners and the permission to show them. The favicon and the preview card of the links (1200 × 630) are made from them.
4. **Check the external services early** (GitHub Pages, the form service, analytics if any): documentation, limits, terms of use, personal data, licenses of the images and fonts. Record the limits and every risk the owner accepts, with its date, in a note of `docs/` (e.g. `docs/github-pages-usage.md`) linked from `roadmap.md`.
5. Write `specs.md`: behavior and content only (what the visitor sees, what each action does, the URLs and redirects, edge cases).
6. Write the technical choices with their reasons (and the alternatives rejected) in `docs/technical-choices.md`, then the steps in `roadmap.md`, each small enough for one pull request. `roadmap.md` is read at every session: keep it short, with links to the notes of `docs/`. Choose only what the specifications need (hosting, generator, checks): the JavaScript libraries and the weight of script a page may carry wait for the mock-up. On sylent.art, « no JavaScript but the form » was written at step 2 and replaced at step 7 by GSAP and Three.js, which the approved mock-up needed.
7. Open the pull request; the owner reads the files on GitHub (**Files changed**) or in the worktree.

## 3. Wireframes

Goal: agree on the **layout** of each page type (home, course list, course, about, contact), without colors or code, in a format the owner can edit.

The `excalidraw-wireframes` skill carries out this phase: its Python helpers write the file and preview it.

1. Claude Code generates an Excalidraw file in `docs/wireframes/`: grayscale, real content from the specifications, one frame per page and width, **one group per block** so that a block moves in one click (double-click a block to edit one of its elements, **Ctrl+Shift+G** to ungroup it).
2. It checks the result with an SVG preview before handing it over.
3. The owner edits it in VS Code with the **Excalidraw** extension (`pomdtr.excalidraw-editor`), or on excalidraw.com (**Open**, then **Save to…**).
4. Iterate: the owner draws their version, Claude Code rearranges it and fills the gaps, the owner draws the next version, and so on. Claude Code commits the owner's version before changing it, so that every iteration stays in the history.
5. Once the main frames are agreed, Claude Code draws the rest under them: other kinds of content, the contact form states (sent, error), the open navigation menu at phone width.
6. Claude Code writes the agreed layout in `specs.md`.

Start with the phone width (mobile first): it forces to choose the essential, and the wider layouts then only rearrange the same blocks.

Working with the file:

- The VS Code extension does **not** save by itself, unlike excalidraw.com: press **Ctrl+S** before asking Claude Code to read the file.
- The extension keeps the drawing in memory and doesn't reload the file when it changes on disk. Before Claude Code rewrites the file, save and close its tab; afterwards, reopen it, and never save the old tab over the new file.

## 4. Mock-up

Goal: choose the style with real content, every page and every state, before building the site.

The `html-mockups` skill carries out this phase, from a starting page with the style and decision tabs, and a headless screenshot script.

1. One self-contained HTML page in `docs/mockups/`, built from the approved wireframes: every frame becomes a page at its width, with the real content.
2. **Several styles on the same page, 3 or 4**, each with its own fonts, colors and density, switched with **tabs at the top of the page**. The address keeps the chosen style (e.g. `?theme=slate`) to share it. Each style only sets tokens (CSS variables); the components use them all, so that a style is cheap to add or tweak.
   - The styles explore **new directions** for this site: it must read as professional and trustworthy for schools, training organizations and companies. [design-journal.md](design-journal.md) records the past experiences: it may inspire one of the styles, never all of them, and nothing in it is a default.
3. The owner picks a style, or mixes two; iterate on it alone, one change at a time (e.g. the main color, then the logo, then the font).
   - **Each open decision gets its own group of tabs** on the page, so that the owner compares on screen; once decided, the tab is removed and the choice is kept.
   - **Pixel alignments are tuned by eye on the owner's real screen**, with a tab of offsets: the display scale differs from the headless screenshots, which only give the direction.
   - From then on, **the mock-up is the reference** of the interface; the wireframe only fixed the first layout, and is removed with the pull request of the mock-up (the Git history keeps it).
   - **Start from a scale of tokens** (spacing in steps of 4 px, one size per typographic role, a few breakpoints), even rough: raw values multiply during the iterations (fifteen font sizes and five breakpoints on sylent.art), and rounding them at the end shifts lines of text.
   - Once the site has several page types, **one page per page type, shown in a viewer** (phone and desktop frames side by side), scales better than one page with every screen.
   - **Check the mock-up on the owner's phone** before approving it, not only in headless screenshots and a desktop window: most of the feedback on the sylent.art preview (step 10, about seventeen pull requests) came from the phone (a page wider than the screen on Android, titles on two lines).
4. Use web fonts whose license allows self-hosting (e.g. SIL Open Font License). Preload the font files, so that the page, and its screenshots, only finish loading once the fonts are there.
5. Serve the repository root so that the page reaches the images of the repository, even in a sandboxed browser (Flatpak, Snap) that only receives the HTML file:

   ```sh
   python3 docs/mockups/serve.py 8781
   ```

   then open `http://127.0.0.1:8781/docs/mockups/<file>.html`, and reload after each change. Give each project its own port (8765 belonged to another project, whose server took it over), and serve without cache (`Cache-Control: no-store`): with the plain `http.server`, the browser mixed old shared files with new pages.
6. Claude Code checks its own changes with headless screenshots (`firefox --headless --screenshot`) before asking for a review, and exports one large PNG per style to `outputs/` to compare them at a glance.
   - A test that needs extra code (a delay, a simulated click) runs on a copy of the page, never on the file the owner has open.
   - A headless browser renders without the GPU: a color or WebGL bug the owner reports is checked with a small test page of variants, the owner naming the wrong ones.

## 5. Design system

Goal: write down the visual choices once, so that every page stays consistent.

Write them in `docs/branding.md`, as named tokens, next to the decisions they come from (every design decision settled with the owner goes there, in the same commit as the mock-up change, and the rejected options in its « Set aside » list):

- **Colors**: background, surfaces, borders, text, weak text, accent, link, focus, error, success; contrast checked against WCAG AA.
- **Sizes**: a spacing scale (e.g. 4, 8, 12, 16, 24 px), corner radius, content width, breakpoints.
- **Typography**: fonts, sizes per role (headline, title, body, caption), weights, line heights.
- **Images**: where they come from, their license, their format and sizes (WebP at the size shown).
- **Tone of the texts**: « vous » for the visitors, length, how the calls to action and the form errors are worded.

The mock-up is then updated to use exactly these tokens. At the end of the phase, add an entry to [design-journal.md](design-journal.md), here and in the template: the choices kept, the ones rejected, and why.

## 6. Build

For each step of `roadmap.md`, in order:

1. Branch `<type>/<short-description>` from `main`. If the owner isn't testing anything, work in the main folder so that they can follow the changes in VS Code; otherwise, in a Git worktree outside the project.
2. Code; then run the checks listed in `docs/technical-choices.md`: production build without errors or warnings, formatter, linter, broken links and former URLs.
3. Run the `code-reviewer` subagent: its notes, in French, go to `outputs/`. Claude Code summarizes them; the owner chooses which to apply.
4. Commit (Conventional Commits), push, open the pull request; it checks the step's box in `roadmap.md`.
5. The CI passes; the owner reviews and squash merges; `git pull` on `main`. The merge deploys the site to GitHub Pages.
6. When a step changes the behavior or the content plan, update `specs.md` and `roadmap.md` in the same pull request.

From the skeleton step on, the checks include the width of every page on a phone (`scripts/check-overflow.mjs`, in the Chromium of Playwright): only a browser that lays the page out sees a block that runs past the screen. The owner looks at the preview on their phone after each page step, rather than all the pages at the end.

## 7. Launch

1. The owner checks every page on the `github.io` address, at phone and desktop width, and sends a test message with the contact form.
2. Before the switch, the site is ready to share: not-found page, redirect pages, sitemap, `robots.txt`, favicon, Open Graph tags and a preview card (1200 × 630, JPEG), checked with the LinkedIn Post Inspector and the Facebook Sharing Debugger.
3. Claude Code checks that every former URL resolves and describes the DNS records to set; the owner lowers their TTL a day before, then changes the DNS of `sylent.art` (never Claude Code). The domain is verified in the GitHub account first, and the custom domain field of the repository stays empty until the switch: filled earlier, it redirects the `github.io` preview to the old site.
4. Once the domain points to GitHub Pages, set the custom domain in the Pages settings, enforce HTTPS, remove the base path of the preview, and check that `www` and `github.io` redirect to the domain.
5. Submit the sitemap to the search engines if the owner wants to.

## 8. Retrospective

After the launch, or after any phase that went badly:

1. What took longer than expected? What had to be redone?
2. Update this file, and the template (`CLAUDE.md`, `process.md`, `README.md`) when the lesson applies to every project.

The retrospective of sylent.art (2026-10-31) is written in the phases above and in the table below. Its lessons that apply to every static website feed [astro-static-website-template](https://github.com/aunimhsn/astro-static-website-template), and those that apply to every project [rust-cli-template](https://github.com/aunimhsn/rust-cli-template) too.

## Lessons learned

The lessons of the previous projects, kept from the template, then those of this one:

| Project | Lesson |
|---|---|
| rust-exile-market | Coded mock-ups were never exactly what the owner wanted: start with editable wireframes. |
| rust-exile-market | Read the terms of use of every data source during the specifications: a forbidden API changes the scope of version 1. |
| rust-exile-market | A Flatpak browser only receives the opened file: serve the repository with `python3 -m http.server`. |
| rust-exile-market | On a free GitHub account, rulesets only protect public repositories. |
| rust-exile-market | The owner draws, Claude Code rearranges and completes: the wireframe iterations made the interface personal. |
| rust-exile-market | The VS Code Excalidraw extension neither autosaves nor reloads a file changed on disk: save, close, reopen. |
| rust-exile-market | Mock-ups got much better once the layout was settled: one question per phase (layout, then style). |
| rust-exile-market | Three styles on one page with tabs made the choice easy. |
| rust-exile-market | One tab group per open decision, removed once decided, turned about a hundred small decisions into quick on-screen comparisons. |
| rust-exile-market | Pixel offsets measured on headless screenshots were wrong on the owner's scaled screen: tune them by eye with a tab of values. |
| sylent.art | Mock-up as the reference: the build of a page mostly copied it, and the tokens of the mock-up became `tokens.css` as is. |
| sylent.art | The content tree came after the build: the URLs changed twice and the offer pages were rebuilt. Draw it in Excalidraw during the specifications. |
| sylent.art | Excalidraw also serves to sort content (a tree of offers, cards moved by hand), not only to lay out pages. |
| sylent.art | Bold variants (Three.js line-art scenes) showed the owner what they wanted: they couldn't have said « sober or spectacular » before seeing them. |
| sylent.art | Most feedback on the preview came from the phone: check the mock-up on a real phone, and the width of every page in CI from the first step. |
| sylent.art | A choice written before the mock-up (« no JavaScript ») was replaced once the mock-up was approved: choose the scripts after it. |
| sylent.art | The checks born from a bug (former URLs, page wider than the phone, title on two lines) kept it from coming back. |
| sylent.art | A worktree outside the folder open in VS Code is invisible to the owner: work on the branch in the main folder while they test nothing there. |
| sylent.art | Open a pull request only once the owner has seen the result (the review applied, the schema looked at). |
