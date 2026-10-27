# CLAUDE.md

## Communication

- Always communicate with the user in French through the Claude Code harness (chat responses, explanations, questions).
- Address the user informally, with « tu » (tutoiement), never « vous », in every session.

## Project

- `sylent.art` is the website of Sylent (Aunim Hassan), a freelance trainer in software development. It replaces a former Laravel site with a static site hosted on GitHub Pages, at the custom domain `sylent.art`.
- The site is focused on training only: the training courses, the articles, the trusted partners (schools and training organizations such as EPSI, YNOV, IPI, CESI, OpenClassrooms), an about page and a way to get in touch.
- Out of scope: the former "Créations" section (photography and artwork), user accounts (sign-up, login) and any back-end or back-office. Everything must work without a server.
- Keep the URLs of the former site (`/courses/<id>`, `/articles/<id>`, `/about`, `/contact`, `/policy`), or provide a redirect for each one, so the existing links and search ranking are not lost.
- The `CNAME` file at the root of the published site contains `sylent.art`. Never remove it.
- The repository is public: never commit secrets, personal data other than the public contact details, or private files.

## Naming conventions

- Files and directories use kebab-case (e.g. `docs/getting-started.md`, `src/pages/about.astro`), unless the chosen framework imposes another convention for a kind of file (e.g. a component file name): then follow the framework, and write the exception in `docs/technical-choices.md`.
- Standard names keep their conventional form (e.g. `README.md`, `CLAUDE.md`, `CNAME`, `package.json`).
- The repository itself is named after the domain, `sylent.art`: it is the only exception to kebab-case.
- File and directory names must be in English.

## Language

- Everything in the project (code, identifiers, comments, documentation, commit messages) must be written in English.
- Exception: the content of the site (pages, training courses, articles, metadata shown to visitors) is written in French. It lives in content or translation files, never hard-coded in the layout or components, so that a translation can be added later.
- Exception: the code review notes in `outputs/` are written in French.
- French content follows French typography: a non-breaking space before `?`, `!`, `:`, `;` and inside « », and correct accents and capitals (e.g. « À propos »).

## Specifications and roadmap

- Before writing code, describe the expected behavior of the site in `specs.md`, then split the work into steps in `roadmap.md`, and write the technical choices and their reasons in `docs/technical-choices.md`.
- At the start of each session, read `roadmap.md` to know the progress; when asked to continue, resume at the first unchecked step.
- Each step is delivered in its own pull request, which checks the step's box in `roadmap.md`.
- Keep `roadmap.md` consistent with `specs.md` when the specifications change.
- Keep `roadmap.md` short, since it is read at every session: the steps to come in detail, one line per step done with its pull requests. When the pull request of a step (or of a sub-step) is merged, move the detail of the step to `docs/roadmap-archive.md`. Reference notes (technical choices, rules of the external services) live in `docs/`, linked from `roadmap.md`, and are read only by the steps that need them.
- Read `specs.md` by section: list its headings first (`grep -n '^#' specs.md`), then read only the sections the step needs.
- When the pull request of a step (or of a sub-step) is merged, tell the owner that the step is done and remind them to start a new session for the next step by typing `/clear` (give them the command): a fresh session costs far fewer tokens, and `roadmap.md` and the memory hold what is needed to resume.

## Connectors

- The claude.ai connectors (Claude Docs and the others) are turned off for the project in `.claude/settings.json` (`disableClaudeAiConnectors`): their instructions and tools would be sent with every message. Remove the setting only if the project needs one of them.
- The skills a project doesn't use (documents, slides, spreadsheets, browsers, charts, Claude API…) are hidden from the model in the same file (`skillOverrides`, `user-invocable-only`): their descriptions would be sent with every message. The owner can still run them with `/<name>`; to give one back to the model, remove its line or use `/skills`.

## Working folders

Two folders are the exchange area between the owner and Claude Code. They are ignored by Git, except their `.gitkeep`, and hold only temporary files.

- `inputs/`: what the owner gives for context: screenshots, examples, references, copied texts (e.g. the content of the former site). Read them when the owner points to them; never commit, move or delete them unless asked.
- `outputs/`: what Claude Code produces for the owner: reports, code review notes, previews, screenshots. Name them `<YYYY-MM-DD>-<subject>.<ext>` when they are meant to be kept for a while.
- Anything meant to last goes elsewhere and is committed: documentation in `docs/`, images used by the site in the assets folder chosen in `docs/technical-choices.md`, course and article content in its content folder.

## Process

- Follow the phases of `process.md`: specifications, wireframes, mock-up, design system, then the build, one pull request per step.
- For each page type (home, course list, course, article, about, contact), start with editable Excalidraw wireframes in `docs/wireframes/` (grayscale, one group per block; `excalidraw-wireframes` skill), and build the HTML mock-up only once the owner has approved the layout (`html-mockups` skill).
- During the specifications, check the documentation, limits and terms of use of every external service (GitHub Pages, a form service if any, analytics if any), and record its limits and the risks the owner accepts, with their date, in a note of `docs/` linked from `roadmap.md` (e.g. `docs/github-pages-usage.md`).
- For the mock-up, compare 3 or 4 styles that explore new directions for this site. The site must read as professional and trustworthy for schools and training organizations. `design-journal.md` records the past design experiences: use it as a source of ideas for one style at most, never as default rules. Give each open decision its own tab group on the mock-up page, and remove it once decided.

## Git workflow

- Never commit or push directly to `main`.
- For each task, create a dedicated branch from `main`, commit and push only on that branch.
- Every change must go through a pull request targeting `main`.
- Name branches `<type>/<short-description>` in kebab-case, using the commit types below (e.g. `feat/course-pages`, `fix/contact-link`).
- Never switch branches in the main project directory while the owner may be testing a branch there (for example with the local development server): it would change the site they see. Work on any other branch in a separate Git worktree outside the project (`git worktree add <directory> -b <branch> origin/main`), and remove it with `git worktree remove <directory>` once the work is pushed.

## Commit messages

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Pull request titles use the same format.

```
<type>(<optional scope>): <description>

<optional body: what and why>

<optional footer>
```

| Type | Use for |
|---|---|
| `feat` | A new page, section or feature for the visitor. |
| `fix` | A bug fix (broken link, layout issue, wrong content). |
| `docs` | Documentation only (`README.md`, `specs.md`, `roadmap.md`, `CLAUDE.md`). |
| `content` | Site content only: a training course, an article, a text change. |
| `style` | Formatting with no behavior change. |
| `refactor` | A change that neither fixes a bug nor adds a feature. |
| `perf` | A performance improvement (image weight, loading). |
| `test` | Adding or fixing tests or checks only. |
| `build` | Build system or dependencies (`package.json`, lock file, framework config). |
| `ci` | CI and deployment configuration (`.github/`). |
| `chore` | Other maintenance (tooling, `.gitignore`, Claude Code agents). |
| `revert` | Reverting a previous commit. |

- Scope: optional, the page or area concerned (e.g. `feat(courses): ...`, `content(articles): ...`).
- Description: imperative mood, lowercase, no final period, 72 characters max (e.g. `feat(courses): add the course list page`).
- Breaking change: add `!` after the type or scope (e.g. `feat(urls)!: ...`) and explain it in a `BREAKING CHANGE:` footer. Changing a public URL is a breaking change.

## Code review

- Before opening any pull request that changes code or its build (templates, components, styles, scripts, framework config, dependencies, `.github/workflows/`), run the `code-reviewer` subagent (`.claude/agents/code-reviewer.md`) on the branch. A pull request that only changes content doesn't need it.
- It writes its recommendations, in French, to `outputs/<YYYY-MM-DD>-<branch>-code-review.md`. These notes are ignored by Git.
- Summarize the recommendations to the user and apply only the ones they approve, then open the pull request.

## Development

- The commands to build, preview and check the site are listed in `docs/technical-choices.md` once the stack is chosen, and in the README.
- Before committing, make sure all of these pass:
  - the production build, without errors or warnings;
  - the formatter and linter chosen for the project;
  - a check that no internal link is broken and every former URL resolves (page or redirect).
- The same checks run in CI (`.github/workflows/ci.yml`) on every pull request.
- Every page has a title, a meta description, a language (`lang="fr"`) and is usable at phone width. Images have an `alt` text and are served in a light format (e.g. WebP) at the size they are shown.
- Accessibility: semantic HTML, sufficient contrast, every action reachable with the keyboard.

## Deployment

- The site is deployed to GitHub Pages by a GitHub Actions workflow (`.github/workflows/deploy.yml`) on every push to `main`, i.e. when a pull request is merged. Record the workflow in `docs/technical-choices.md`.
- The custom domain `sylent.art` is set in the repository's Pages settings and in the `CNAME` file; HTTPS is enforced.
- Before the DNS of `sylent.art` points to GitHub Pages, the owner checks the new site on its `github.io` address. Changing the DNS is the owner's decision: never do it, describe the records to set instead.