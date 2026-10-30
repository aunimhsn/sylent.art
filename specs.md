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
| Formations | `/formations` | The entry to the offers, the « Formations » link of the header: one card per domain, as on the home page, each leading to its page. The site has no flat list of every module: a visitor goes from a domain to its formations and modules (see [Training offers](#training-offers)). |
| Domain page | `/domaines/<domain>` | Present one domain and its formations, then lead to the other domains (see [Domain pages](#domain-pages)). |
| Formation page | `/formations/<formation>` | Present a formation of several modules (see [Formation pages](#formation-pages)). |
| Module page | `/formations/<formation>/<module>` | Detail one module (see [Training offers](#training-offers)). |
| About | `/a-propos` | Present the trainer: background, approach, references, NDA, over a photo of the trainer, large and faded (decided by the owner on 2026-10-29; the home page shows it too, behind « Qui suis-je ? » and on the first face of the hero cube). |
| Contact | `/contact` | The contact form and the other ways to reach the trainer. |
| Legal notice | `/mentions-legales` | The publisher, the training activity declaration, the host, the intellectual property and the credits. |
| Privacy policy | `/confidentialite` | How the form and audience data are handled. |
| Not found | `404.html` | A page « Oups, perdu dans l’espace », as on the former site (« Page introuvable » at phone width), with links to the home page and the offers. |

Every page has a header with the navigation (Formations, À propos) and a visible « Me contacter » button, which leads to the contact page (so the navigation has no separate « Contact » link), and a footer with the navigation, the contact details, the legal page and the signature.

The site has no articles: the owner removed them (decided on 2026-10-28). Their former URLs redirect to the home page (see [URLs and redirects](#urls-and-redirects)).

The former « Créations » section (photography, artwork), the user accounts and any back-office are out of scope.

## Training offers

The offers are classified on three levels, decided with the owner on 2026-10-30 (step 13 of `roadmap.md`, tree in [docs/wireframes/offer-classification.excalidraw](docs/wireframes/offer-classification.excalidraw)):

- a **domain** is a shelf where a school looks for a speaker (« Développement web », « Bases de données »): schools start from the domain;
- a **formation** is one subject, a technology or a method (JavaScript, Merise, Agilité): it gathers its modules in an advised order and gives them their address;
- a **module** is the unit a client books, with its program.

Vocabulary: in the code and the documentation, a formation is a **collection** (a list of modules); for the visitors and in the URLs, it is a **formation** (« Formation JavaScript », `/formations/javascript/`), the word of the « Formations » link of the header. The word « collection » is never shown. Schools say « module » for the unit they book.

Rules:

- **Every module belongs to exactly one formation**, which gives its address, even when the formation has a single module: adding a module to a formation later never changes an address. A module that seems to need two formations mixes two subjects: it goes to the formation of the language it is written in, and the other formation may point to it (« PDO » is in PHP, not in MySQL).
- **A module is filed under one or more domains.** A formation appears in a domain as soon as one of its modules does, and a domain shows only its own modules of that formation: in « Développement web », the formation Python shows only Django. The domains are entry points: a formation shown in two domains is the same page, at one address.
- **The names of the modules are short and rely on their formation** (decided by the owner on 2026-10-29): « Fondamentaux » in Python, « POO » in PHP, « PDO », not « PHP et SQL ». The first module of a formation is « Fondamentaux » when it teaches its basics; a module may have its own name (« RoboMind » in Algorithmique, « Scrum » in Agilité).
- **A formation with a single published module is shown by its own name** (« UML », not « Fondamentaux »: the basics of software design are not UML), and its card leads straight to the module; its address `/formations/<formation>/` leads to the module page. A formation with two published modules or more has its own page.
- A framework is a module of the formation of its language (Laravel in PHP, Django in Python, Vue and Alpine in JavaScript, Tailwind in CSS), marked as a framework (decided by the owner on 2026-10-30); how the mark is shown is settled on the mock-up.
- The modules are independent: a client takes one or several, in any order, so the site never presents them as a sequence to follow (no module numbers), except for the advised order of a formation. Small modules that combine (e.g. CSS split into Flexbox and Grid) are the direction after the launch, as the course material is split.

The domains, in the order of the home page and the formations page: the new offers first, since they matter most today (decided by the owner on 2026-10-29), then from the first steps in programming to project management. Each formation is listed with its modules; the brackets give the other domains of a module, (draft) a module kept out of the site, (to come) one whose course doesn't exist yet and isn't written on the site.

| Domain | Slug | Formations and modules |
|---|---|---|
| IA générative | `ia-generative` | Claude Code; Prompt engineering |
| Programmation | `programmation` | Algorithmique (Fondamentaux, RoboMind); Python (Fondamentaux, Modules et packages, POO, Machine learning, Django draft [Web]); JavaScript (Fondamentaux [Web]); PHP (Fondamentaux, POO, PDO to come, each [Web]) |
| Développement web | `developpement-web` | HTML; CSS (Fondamentaux, Tailwind draft); JavaScript (Fondamentaux [Programmation], DOM to come, Vue draft, Alpine); PHP (Fondamentaux, POO, PDO to come [Programmation], Laravel); Python (Django draft [Programmation]) |
| Bases de données | `bases-de-donnees` | Merise; MySQL; PostgreSQL (draft) |
| Conception logicielle | `conception-logicielle` | UML; Principes SOLID; Design patterns |
| Méthodologie et tests | `methodologie-et-tests` | Git / GitHub [Gestion de projet]; Cypress; CI/CD (GitHub Actions, Vercel, Render) |
| Gestion de projet | `gestion-de-projet` | Agilité (Scrum); Git / GitHub [Méthodologie et tests] |

« IA générative » replaces « Développement IA », which could read as « building AIs »: the domain is about using generative AI with method, so machine learning, which builds and trains models with scikit-learn, stays in Python (decided by the owner on 2026-10-30). « Programmation » replaces « Initiation à la prog. »: a language is programming before it is web (a console application in PHP), so the formations of the languages are in it. The domain « Python » is gone: a technology is a formation, not a domain. « Bases de données » keeps its name, the word schools look for; a data domain comes when there are data modules (data visualization). « Modules et packages » (organizing a Python project and its dependencies, from the owner's course) follows the basics of Python; Tailwind, which the owner prefers to teach over Bootstrap, is a draft until its course is written. The POO is a module of each language (PHP and Python, JavaScript once the owner's course covers it), no longer in « Conception logicielle ». Every other module is the only module of its own formation, named after it, with `fondamentaux` as the provisional slug of the module (`/formations/uml/fondamentaux`).

All the former courses are kept, as modules:

| Former course | Module page |
|---|---|
| `/courses/1` | `/formations/html/fondamentaux` |
| `/courses/2` | `/formations/css/fondamentaux` |
| `/courses/3` | `/formations/javascript/fondamentaux` |
| `/courses/4` | `/formations/php/fondamentaux` |
| `/courses/5` | `/formations/mysql/fondamentaux` |
| `/courses/6` | `/formations/python/fondamentaux` |
| `/courses/7` | `/formations/algorithmique/robomind` |
| `/courses/8` | `/formations/cypress/fondamentaux` |
| `/courses/9` | `/formations/javascript/vue` (a draft: the page of its formation meanwhile) |
| `/courses/10` | `/formations/javascript/alpine` |
| `/courses/11` | `/formations/php/laravel` |
| `/courses/12` | `/formations/python/django` (a draft: the page of its formation meanwhile) |

A slug is the name in kebab-case, in French, without accents or version numbers (`html`, `prompt-engineering`, `developpement-web`), the short name when there is one (`git-github`, `poo`, decided by the owner on 2026-10-29); it is unique within its parent only (`fondamentaux` in several formations), never a number, and never changes once published. The addresses of the formations and modules don't depend on the domains, so a domain can be added, renamed or removed without breaking the link of any module; a domain page that disappears after the launch gets a redirect.

Each module page shows:

- the « Nouveau » label at the very top for a module of a new domain, then the name of the module and its formation (how the formation is shown, the faded word behind the title until now, is settled on the wireframe of step 13b); no breadcrumb, the navigation leads back to the offers;
- a short paragraph that says what the subject is and why it matters, written for pedagogical teams rather than as a list of notions;
- the key facts: audience (one per line, e.g. « Étudiants », « Développeurs », « Chefs de projet technique »), level, indicative duration (« 3 jours, adaptable »), formats (on-site or remote);
- the prerequisites and the objectives;
- the program, in parts without numbers: they are not an order, and the practice comes when it is needed. The note that the explanations are short and the exercises adapted to the group;
- a way to organize the module (the contact page);
- the other modules close to it (of its formation, of its domains, settled on the wireframe of step 13b), then a card for a custom request;
- a call to action to the contact form.

Each module has a summary of one short sentence that says what it is for, not a list of notions, shown on its card. The title of its tab, which search engines show, names its formation: « Fondamentaux · Python · Formations · Sylent ».

**IA générative** has not been taught yet: its modules say honestly that it is a new offer (a « Nouveau » label and a short note), centered on method and good practices, to help employees use AI tools to be more productive and more satisfied in their daily work.

Each module is a content file in the repository, which gives its formation, its domains and, for a former course, its former id (e.g. `formerId: 3`); each formation and each domain is a content file too. The redirects are generated from the former ids. A module may be a draft (`draft: true`): its file stays in the repository, but the site shows it nowhere (no page, no card, not on the back of a domain card nor in its tags, and a formation or a domain whose modules are all drafts is left out) until the owner publishes it; its former URL leads to the page of its formation meanwhile, or of its first domain when the formation has no page (decided on 2026-10-29). Vue, Django, PostgreSQL and Tailwind are drafts for now.

### Domain pages

Each domain has its page at `/domaines/<domain>`, its slug in the table above. A visitor reaches it from the card of the domain on the home page and on the formations page, whose white band « Voir les modules » leads there, and from the other domain pages; the header has no link per domain (decided by the owner on 2026-10-29). `/domaines` leads to the formations page. The page shows:

- a hero, as on a module page: the « Nouveau » label for a new domain, the name of the domain, without a faded word behind it, on one line at every width, its summary and, for a new domain, its note;
- the formations of the domain, with only their modules filed under it: a formation of a single module as one card, named after the formation; a formation of several modules as a group (its layout is settled on the wireframe of step 13b); then the card « Un besoin sur mesure ? »;
- « Autres domaines », over the faded word « Explorer »: the cards of the other domains, as on the home page;
- the call to action to the contact form.

The back of a domain card shows its formations as tags (« #html #css #javascript »). A domain whose modules are all drafts has no page. The layout of the domain page was agreed on a wireframe on 2026-10-29 and is now the built page; the formations change it at step 13b.

### Formation pages

A formation of two published modules or more has its page at `/formations/<formation>`: its name (« Formation JavaScript »), a summary, its modules in the advised order, the domains where it is filed, and the call to action. Its layout, and maybe a dialog that lists the modules from a card (a real page stays, for search engines and shared links; after the launch), are settled on the wireframe of step 13b.

## URLs and redirects

Every path is in French. The formations and their modules have one address each, `/formations/<formation>/<module>`, independent of the domains (decided by the owner on 2026-10-30, replacing the tree `/domaines/<domain>/modules/<module>` of 2026-10-29, which was only on the preview and gets no redirect); the domains are entry points at `/domaines/<domain>`. The paths change before the launch, while it costs nothing, rather than after it. Every path of the former site still resolves, so the existing links and the search ranking are not lost:

- `/` and `/contact`: the same paths.
- `/courses` and `/domaines` redirect to `/formations`, `/about` to `/a-propos`, `/policy` (the privacy policy) to `/confidentialite`. The legal notice is a new page, `/mentions-legales`.
- `/courses/1` to `/courses/12`: redirect to the page of the module that the course became (see the table above); the former URL of a draft leads to the page of its formation (see [Training offers](#training-offers)).
- `/formations/<formation>` of a formation with a single published module redirects to its module.
- `/articles`, `/articles/1` and `/articles/2`: redirect to the home page, since the site has no articles.
- `/creations`, `/register`, `/login`: no redirect; they show the not-found page.

GitHub Pages has no server-side redirects: a redirect is a static page with a canonical link and an immediate redirection. Each page is served at its path with a final slash (`/a-propos/`); GitHub Pages redirects the path without it (`/a-propos`) there, so the former URLs keep resolving. Changing a public URL is a breaking change.

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
