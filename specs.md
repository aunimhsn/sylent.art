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

Secondary audience: the learners (students, career changers, employees) who look up their trainer. The site doesn't sell to them directly.

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

1. **Defining a why** (« Définir un pourquoi »): starting from the meaning: why this notion, why this module, why together; once the meaning is understood, the wish to learn follows.
2. **Step by step** (« Pas à pas »): with patience and kindness, one analogy after another, from the learners' point A to their point B, « en toute sérénité ».
3. **Learning to learn** (« Apprendre à apprendre »): computing changes fast, so learning on one's own becomes indispensable; the trainer, self-taught, passes on its two keys, curiosity and method.
4. **Experience**: teaching since 2021, more than 900 training hours per year since 2023, with five schools and training organizations.

Rejected as slogans, because they are expected of any trainer: « savoir-faire et savoir-être », « il n'y a pas de questions bêtes ».

Proofs:

- **Partners** (current clients only, named without their city): YNOV, IGENSIA Tech (formerly IPI), EPSI, CESI, OpenClassrooms (mentoring). AN 21, shown on the former site, is removed.
- **Figure**: « plus de 900 heures de formation par an depuis 2023 », from the yearly bilan pédagogique et financier.
- **Testimonials**: none at launch. The owner collects them after the launch (LinkedIn recommendations, feedback from schools and learners, with their consent to publish); a testimonials section is added once there are at least three.
- No invented proof or figure.

## Conversion

- The main action, repeated on every page, is the **contact form**.
- Two fields, both required: e-mail and message, so that getting in touch costs as little as possible. The name usually comes in the signature of the message, and the organization in the e-mail address or the answer. The example text of the message suggests what to write: the organization, the learners, the training wanted, the dates.
- The form is sent through **Formspree** (see [docs/external-services.md](docs/external-services.md)). Spam is filtered by Formspree and by a hidden honeypot field; no reCAPTCHA, which would add Google cookies.
- After sending, the visitor stays on the page and sees a confirmation: « Merci, votre message est bien envoyé. Je reviens vers vous rapidement. » The site promises no response time for now: the owner may add one once the site is live.
- If the sending fails, the visitor sees an error message with the e-mail address, and the text typed is kept.
- The form works with the keyboard, each field has a label, and the errors are announced next to the field concerned.
- A plain e-mail link stays available as a fallback.

## Pages

| Page | URL | Purpose |
|---|---|---|
| Home | `/` | State the promise, the audiences, the domains, the differentiators, the proofs (partners, figure) and lead to the contact form. |
| Offer list | `/courses` | Present every module, one card per module in a single grid, domain after domain, without headings: cover, name, domain, summary, and a link to the page of the module. The home page keeps one card per domain, whose « Voir les modules » leads to the offer list at that domain (`/courses#<domain>`). |
| Module page | `/courses/<module>` | Detail one module (see [Training offers](#training-offers)). |
| About | `/about` | Present the trainer: background, approach, references, NDA. No photo in the first release. |
| Contact | `/contact` | The contact form and the other ways to reach the trainer. |
| Legal notice | `/legal` | The publisher, the training activity declaration, the host, the intellectual property and the credits. |
| Privacy policy | `/policy` | How the form and audience data are handled. |
| Not found | `404.html` | A page « Oups, perdu dans l’espace », as on the former site (« Page introuvable » at phone width), with links to the home page and the offers. |

Every page has a header with the navigation (Formations, À propos) and a visible « Me contacter » button, which leads to the contact page (so the navigation has no separate « Contact » link), and a footer with the navigation, the contact details, the legal page and the signature.

The site has no articles: the owner removed them (decided on 2026-10-28). Their former URLs redirect to the home page (see [URLs and redirects](#urls-and-redirects)).

The former « Créations » section (photography, artwork), the user accounts and any back-office are out of scope.

## Training offers

One page per **module**, grouped by **domain**. Pedagogical teams look for a speaker on a domain, and the technology matters less and less: the domains organize the home page and the offer list, but the first release has no domain pages. They can come later at `/courses/<domain>` without changing any URL. The domains below are a first grouping, refined with the owner when the content is written. They are shown in the order of the table, on the home page and the offer list alike: the new offers first, since they matter most today (decided by the owner on 2026-10-29), then from the first steps in programming to project management.

| Domain | Slug | Modules | Former courses |
|---|---|---|---|
| Développement IA | `ia-pour-le-developpement` | Claude Code, prompt engineering, méthode et IA | — |
| Initiation à la prog | `initiation-a-la-programmation` | Algorithmique, Robomind | 7 |
| Développement web | `developpement-web` | HTML, CSS, JavaScript, PHP, Vue, Alpine, Laravel | 1, 2, 3, 4, 9, 10, 11 |
| Python | `python-et-donnees` | Python, Django, machine learning | 6, 12 |
| Bases de données | `bases-de-donnees` | Merise, MySQL, PostgreSQL | 5 |
| Conception logicielle | `conception-logicielle` | prog orientée objet, UML, principes SOLID, design patterns | — |
| Méthodologie et tests | `methodologie-et-tests` | Git / GitHub, Cypress, intégration continue (GitHub Actions), déploiement continu (Vercel, Render) | 8 |
| Gestion de projet | `gestion-de-projet` | Méthode agile | — |

All the former courses are kept, as modules:

| Former course | Module page |
|---|---|
| `/courses/1` | `/courses/html` |
| `/courses/2` | `/courses/css` |
| `/courses/3` | `/courses/javascript` |
| `/courses/4` | `/courses/php` |
| `/courses/5` | `/courses/mysql` |
| `/courses/6` | `/courses/python` |
| `/courses/7` | `/courses/robomind` |
| `/courses/8` | `/courses/cypress` |
| `/courses/9` | `/courses/vue` |
| `/courses/10` | `/courses/alpine` |
| `/courses/11` | `/courses/laravel` |
| `/courses/12` | `/courses/django` |

The slug of a module is its name in kebab-case, without version numbers (`html`, `css`, `integrer-l-ia-avec-methode`). It is unique among the modules and the domains, never a number, and never changes once published: a module that moves to another domain keeps its URL.

Each module page shows:

- the domain (with a « Nouveau » label for a new one), the name of the module, and a short paragraph that says what the subject is and why it matters, written for pedagogical teams rather than as a list of notions;
- the key facts: audience (e.g. « Étudiants, développeurs, chefs de projet technique »), level, indicative duration (« 3 jours, adaptable »), formats (on-site or remote);
- the prerequisites and the objectives;
- the program, in parts without numbers: they are not an order, and the practice comes when it is needed. The note that the explanations are short and the exercises adapted to the group;
- a way to organize the module (the contact page);
- the other modules of the same domain, then a card for a custom request; this part is left out when the domain has a single module;
- a call to action to the contact form.

The modules are independent: a client takes one or several, in any order, so the site never presents them as a sequence to follow (no module numbers). Each module has a summary of one short sentence that says what it is for, not a list of notions, shown on its card.

**Développement IA** has not been taught yet: its modules say honestly that it is a new offer (a « Nouveau » label and a short note), centered on method and good practices, to help employees use AI tools to be more productive and more satisfied in their daily work.

Each module is a content file in the repository, named after its slug, which gives its domain and, for a former course, its former id (e.g. `formerId: 3`). The redirects are generated from these ids.

## URLs and redirects

The paths of the former site are kept when the page still exists, so the existing links and the search ranking are not lost:

- `/`, `/courses`, `/about`, `/contact`, `/policy`: the same paths; `/policy` is the privacy policy, as on the former site. The legal notice is a new page, `/legal`.
- `/courses/1` to `/courses/12`: redirect to the page of the module that the course became (see the table above).
- `/articles`, `/articles/1` and `/articles/2`: redirect to the home page, since the site has no articles.
- `/creations`, `/register`, `/login`: no redirect; they show the not-found page.

GitHub Pages has no server-side redirects: a redirect is a static page with a canonical link and an immediate redirection. Each page is served at its path with a final slash (`/about/`); GitHub Pages redirects the path without it (`/about`) there, so the former URLs keep resolving. Changing a public URL is a breaking change.

## Content

- The site content is in French, with French typography, in content files: never hard-coded in the layout or the components, so that a translation can be added later.
- The content of the former site is the starting point; it is rewritten for the new audiences.
- The partners are shown by their logo, with their name as alternative text.

## Contact details and legal information

- Public contact: the e-mail address aunim.hassan@gmail.com, the phone number 06 13 44 94 24, LinkedIn (https://www.linkedin.com/in/aunimhsn/) and GitHub (https://github.com/aunimhsn).
- Not shown: Instagram, YouTube, Twitch (Twitch may be added later, once the owner streams).
- Legal notice: name (Aunim Hassan), status (micro-entreprise), SIRET (894 104 132 00010), e-mail, phone, NDA (76311138131, registered with the prefect of the Occitanie region, as its code 76 says) followed by « Cet enregistrement ne vaut pas agrément de l'État », and the host (GitHub, Inc., with its address and phone number, as article 6 of the LCEN asks; the number +1 877 448 4820 comes from third-party records and is to check on GitHub's own pages before the launch). **The home address is never shown**, for the owner's safety; see the accepted risk in [docs/external-services.md](docs/external-services.md).
- The Qualiopi certification is never mentioned: the trainer doesn't have it and works through schools and training organizations.
- Privacy policy: the data of the form (fields, sending to Formspree, transfer to the United States, use limited to answering, retention: 30 days at Formspree, then 3 years after the last exchange, as the CNIL recommends for business contacts), the audience measurement (GoatCounter, without cookies), the visitor's rights and how to exercise them by e-mail.

## Audience measurement

- **GoatCounter**: page views, referrers, browsers, screen sizes and countries, as aggregated counts. No cookie and no data stored in the visitor's browser, so no consent banner; it is described in the privacy policy.

## Constraints

- Static site on GitHub Pages, custom domain `sylent.art`, HTTPS enforced, `CNAME` file kept.
- Every page has a title, a meta description, `lang="fr"`, and is usable at phone width.
- Accessibility: semantic HTML, sufficient contrast, every action reachable with the keyboard.
- Images have an `alt` text and are served in a light format (e.g. WebP) at the size they are shown.
- No secret and no personal data other than the public contact details in the public repository.

## To provide during the build

- The partner logos, in good quality, including the new IGENSIA Tech logo (step 7).
