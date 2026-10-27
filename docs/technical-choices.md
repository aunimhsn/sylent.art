# Technical choices

The technical choices of the [roadmap](../roadmap.md), with their reasons and the alternatives rejected. The stack is chosen in step 2.

| Topic | Choice | Reason |
|---|---|---|
| Hosting | GitHub Pages, custom domain `sylent.art` | Free for a public repository, no server to maintain, HTTPS included. The site must work without a server. |
| Deployment | GitHub Actions workflow (`.github/workflows/deploy.yml`) on every push to `main` | A merged pull request is deployed without a manual step. |
| Contact form | Formspree, free plan | No server needed, 50 submissions a month (far above the expected volume), spam filter. Web3Forms rejected: its documentation contradicts itself on storage. See [external-services.md](external-services.md). |
| Audience measurement | GoatCounter | No cookie, so no consent banner; data hosted in the European Union; free for a small business. Google Analytics rejected: consent banner required. See [external-services.md](external-services.md). |

## Commands

To be written once the stack is chosen: build, local preview, formatter, linter, link check.

## Exceptions to the naming conventions

None yet. A file name imposed by the framework (e.g. a component name) is listed here.
