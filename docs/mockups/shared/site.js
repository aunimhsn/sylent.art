// The parts shared by every page of the mock-up, loaded at the start of <body>, before the
// script of the page: the brand, the icons, the domains and the helpers the pages use to build
// their content, then the header, the mobile menu and the back-to-top button, and their
// behavior. A page sets data-page on <body> (home, courses, contact) to mark its link in the
// navigation.

const NB = "\u00a0";

// The mark (logo-sylent.svg of the charter) and the wordmark (Montserrat 800, -0.195 em, drawn as
// a path so that the site loads no third font).
const MARK = '<svg class="app-mark" viewBox="0 0 908 2000.3" fill="currentColor" aria-hidden="true"><rect x="8.8" y="218.2" transform="matrix(0.6503 -0.7597 0.7597 0.6503 -171.45 428.7256)" width="742.3" height="364.9"/><rect x="156.9" y="1417.3" transform="matrix(0.6503 -0.7597 0.7597 0.6503 -1030.6389 960.5798)" width="742.3" height="364.9"/><rect x="82.9" y="818.4" transform="matrix(0.6503 -0.7597 0.7597 0.6503 -601.5629 694.9067)" width="742.3" height="364.9"/></svg>';
const WORDMARK = '<svg class="app-wordmark" viewBox="21 -714 3064 728" fill="currentColor" aria-hidden="true"><path d="M315.5 13.8Q229.6 13.8 150.1 -7.4Q70.6 -28.6 20.7 -62.5L85.8 -209.0Q133.1 -178.5 194.7 -159.4Q256.4 -140.4 316.8 -140.4Q358.3 -140.4 382.9 -147.5Q407.5 -154.6 419.0 -167.5Q430.5 -180.3 430.5 -197.3Q430.5 -221.0 408.9 -234.9Q387.3 -248.8 352.0 -257.9Q316.7 -266.9 274.5 -275.9Q232.2 -284.9 189.6 -298.7Q147.1 -312.6 111.8 -335.1Q76.5 -357.6 54.9 -394.5Q33.3 -431.4 33.3 -487.4Q33.3 -549.6 67.6 -600.9Q101.9 -652.3 170.8 -683.0Q239.8 -713.8 343.4 -713.8Q411.6 -713.8 478.2 -698.5Q544.7 -683.2 596.6 -652.5L536.1 -506.3Q486.0 -533.2 437.0 -546.4Q388.1 -559.5 341.7 -559.5Q300.9 -559.5 276.0 -551.1Q251.0 -542.6 240.0 -528.5Q229.0 -514.5 229.0 -497.2Q229.0 -474.3 250.6 -460.7Q272.3 -447.1 307.5 -438.5Q342.8 -430.0 385.4 -421.2Q428.0 -412.4 470.2 -398.7Q512.5 -385.0 547.7 -362.6Q583.0 -340.3 604.6 -303.7Q626.3 -267.2 626.3 -212.2Q626.3 -151.0 591.8 -99.7Q557.3 -48.3 488.6 -17.2Q419.8 13.8 315.5 13.8ZM699.2 0.0V-296.1L744.5 -177.1L431.5 -700.0H641.1L866.6 -320.7H745.5L972.7 -700.0H1165.1L853.4 -177.1L897.3 -296.1V0.0ZM1020.3 0.0V-700.0H1218.4V-156.9H1552.1V0.0ZM1435.3 0.0V-700.0H1983.5V-546.5H1630.7V-153.4H1996.8V0.0ZM1616.8 -281.4V-428.8H1941.9V-281.4ZM1912.3 0.0V-700.0H2075.3L2460.7 -233.6H2383.8V-700.0H2577.8V0.0H2414.8L2029.3 -466.3H2106.3V0.0ZM2671.6 0.0V-543.0H2457.0V-700H3084.3V-543.0H2869.7V0.0Z"/></svg>';

// Icons as SVG lines in the text color.
const ICONS = {
  menu: '<path d="M4 8h16M4 16h16"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  up: '<path d="M6 15l6-6 6 6"/>',
  down: '<path d="M6 9l6 6 6-6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
};
const icon = (name, size = 22) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

// Section heading, after the former site: a title over a large faded word.
// Its title is in capitals and drops its accents, which the mask of its animation would cut (« DANS
// LE MEME DOMAINE »); screen readers and search engines keep the real words.
const unaccented = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const heading = (title, ghost, id, level = 2) => `
  <div class="app-heading">
    <span class="app-heading-ghost" aria-hidden="true">${ghost}</span>
    <h${level} class="app-heading-title" id="${id}"${unaccented(title) !== title ? ` aria-label="${title}"` : ""}>${unaccented(title)}</h${level}>
  </div>`;

// The pages of the mock-up, and the links of the navigation.
const PAGES = { home: "home-site.html", courses: "courses-site.html", module: "module-site.html", contact: "contact-site.html", legal: "legal-site.html", privacy: "privacy-site.html", notFound: "not-found-site.html", about: "about-site.html" };
// The slug of a module, for its page: « Intégrer l’IA avec méthode » gives integrer-l-ia-avec-methode.
const slugOf = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// The articles are left out of the first release.
const NAVIGATION = [["Formations", PAGES.courses, "courses"], ["À propos", PAGES.about, "about"], ["Contact", PAGES.contact, "contact"]];
// The header and the menu leave out Contact: their « Me contacter » button leads there. The
// footer keeps the full list.
const MENU = NAVIGATION.filter(([, , page]) => page !== "contact");
const currentPage = document.body.dataset.page;
const current = page => page === currentPage ? ' aria-current="page"' : "";

// A link to another site opens in a new tab, which a screen reader announces.
const external = (href, label) => `<a href="${href}" target="_blank" rel="noopener">${label}<span class="app-hidden"> [nouvel onglet]</span></a>`;

// The domains of the offers (specs.md, Training offers): the slug of their page, the title, the
// summary, the 3D scene of their cover (shared/covers.js), whether the offer is new, and their
// modules: title, indicative duration in days, summary (a short sentence that says what the
// module is for, not a list of notions) and scene. Sample content until step 8.
const DOMAINS = [
  { slug: "initiation-a-la-programmation", title: "Initiation à la programmation", summary: "Les bases de la logique et de l’algorithmique, en douceur.", scene: "steps", modules: [
    ["Algorithmique", 3, "Apprendre à résoudre un problème pas à pas, avant tout langage.", "flowchart"],
    ["Robomind", 1, "Programmer un robot virtuel pour découvrir la logique en jouant.", "steps"],
  ] },
  { slug: "developpement-web", title: "Développement web", summary: `Du HTML aux frameworks${NB}: construire des sites et des applications web.`, scene: "web", modules: [
    ["HTML 5", 1, "Écrire des pages web bien structurées, lisibles par tous.", "markup"],
    ["CSS 3", 2, "Mettre en forme une page et l’adapter à tous les écrans.", "layout"],
    ["JavaScript", 3, "Rendre une page interactive et la faire dialoguer avec un serveur.", "event"],
    ["PHP", 3, "Construire un site dynamique, relié à une base de données.", "server"],
    ["Vue", 2, "Construire une interface réactive à partir de composants.", "tree"],
    ["Alpine", 1, "Ajouter de l’interactivité à une page, sans quitter le HTML.", "peaks"],
    ["Laravel", 4, "Développer une application web complète avec un framework PHP.", "mvc"],
  ] },
  { slug: "python-et-donnees", title: "Python et données", summary: "Programmer en Python, du script au machine learning.", scene: "chart", modules: [
    ["Python", 3, "Apprendre à programmer avec un langage simple et polyvalent.", "snake"],
    ["Django", 3, "Développer une application web complète avec un framework Python.", "form"],
    ["Machine learning", 2, "Entraîner un premier modèle qui apprend à partir des données.", "fit"],
  ] },
  { slug: "bases-de-donnees", title: "Bases de données", summary: "Modéliser, concevoir et interroger des données.", scene: "database", modules: [
    ["Merise", 2, "Modéliser les données d’un projet avant de créer la base.", "entities"],
    ["MySQL", 2, "Créer une base de données et l’interroger avec le langage SQL.", "table"],
    ["PostgreSQL", 2, "Aller plus loin en SQL avec une base robuste et complète.", "join"],
  ] },
  { slug: "conception-logicielle", title: "Conception logicielle", summary: "Penser l’architecture d’un logiciel avant de l’écrire.", scene: "blueprint", modules: [
    ["Programmation orientée objet", 3, "Penser un programme en objets, quel que soit le langage.", "instances"],
    ["UML", 2, "Représenter un logiciel en diagrammes pour mieux le concevoir.", "classes"],
    ["Principes SOLID", 2, "Organiser son code objet pour qu’il reste simple à faire évoluer.", "solid"],
    ["Design patterns", 2, "Reconnaître et appliquer des solutions éprouvées aux problèmes courants.", "observer"],
  ] },
  { slug: "methodologie-et-tests", title: "Méthodologie et tests", summary: "Versionner, tester et livrer avec méthode.", scene: "branch", modules: [
    ["Git et GitHub", 2, "Versionner son code et travailler à plusieurs sur un projet.", "branch"],
    ["Cypress", 2, "Tester une application comme le ferait un utilisateur.", "checks"],
    ["Intégration continue", 1, "Vérifier automatiquement le code à chaque modification.", "pipeline"],
    ["Déploiement continu", 1, "Mettre en ligne automatiquement chaque nouvelle version.", "deploy"],
  ] },
  { slug: "ia-pour-le-developpement", title: "IA pour le développement", summary: "Utiliser l’IA avec méthode et rigueur, au quotidien.", scene: "network", isNew: true, modules: [
    ["Claude Code", 2, "Programmer avec un assistant d’IA, en gardant la main sur le code.", "terminal"],
    ["Prompt engineering", 1, "Formuler ses demandes pour obtenir des réponses utiles et fiables.", "chat"],
    ["Intégrer l’IA avec méthode", 1, "Adopter l’IA en équipe, avec des règles claires et sûres.", "orbit"],
  ] },
  { slug: "gestion-de-projet", title: "Gestion de projet", summary: "S’initier à l’agilité avec Scrum.", scene: "board", modules: [
    ["Initiation à l’agilité avec Scrum", 2, "Découvrir l’agilité en menant un projet fil rouge avec Scrum.", "sprint"],
  ] },
];

// No domain pages in the first release: a domain card leads to the offer list, at its first module.
const domainCard = domain => `
  <li class="app-card app-glass app-reveal app-tilt" data-domain="${domain.slug}">
    <div class="app-cover" data-scene="${domain.scene}" aria-hidden="true"><canvas></canvas>${domain.isNew ? '<span class="app-new">Nouveau</span>' : ""}</div>
    <h3>${domain.title}</h3><p>${domain.summary}</p>
    <a class="app-card-more" href="${PAGES.courses}#${domain.slug}" aria-label="${domain.title}${NB}: voir les modules">Voir les modules</a>
  </li>`;
// The card of one module, on the offer list: under its name, the domain it belongs to. The
// modules of a new domain are new too. The first card of a domain carries its slug, for the links
// of the home page.
const moduleCard = (domain, [title, , summary, scene], first = false) => `
  <li class="app-card app-glass app-reveal app-tilt"${first ? ` id="${domain.slug}"` : ""}>
    <div class="app-cover" data-scene="${scene}" aria-hidden="true"><canvas></canvas>${domain.isNew ? '<span class="app-new">Nouveau</span>' : ""}</div>
    <h3>${title}</h3><p class="app-card-domain">${domain.title}</p><p>${summary}</p>
    <a class="app-card-more" href="${PAGES.module}?module=${slugOf(title)}" aria-label="${title}${NB}: voir le détail">Voir le détail</a>
  </li>`;
// The last card, after the domains or the modules: a module built for the request. After the
// domains of the home page it is a band across its own row (isBand), without glass or scene, its
// text in a dashed frame.
const customText = `<h3>Un besoin sur mesure${NB}?</h3>
    <p>Décrivez vos apprenants et vos objectifs${NB}: je construis le module.</p>`;
const customCard = (isBand = false) => isBand ? `
  <li class="app-card app-reveal is-band">
    <div class="app-card-text">${customText}</div>
    <a class="app-card-more" href="${PAGES.contact}"><span>Me contacter</span>${icon("right", 18)}</a>
  </li>` : `
  <li class="app-card app-glass app-reveal app-tilt">
    <div class="app-cover" data-scene="custom" aria-hidden="true"><canvas></canvas></div>
    ${customText}
    <a class="app-card-more" href="${PAGES.contact}">Me contacter</a>
  </li>`;

// The call to action and the footer, which a page places at its end; an offer page asks its own
// question.
const siteCta = (question = `Un module à confier${NB}?<br>Parlons de vos apprenants.`) => `
  <section class="app-cta" aria-labelledby="cta-title">
    <span class="app-cta-ghost" aria-hidden="true">Echanger</span>
    <div class="app-wrap">
      <h2 class="app-reveal" id="cta-title">${question}</h2>
      <a class="app-button app-magnetic app-reveal" href="${PAGES.contact}">Me contacter</a>
    </div>
  </section>`;
// The sections shared by the home and about pages: the partners, the steps of the pedagogy and the
// key figures.
const STEPS = [
  ["Définir un pourquoi", `Pourquoi cette notion${NB}? Pourquoi ce module${NB}? Pourquoi ensemble${NB}? Quand on comprend le sens, l’envie d’apprendre suit.`],
  ["Pas à pas", "Avec patience et bienveillance, une analogie après l’autre, de votre point A à votre point B, en toute sérénité."],
  ["Apprendre à apprendre", `L’informatique évolue vite, apprendre en autodidacte devient indispensable.<br>Deux clés${NB}: la curiosité et la méthode.`],
  ["L’expérience", "Formateur depuis 2021, plus de 900 heures de formation par an depuis 2023."],
];
// Logos of the former site, traced into white SVG; IGENSIA Tech has none yet. The scale is
// 1 / √(width / height) of each logo, for an equal visual weight.
const PARTNERS = [["YNOV", "ynov", 0.638], ["IGENSIA Tech", null], ["EPSI", "epsi", 0.8], ["CESI", "cesi", 1], ["OpenClassrooms", "openclassrooms", 0.277]];
const partnerReel = () => `
  <div class="app-partners-reel app-reveal">
    <ul class="app-partner-list">${[false, true].map(copy => PARTNERS.map(([name, file, scale]) => `
      <li${copy ? ' class="is-copy" aria-hidden="true"' : ""}>${file ? `<img src="assets/partners/${file}.svg" alt="${copy ? "" : name}" style="--scale: ${scale}">` : `<span class="app-partner-name">${name}</span>`}</li>`).join("")).join("")}
    </ul>
  </div>`;
// The steps are numbered in Roman numerals, decorative: the list itself gives the order.
const ROMAN = ["I", "II", "III", "IV", "V", "VI"];
const stepList = () => `
  <ol class="app-steps">${STEPS.map(([title, text], index) => `
    <li class="app-reveal">
      <span class="app-step-number" aria-hidden="true">${ROMAN[index]}</span>
      <div class="app-step-rule"></div>
      <h3>${title}</h3><p>${text}</p>
    </li>`).join("")}
  </ol>`;
const figureList = () => `
  <div class="app-figures">
    <div><strong><span class="app-count" data-from="2000" data-to="2021">2021</span></strong><span>formateur depuis</span></div>
    <div><strong><span class="app-count" data-to="900">900</span>+${NB}h</strong><span>de formation par an</span></div>
    <div><strong><span class="app-count" data-to="5">5</span></strong><span>écoles et organismes</span></div>
  </div>`;
function spinPartners() {
  // The reel of partners on a phone, driven frame by frame so that each logo has its own depth:
  // it comes in at the bottom, and near the top it moves away toward the back (smaller, tilted
  // back, fading) before it disappears. The CSS animation stays as a fallback.
  const reel = document.querySelector(".app-partners-reel");
  const reelList = reel.querySelector(".app-partner-list");
  const reelItems = [...reelList.children];
  const phone = matchMedia("(max-width: 759px)");
  let reelOffset = 0, reelTime = performance.now(), reelSeen = true;
  new IntersectionObserver(([entry]) => { reelSeen = entry.isIntersecting; }).observe(reel);
  function spinReel(now) {
    requestAnimationFrame(spinReel);
    const step = now - reelTime;
    reelTime = now;
    if (!phone.matches || reduced) {
      reelList.style.animation = reelList.style.transform = "";
      reelItems.forEach(item => { item.style.transform = item.style.opacity = ""; });
      return;
    }
    if (!reelSeen) return;
    const row = reelItems[0].offsetHeight;
    const height = reel.clientHeight;
    reelOffset = (reelOffset + step * row / 2800) % (row * reelItems.length / 2);
    reelList.style.animation = "none";
    reelList.style.transform = `translateY(${-reelOffset}px)`;
    reelItems.forEach((item, index) => {
      const place = (index * row + row / 2 - reelOffset) / height; // 0 at the top, 1 at the bottom
      const away = Math.min(1, Math.max(0, (0.42 - place) / 0.42));
      const coming = Math.min(1, Math.max(0, (place - 0.62) / 0.38));
      item.style.transform = `perspective(500px) translateZ(${-away * 320}px) rotateX(${away * 38}deg) scale(${1 - coming * 0.12})`;
      item.style.opacity = String(Math.max(0, 1 - away * 1.1 - coming));
    });
  }
  requestAnimationFrame(spinReel);
}

// A text page (legal notice, privacy policy): a heading over the grid, the date of the last update,
// then sections beside their table of contents, which follows the scroll on a computer.
// Each section is [id, title, html].
const docPage = ({ title, ghost, lead, updated, sections }) => `
  <article class="app-doc" aria-labelledby="doc-title">
    <div class="app-wrap">
      <header class="app-doc-head" data-grid>
        ${heading(title, ghost, "doc-title", 1)}
        <p class="app-lead app-reveal">${lead}</p>
        <p class="app-doc-updated app-reveal">Mis à jour le ${updated}</p>
      </header>
      <div class="app-doc-body">
        <nav class="app-doc-toc" aria-label="Sommaire">
          <ol>${sections.map(([id, section]) => `<li><a href="#${id}">${section}</a></li>`).join("")}</ol>
        </nav>
        <div class="app-doc-main">${sections.map(([id, section, html]) => `
          <section class="app-doc-section app-reveal" id="${id}" aria-labelledby="${id}-title">
            <h2 id="${id}-title">${section}</h2>
            ${html}
          </section>`).join("")}
        </div>
      </div>
    </div>
  </article>`;
// The table of contents marks, with the signal color, the section being read: the last one whose
// top has passed the upper third of the window.
function followDoc() {
  const links = [...document.querySelectorAll(".app-doc-toc a")];
  const sections = links.map(link => document.querySelector(link.hash));
  const mark = () => {
    const passed = sections.filter(section => section.getBoundingClientRect().top < innerHeight / 3);
    const current = passed.length ? passed[passed.length - 1] : sections[0];
    links.forEach((link, index) => link.toggleAttribute("aria-current", sections[index] === current));
  };
  addEventListener("scroll", mark, { passive: true });
  mark();
}
// A detail still to provide, shown as such.
const pending = text => `<span class="app-pending">${text}</span>`;

const siteFooter = () => `
  <footer class="app-footer">
    <div class="app-footer-logo" role="img" aria-label="Sylent">${WORDMARK}</div>
    <div class="app-wrap">
      <div class="app-footer-grid">
        <div><p class="app-motto">Une vie, mille leçons</p><p>Formateur en informatique, sur site ou à distance.</p></div>
        <div><h2>Navigation</h2><ul>${NAVIGATION.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul></div>
        <div><h2>Contact</h2><ul><li><a href="mailto:aunim.hassan@gmail.com">aunim.hassan@gmail.com</a></li><li><a href="tel:+33613449424">06${NB}13${NB}44${NB}94${NB}24</a></li><li>${external("https://www.linkedin.com/in/aunimhsn/", "linkedin.com/in/aunimhsn")}</li><li>${external("https://github.com/aunimhsn", "github.com/aunimhsn")}</li></ul></div>
        <div><h2>Informations</h2><ul><li><a href="${PAGES.legal}">Mentions légales</a></li><li><a href="${PAGES.privacy}">Confidentialité</a></li><li>NDA${NB}: 76311138131</li></ul></div>
      </div>
      <p class="app-footer-bottom">© 2026 Aunim Hassan · Micro-entreprise</p>
    </div>
  </footer>`;

// The header, the mobile menu and the back-to-top button.
document.body.insertAdjacentHTML("afterbegin", `
  <a class="app-skip" href="#content">Aller au contenu</a>
  <header class="app-header" id="header">
    <div class="app-wrap">
      <a class="app-logo" href="${PAGES.home}" aria-label="Sylent, accueil">${MARK}${WORDMARK}</a>
      <nav class="app-nav" aria-label="Navigation principale">${MENU.map(([label, href, page]) => `<a href="${href}"${current(page)}>${label}</a>`).join("")}</nav>
      <a class="app-button app-magnetic" href="${PAGES.contact}"${current("contact")}>Me contacter</a>
      <button class="app-burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu" id="burger">${icon("menu", 24)}</button>
    </div>
  </header>
  <div class="app-menu" id="menu" aria-hidden="true">
    ${MENU.map(([label, href, page]) => `<a class="app-menu-link" href="${href}"${current(page)}>${label}</a>`).join("")}
    <a class="app-button" href="${PAGES.contact}"${current("contact")}>Me contacter</a>
    <p class="app-motto">Une vie, mille leçons</p>
  </div>
  <button class="app-top" type="button" id="back-to-top" aria-label="Revenir en haut de la page">${icon("up", 20)}</button>`);

// Header: solid once the page scrolls, hidden while scrolling down.
const header = document.getElementById("header");
let lastScroll = 0;
addEventListener("scroll", () => {
  const y = scrollY;
  header.classList.toggle("is-scrolled", y > 20);
  if (!header.classList.contains("is-menu")) header.classList.toggle("is-hidden", y > 400 && y > lastScroll);
  lastScroll = y;
}, { passive: true });

// Mobile menu.
const menu = document.getElementById("menu");
const burger = document.getElementById("burger");
function toggleMenu(open = !menu.classList.contains("is-open")) {
  menu.classList.toggle("is-open", open);
  header.classList.toggle("is-menu", open);
  menu.setAttribute("aria-hidden", String(!open));
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  burger.innerHTML = icon(open ? "close" : "menu", 24);
  document.body.style.overflow = open ? "hidden" : "";
  if (open && !reduced && window.gsap) gsap.fromTo(menu.querySelectorAll(".app-menu-link, .app-button"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.7, delay: 0.2, ease: "expo.out" });
}
burger.addEventListener("click", () => toggleMenu());
menu.addEventListener("click", event => { if (event.target.closest("a")) toggleMenu(false); });
addEventListener("keydown", event => { if (event.key === "Escape" && menu.classList.contains("is-open")) { toggleMenu(false); burger.focus(); } });

// Back to the top: shown once the first screen is passed; the focus goes back to the logo, for
// the keyboard.
const backToTop = document.getElementById("back-to-top");
addEventListener("scroll", () => backToTop.classList.toggle("is-visible", scrollY > innerHeight * 0.8), { passive: true });
backToTop.addEventListener("click", () => {
  scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  document.querySelector(".app-logo").focus({ preventScroll: true });
});

// Contact links. A click on an email address copies it, with a small orange « Copiée », since
// many visitors have no mail application set up on their computer; a screen reader hears it too.
// A phone number is a link only on touch screens, where it opens the phone application.
const announcer = document.createElement("p");
announcer.className = "app-announce";
announcer.setAttribute("aria-live", "polite");
document.body.appendChild(announcer);
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Older browsers, or a page that isn't served over HTTPS: the former way to copy.
    const area = Object.assign(document.createElement("textarea"), { value: text });
    area.setAttribute("readonly", "");
    Object.assign(area.style, { position: "fixed", opacity: "0" });
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}
document.addEventListener("click", async event => {
  const link = event.target.closest('a[href^="mailto:"]');
  if (!link) return;
  event.preventDefault();
  await copyText(link.href.replace("mailto:", ""));
  const box = link.getBoundingClientRect();
  const badge = Object.assign(document.createElement("span"), { className: "app-copied", textContent: "Copiée" });
  Object.assign(badge.style, { left: `${box.left + box.width / 2 + scrollX}px`, top: `${box.top + scrollY - 22}px` });
  badge.addEventListener("animationend", () => badge.remove());
  document.body.appendChild(badge);
  announcer.textContent = "";
  announcer.textContent = "Adresse email copiée";
});
document.addEventListener("DOMContentLoaded", () => {
  if (matchMedia("(pointer: coarse)").matches) return;
  document.querySelectorAll('a[href^="tel:"]').forEach(link => { link.tabIndex = -1; });
});

// The grids of the footer and of the tops of page: under the pointer, an orange fluid runs along
// their lines. Each crossing of a grid holds some energy: the pointer pours energy into the
// crossings around it as it moves, the energy spreads to the neighbor crossings and fades, and
// each line glows with the energy of its two ends. The fluid is drawn in a layer that the page
// places exactly over its grid (className), with the same mask, so that it fades out where the
// grid fades out. Nothing moves when the visitor asked to reduce motion.
function gridFluid(host, CELL, className) {
  const layer = document.createElement("div");
  layer.className = `app-fluid ${className}`;
  layer.setAttribute("aria-hidden", "true");
  const canvas = document.createElement("canvas");
  layer.appendChild(canvas);
  host.prepend(layer);
  const context = canvas.getContext("2d");
  const signal = getComputedStyle(document.documentElement).getPropertyValue("--signal").trim() || "#d3450e";
  const [red, green, blue] = [1, 3, 5].map(index => parseInt(signal.slice(index, index + 2), 16));
  let columns = 0, rows = 0, energy = new Float32Array(0), next = new Float32Array(0);
  let width = 0, height = 0, running = false, seen = false, pointer = null;

  function resize() {
    const ratio = Math.min(devicePixelRatio, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    columns = Math.ceil(width / CELL) + 1;
    rows = Math.ceil(height / CELL) + 1;
    energy = new Float32Array(columns * rows);
    next = new Float32Array(columns * rows);
  }
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => { seen = entry.isIntersecting; }).observe(canvas);

  // Pour energy into the crossings within 1.6 cells of the pointer, more as it moves faster. The
  // pointer is followed over the whole page, since the layer of a page top lies under its content.
  addEventListener("pointermove", event => {
    const box = canvas.getBoundingClientRect();
    const x = event.clientX - box.left, y = event.clientY - box.top;
    if (x < 0 || y < 0 || x > box.width || y > box.height) { pointer = null; return; }
    const moved = pointer ? Math.hypot(x - pointer.x, y - pointer.y) : 0;
    pointer = { x, y };
    const amount = Math.min(0.9, 0.12 + moved / 60);
    const reach = CELL * 1.6;
    for (let row = Math.max(0, Math.floor((y - reach) / CELL)); row <= Math.min(rows - 1, Math.ceil((y + reach) / CELL)); row++) {
      for (let column = Math.max(0, Math.floor((x - reach) / CELL)); column <= Math.min(columns - 1, Math.ceil((x + reach) / CELL)); column++) {
        const distance = Math.hypot(column * CELL - x, row * CELL - y);
        if (distance < reach) {
          const index = row * columns + column;
          energy[index] = Math.min(1, energy[index] + amount * (1 - distance / reach));
        }
      }
    }
    if (!running) { running = true; requestAnimationFrame(step); }
  });
  document.addEventListener("pointerleave", () => { pointer = null; });

  function line(x1, y1, x2, y2, a, b) {
    if (a + b < 0.02) return;
    const gradient = context.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, `rgba(${red}, ${green}, ${blue}, ${Math.min(1, a * 1.3)})`);
    gradient.addColorStop(1, `rgba(${red}, ${green}, ${blue}, ${Math.min(1, b * 1.3)})`);
    context.strokeStyle = gradient;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  function step() {
    // Spread: each crossing moves toward the mean of its neighbors, then fades a little.
    let total = 0;
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const index = row * columns + column;
        let sum = 0, count = 0;
        if (column > 0) { sum += energy[index - 1]; count++; }
        if (column < columns - 1) { sum += energy[index + 1]; count++; }
        if (row > 0) { sum += energy[index - columns]; count++; }
        if (row < rows - 1) { sum += energy[index + columns]; count++; }
        const value = (energy[index] + (sum / count - energy[index]) * 0.42) * 0.968;
        next[index] = value < 0.004 ? 0 : value;
        total += next[index];
      }
    }
    [energy, next] = [next, energy];

    if (seen) {
      context.clearRect(0, 0, width, height);
      // A soft wide stroke for the glow, then the thin line itself.
      for (const [lineWidth, alpha] of [[4, 0.22], [1, 1]]) {
        context.lineWidth = lineWidth;
        context.globalAlpha = alpha;
        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columns; column++) {
            const index = row * columns + column;
            const x = column * CELL + 0.5, y = row * CELL + 0.5;
            if (column < columns - 1) line(x, y, x + CELL, y, energy[index], energy[index + 1]);
            if (row < rows - 1) line(x, y, x, y + CELL, energy[index], energy[index + columns]);
          }
        }
      }
      context.globalAlpha = 1;
    }
    // Stop once the fluid is gone, until the pointer moves again.
    if (total > 0.01 || pointer) requestAnimationFrame(step);
    else { running = false; context.clearRect(0, 0, width, height); }
  }
}
// The footer has cells of 40 px; a page top marks its grid with data-grid (cells of 32 px).
document.addEventListener("DOMContentLoaded", () => {
  if (reduced) return;
  const footer = document.querySelector(".app-footer");
  if (footer) gridFluid(footer, 40, "app-footer-fluid");
  document.querySelectorAll("[data-grid]").forEach(host => gridFluid(host, 32, "app-grid-fluid"));
});

// The reveals start hidden; if the animations don't start (a library that doesn't load), show
// everything.
document.documentElement.classList.add("is-js");
setTimeout(() => { if (!window.sylentMotion) document.documentElement.classList.remove("is-js"); }, 4000);
