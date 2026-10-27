# Specifications

Status: first draft (2026-10-27). The sections marked « To specify » are completed in step 1 of `roadmap.md`.

## Goal

`sylent.art` is the website of Sylent (Aunim Hassan), a freelance trainer in software development since late 2021. The redesign replaces the former Laravel site with a static site on GitHub Pages.

The former site is dated and unclear about its added value and its audience: its headline (« Apprenez de nouvelles choses ») and its copy address beginners who want to learn programming, while those who hire the trainer are schools, training organizations and companies. The new site must state who the offer is for and what it brings, and turn visits into contact requests.

Success: a visitor who decides on a training mission understands within a few seconds what Sylent teaches, for whom, in which formats, why to trust Sylent, and how to get in touch.

## Audiences

Primary audiences, those who sign or approve a mission:

1. **Schools and training organizations**: pedagogical managers and program coordinators (e.g. EPSI, YNOV, IPI, CESI, OpenClassrooms) looking for a speaker for a module, a class or a whole program.
2. **Companies**: technical managers or HR who want to train their development teams (in-company training).

Secondary audience: the learners (students, career changers) who read the articles or look up their trainer. The site doesn't sell to them directly.

To specify: what each audience needs to find before contacting (formats, levels, durations, references, rates or not, availability, administrative details such as a training organization number or the Qualiopi certification).

## Value proposition

To specify with the owner:

- the one-line promise shown in the home page headline;
- the 3 or 4 differentiators (e.g. field experience as a developer, hands-on teaching, exercises adapted to the level of the group, years of experience and number of schools);
- the proofs: partner logos, figures (years, hours taught, learners trained), testimonials of schools or learners if the owner can publish them.

## Conversion

- The main action, repeated on every page, is the **contact form**.
- The form asks for: name, e-mail, organization, type of organization (school or training organization, company, other), subject or training wanted, message. The fields are to be confirmed.
- The site has no server: the form goes through a third-party form service, chosen and documented in step 1 (limits, terms of use, personal data, spam protection).
- After sending, the visitor sees a confirmation and knows when to expect an answer.
- A plain e-mail link stays available as a fallback.

## Pages

| Page | Purpose |
|---|---|
| Home | State the promise, the audiences, the offers, the proofs (partners) and lead to the contact form. |
| Offer list | Present the training offers grouped by domain or path. |
| Offer page | Detail one offer: audience, prerequisites, objectives, program, duration, formats, related offers, call to action. |
| Article list | List the articles. |
| Article page | Show one article, with a call to action at the end. |
| About | Present the trainer: background, approach, references. |
| Contact | The contact form and the other ways to reach the trainer. |
| Legal notice and privacy policy | The legal information of a professional site and how the form data is handled. |

The former « Créations » section (photography, artwork), the user accounts and any back-office are out of scope.

## Training offers

The 12 former courses, organized by technology, are restructured into offers. To specify in step 1: the grouping (domain, path or level), the fields of each offer, and which former courses are merged, kept or dropped.

Former courses (duration announced on the former site):

| Id | Course | Category on the former site | Duration |
|---|---|---|---|
| 1 | HTML 5 | Fondamentaux | 1 day |
| 2 | CSS 3 | Fondamentaux | 2 days |
| 3 | JavaScript | Fondamentaux | 3 days |
| 4 | PHP | Fondamentaux | 3 days |
| 5 | MySQL | Découverte du modèle relationnel | 3 days |
| 6 | Python | Fondamentaux | 3 days |
| 7 | Robomind | Découverte de la programmation | 1 day |
| 8 | Cypress | Framework de tests JavaScript | 2 days |
| 9 | Vue JS | Framework frontend JavaScript | 4 days |
| 10 | Alpine JS | Librairie frontend JavaScript | 2 days |
| 11 | Laravel | Framework backend PHP | 4 days |
| 12 | Django | Framework backend Python | 3 days |

## URLs and redirects

The former URLs keep working, as a page or a redirect, so the existing links and the search ranking are not lost:

- `/courses/1` to `/courses/12`: the page of the offer that now contains the course;
- `/articles/1` and `/articles/2`: the same articles;
- `/about`, `/contact`, `/policy`: the matching pages;
- `/courses` and `/articles`: the lists;
- `/creations`, `/register`, `/login`: redirect to the home page.

GitHub Pages has no server-side redirects: a redirect is a static page with a canonical link and an immediate redirection. Changing a public URL is a breaking change.

## Content

- The site content is in French, with French typography, in content files: never hard-coded in the layout or the components, so that a translation can be added later.
- The content of the former site is the starting point; it is rewritten for the new audiences.
- The two former articles (« Découverte d'Alpine JS », « Découverte de Tailwind CSS ») are kept.
- The partners shown on the former site are kept: AN 21, EPSI, YNOV, IPI, CESI, OpenClassrooms.

## Constraints

- Static site on GitHub Pages, custom domain `sylent.art`, HTTPS enforced, `CNAME` file kept.
- Every page has a title, a meta description, `lang="fr"`, and is usable at phone width.
- Accessibility: semantic HTML, sufficient contrast, every action reachable with the keyboard.
- Images have an `alt` text and are served in a light format (e.g. WebP) at the size they are shown.
- No secret and no personal data other than the public contact details in the public repository.

## Open questions

- Value proposition, differentiators and proofs (see above).
- Grouping of the offers and fields of an offer page.
- Form service, and whether to add analytics (and which one, respecting privacy).
- Administrative details to show (company status, SIRET, training organization number, Qualiopi).
- Whether to show rates or a « sur devis » mention.
- Which public contact details and social links to keep (GitHub, YouTube, Twitch, Instagram, LinkedIn).
