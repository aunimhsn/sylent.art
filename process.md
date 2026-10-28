# Process

How `sylent.art` goes from an idea to a site online, with Claude Code. It follows the process of [rust-project-template](https://github.com/aunimhsn/rust-project-template/blob/main/process.md), adapted to a static website: the release becomes the launch on GitHub Pages. Each phase ends with something to validate before the next one starts: changing a sentence in the specifications costs less than changing a wireframe, which costs less than changing code.

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
| [5. Design system](#5-design-system) | Design tokens | Colors, sizes and typography are written as tokens. |
| [6. Build](#6-build) | One pull request per roadmap step | Every box of `roadmap.md` is checked. |
| [7. Launch](#7-launch) | Site on `github.io`, then on `sylent.art` | The owner has checked the site and switched the DNS. |
| [8. Retrospective](#8-retrospective) | Changes to this file and to the template | The lessons are written down. |

## 1. Repository

1. Apply the pull request settings: squash merging only, branches deleted once merged.
2. Protect `main` with a ruleset. On a free GitHub account, rulesets only apply to **public** repositories (this one is public).
3. Setup pull request: `CLAUDE.md`, this file, `specs.md`, `roadmap.md`, `docs/`, the `inputs/` and `outputs/` folders, the `code-reviewer` subagent and `.claude/settings.json`.
4. Open Claude Code in the project folder. Its memory is stored per project: a new session doesn't remember a conversation held in another project. To carry context over, paste a summary of it.
5. Check the connectors: `.claude/settings.json` turns off the claude.ai connectors (`disableClaudeAiConnectors`), whose instructions and tools would be sent with every message. If the project needs one, remove the setting; `/mcp` lists the servers that are on, and `/context` what fills the context. In the same file, `skillOverrides` hides from the model the skills the project doesn't use (still available with `/<name>`): adjust the list, or use `/skills`.

## 2. Specifications

Goal: agree on **what** the site says and does before deciding **how**.

1. Describe the idea in a few sentences, then let Claude Code ask its questions, in batches of a few at a time. The usual ones for this site:
   - Who decides to hire the trainer, and what must they find before getting in touch?
   - What is the promise, what are the differentiators, what proves them?
   - Which offers, grouped how, with which details?
   - What is the main action of the visitor, and what happens after it?
2. **Check the external services early** (GitHub Pages, the form service, analytics if any): documentation, limits, terms of use, personal data, licenses of the images and fonts. Record the limits and every risk the owner accepts, with its date, in a note of `docs/` (e.g. `docs/github-pages-usage.md`) linked from `roadmap.md`.
3. Write `specs.md`: behavior and content only (what the visitor sees, what each action does, the URLs and redirects, edge cases).
4. Write the technical choices with their reasons (and the alternatives rejected) in `docs/technical-choices.md`, then the steps in `roadmap.md`, each small enough for one pull request. `roadmap.md` is read at every session: keep it short, with links to the notes of `docs/`.
5. Open the pull request; the owner reads the files on GitHub (**Files changed**) or in the worktree.

## 3. Wireframes

Goal: agree on the **layout** of each page type (home, course list, course, article, about, contact), without colors or code, in a format the owner can edit.

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
4. Use web fonts whose license allows self-hosting (e.g. SIL Open Font License). Preload the font files, so that the page, and its screenshots, only finish loading once the fonts are there.
5. Serve the repository root so that the page reaches the images of the repository, even in a sandboxed browser (Flatpak, Snap) that only receives the HTML file:

   ```sh
   python3 -m http.server 8765 --bind 127.0.0.1
   ```

   then open `http://127.0.0.1:8765/docs/mockups/<file>.html`, and reload after each change.
6. Claude Code checks its own changes with headless screenshots (`firefox --headless --screenshot`) before asking for a review, and exports one large PNG per style to `outputs/` to compare them at a glance.

## 5. Design system

Goal: write down the visual choices once, so that every page stays consistent.

Write them in `docs/design-system.md`, as named tokens:

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

## 7. Launch

1. The owner checks every page on the `github.io` address, at phone and desktop width, and sends a test message with the contact form.
2. Claude Code checks that every former URL resolves and describes the DNS records to set; the owner changes the DNS of `sylent.art` (never Claude Code).
3. Once the domain points to GitHub Pages, enforce HTTPS in the Pages settings and check the `CNAME` file.
4. Submit the sitemap to the search engines if the owner wants to.

## 8. Retrospective

After the launch, or after any phase that went badly:

1. What took longer than expected? What had to be redone?
2. Update this file, and the template (`CLAUDE.md`, `process.md`, `README.md`) when the lesson applies to every project.

## Lessons learned

The lessons of the previous projects, kept from the template:

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
