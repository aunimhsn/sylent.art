# Specifications

Status: settled with the owner on 2026-10-27 (step 1 of `roadmap.md`). The French texts quoted here are drafts of the content: they are polished when the content is written, without changing their meaning.

## Goal

`sylent.art` is the website of Sylent (Aunim Hassan), a freelance trainer in computing since late 2021. The redesign replaces the former Laravel site with a static site on GitHub Pages.

The former site is dated and unclear about its added value and its audience: its headline (« Apprenez de nouvelles choses ») and its copy address beginners who want to learn programming, while those who hire the trainer are schools, training organizations and, through them, companies. The new site must state who the offer is for and what it brings, and turn visits into contact requests.

Success: a visitor who decides on a training mission understands within a few seconds what Sylent teaches, for whom, in which formats, why to trust Sylent, and how to get in touch.

## Audiences

Primary audiences, those who sign or approve a mission:

1. **Schools**: pedagogical managers and program coordinators looking for a speaker for a module, a class or a whole program.
2. **Training organizations**: they sell training to companies and look for a trainer on a domain.
3. **Companies**: technical managers or HR who want to train their teams, directly or through a training organization.

The wording of the site never addresses schools only: it speaks of « vos apprenants », which fits the three audiences.

Secondary audience: the learners (students, career changers, employees) who read the articles or look up their trainer. The site doesn't sell to them directly.

What the primary audiences must find before getting in touch:

- **The domains** taught, with indicative durations per module, always marked as adaptable. Pedagogical teams look for a speaker on a domain more than on a technology.
- **The levels and the prerequisites** of each domain.
- **The formats**: on-site or remote. The site doesn't detail the geographic zone (on-site around Toulouse and in Occitanie, remote across France for short modules): it is discussed at the first contact.
- **The references**: the current partners and the volume of teaching.
- **The administrative details**: the status (micro-entreprise), the SIRET and the training organization activity declaration number (NDA), so that a training organization can contract.
- **No rates**: they depend on the request, the level of the learners and the location. The site shows no price and no « sur devis » mention; the call to action is enough.

## Value proposition

- **Headline** of the home page: « Je prends vos apprenants par la main, jusqu'à la maîtrise. » It reassures (step by step guidance) and shows ambition (mastery).
- **Subtitle**: the trainer's name and the audiences, « Aunim Hassan, formateur en informatique depuis 2021, pour les écoles, les organismes de formation et les entreprises. » A person is hired, not a catalog: the domains are left to the offers just below, and stay in the meta description.
- **Signature**: « Une vie, mille leçons », the motto of the former site: one doesn't stop learning and being curious as an adult. It appears on the home page or in the footer, and on the about page.

Differentiators, centered on pedagogy and the human side (the trainer is not presented as a « field developer »):

1. **Defining a why** (« Définir un pourquoi »): starting from the meaning: why learn this notion, why this module, why with this trainer.
2. **Patience and kindness** (« Avec patience et bienveillance »): step by step, with analogies and metaphors that make complex concepts clear, from a point A to a point B, « en toute sérénité ».
3. **Learning to learn**: a self-taught profile in computing, who passes on curiosity and the method to keep learning.
4. **Experience**: teaching since 2021, more than 900 training hours per year since 2023, with five schools and training organizations.

Rejected as slogans, because they are expected of any trainer: « savoir-faire et savoir-être », « il n'y a pas de questions bêtes ».

Proofs:

- **Partners** (current clients only, named without their city): YNOV, IGENSIA Tech (formerly IPI), EPSI, CESI, OpenClassrooms (mentoring). AN 21, shown on the former site, is removed.
- **Figure**: « plus de 900 heures de formation par an depuis 2023 », from the yearly bilan pédagogique et financier.
- **Testimonials**: none at launch. The owner collects them after the launch (LinkedIn recommendations, feedback from schools and learners, with their consent to publish); a testimonials section is added once there are at least three.
- No invented proof or figure.

## Conversion

- The main action, repeated on every page, is the **contact form**.
- Fields, all required: name, e-mail, organization, type of organization (école, organisme de formation, entreprise, autre), training wanted (the list of domains, plus « autre »), message.
- The form is sent through **Formspree** (see [docs/external-services.md](docs/external-services.md)). Spam is filtered by Formspree and by a hidden honeypot field; no reCAPTCHA, which would add Google cookies.
- After sending, the visitor stays on the page and sees a confirmation: « Merci, je vous réponds sous 48 h ouvrées. »
- If the sending fails, the visitor sees an error message with the e-mail address, and the text typed is kept.
- The form works with the keyboard, each field has a label, and the errors are announced next to the field concerned.
- A plain e-mail link stays available as a fallback.

## Pages

| Page | URL | Purpose |
|---|---|---|
| Home | `/` | State the promise, the audiences, the domains, the differentiators, the proofs (partners, figure) and lead to the contact form. |
| Offer list | `/courses` | Present the domains, each with a short summary and its modules. |
| Offer page | `/courses/<domain>` | Detail one domain (see [Training offers](#training-offers)). |
| Article list | `/articles` | List the articles, newest first. |
| Article page | `/articles/<slug>` | Show one article, with a call to action at the end. |
| About | `/about` | Present the trainer: photo, background, approach, references, NDA. |
| Contact | `/contact` | The contact form and the other ways to reach the trainer. |
| Legal notice and privacy policy | `/policy` | The legal information and how the form and audience data are handled. |
| Not found | `404.html` | A page « Page introuvable » with links to the home page and the offers. |

Every page has a header with the navigation (Formations, Articles, À propos, Contact) and a visible « Me contacter » call to action, and a footer with the contact details, the legal page and the signature.

The former « Créations » section (photography, artwork), the user accounts and any back-office are out of scope.

## Training offers

One page per **domain**. Pedagogical teams look for a speaker on a domain, and the technology matters less and less. The domains below are a first grouping, refined with the owner when the content is written.

| Domain | Slug | Modules | Former courses |
|---|---|---|---|
| Initiation à la programmation | `initiation-a-la-programmation` | Algorithmique, Robomind | 7 |
| Développement web | `developpement-web` | HTML, CSS, JavaScript, PHP, Vue, Alpine, Laravel | 1, 2, 3, 4, 9, 10, 11 |
| Python et données | `python-et-donnees` | Python, Django, initiation au machine learning | 6, 12 |
| Conception et bases de données | `conception-et-bases-de-donnees` | Merise, UML, MySQL, PostgreSQL | 5 |
| Méthodologie et tests | `methodologie-et-tests` | Git et GitHub, Cypress, intégration continue (GitHub Actions), déploiement continu (Vercel, Render) | 8 |
| IA pour le développement | `ia-pour-le-developpement` | Claude Code, prompt engineering, intégrer l'IA avec méthode et rigueur | — |
| Gestion de projet | `gestion-de-projet` | Initiation à l'agilité avec Scrum | — |

All the former courses are kept, as modules of their domain.

Each offer page shows:

- the title and a summary of the domain;
- the audience and the level (e.g. « Étudiants, développeurs, chefs de projet technique »);
- the prerequisites;
- the objectives;
- the modules, each with an indicative duration (« 2 jours, adaptable ») and a summary of its program. The modules are independent: a client takes one or several, in any order, so the site never presents them as a sequence to follow (« Voir les modules », not « Voir le programme », and no module numbers);
- the formats (on-site or remote) and the note that the program and exercises are adapted to the group;
- a call to action to the contact form, with the domain preselected in the form;
- links to the related domains.

**IA pour le développement** has not been taught yet: its page says honestly that it is a new offer (e.g. a « Nouveau » label), centered on method and good practices, to help employees use AI tools to be more productive and more satisfied in their daily work.

Each offer is a content file in the repository, named after its slug, which lists the ids of the former courses it contains (e.g. `former-ids: [1, 2, 3, 4, 9, 10, 11]`). The redirects are generated from these lists.

## URLs and redirects

The paths of the former site are kept when the page still exists, so the existing links and the search ranking are not lost:

- `/`, `/courses`, `/articles`, `/about`, `/contact`, `/policy`: the same paths.
- `/courses/1` to `/courses/12`: redirect to the page of the domain that now contains the course (see the table above).
- `/articles/1` and `/articles/2`: redirect to the same articles at their new readable URL.
- `/creations`, `/register`, `/login`: no redirect; they show the not-found page.

GitHub Pages has no server-side redirects: a redirect is a static page with a canonical link and an immediate redirection. Changing a public URL is a breaking change.

## Content

- The site content is in French, with French typography, in content files: never hard-coded in the layout or the components, so that a translation can be added later.
- The content of the former site is the starting point; it is rewritten for the new audiences.
- The two former articles (« Découverte d'Alpine JS », « Découverte de Tailwind CSS ») are kept.
- The partners are shown by their logo, with their name as alternative text.

## Contact details and legal information

- Public contact: the e-mail address aunim.hassan@gmail.com, the phone number, LinkedIn and GitHub (`aunimhsn`). The phone number and the LinkedIn URL are given by the owner during step 10.
- Not shown: Instagram, YouTube, Twitch (Twitch may be added later, once the owner streams).
- Legal notice: name (Aunim Hassan), status (micro-entreprise), SIRET, e-mail, phone, NDA followed by « Cet enregistrement ne vaut pas agrément de l'État », and the host (GitHub). **The home address is never shown**, for the owner's safety; see the accepted risk in [docs/external-services.md](docs/external-services.md).
- The Qualiopi certification is never mentioned: the trainer doesn't have it and works through schools and training organizations.
- Privacy policy: the data of the form (fields, sending to Formspree, transfer to the United States, use limited to answering, retention), the audience measurement (GoatCounter, without cookies), the visitor's rights and how to exercise them by e-mail.

## Audience measurement

- **GoatCounter**: page views, referrers, browsers, screen sizes and countries, as aggregated counts. No cookie and no data stored in the visitor's browser, so no consent banner; it is described in the privacy policy.

## Constraints

- Static site on GitHub Pages, custom domain `sylent.art`, HTTPS enforced, `CNAME` file kept.
- Every page has a title, a meta description, `lang="fr"`, and is usable at phone width.
- Accessibility: semantic HTML, sufficient contrast, every action reachable with the keyboard.
- Images have an `alt` text and are served in a light format (e.g. WebP) at the size they are shown.
- No secret and no personal data other than the public contact details in the public repository.

## To provide during the build

- The phone number, the LinkedIn URL, the SIRET and the NDA (step 10).
- The final grouping and texts of the domains: levels, prerequisites, objectives, programs, durations (step 8).
- A recent photo for the about page, or the photo of the former site (step 10).
- The partner logos, in good quality, including the new IGENSIA Tech logo (step 7).
