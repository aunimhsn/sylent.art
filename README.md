# sylent.art

Website of Sylent (Aunim Hassan), freelance trainer in software development: the training offers, the articles, the trusted partners, an about page and a contact form. A static site deployed to GitHub Pages at [sylent.art](https://sylent.art).

## Documentation

- [specs.md](specs.md): what the site says and does.
- [roadmap.md](roadmap.md): the steps of the redesign and their progress.
- [process.md](process.md): the phases, from the specifications to the launch.
- [docs/technical-choices.md](docs/technical-choices.md): the stack and the commands to build, preview and check the site.
- [CLAUDE.md](CLAUDE.md): the project conventions, for Claude Code and for humans.

## Development

Astro static site, Node.js 24 LTS and npm (available from step 6 of the roadmap):

```sh
npm ci              # install the dependencies
npm run dev         # local server at http://localhost:4321
npm run check       # format check, lint, build and link check, before every commit
```

The other commands and the reasons of each choice are in [docs/technical-choices.md](docs/technical-choices.md).

## Working folders

`inputs/` (what the owner gives for context) and `outputs/` (what Claude Code produces: reports, code review notes, previews) hold temporary files and are ignored by Git.

## License

[MIT](LICENSE) for the code. The content of the site (texts, images, logos) is not covered by this license.
