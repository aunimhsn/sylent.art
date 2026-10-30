// The offers as classified at step 13 (specs.md, Training offers): domains (shelves) → formations
// (one subject each, the address) → modules. Shared by the pages of the mock-up of step 13b
// (domain-site.html, formation-site.html, module-site.html), loaded after site.js and
// programs.js. The other pages of the mock-up keep the former DOMAINS of site.js.
//
// Decided with the owner on 2026-10-30 (step 13b): no duration is shown anywhere, the days stay in
// the data only; the formation cards list their modules; the framework mark sits across the top
// edge of a card; the title of a formation page is its name alone.

const FORMATIONS_PAGES = { domain: "domain-site.html", formation: "formation-site.html", module: "module-site.html" };

// A module: its slug in its formation, its name, the file of its content (programs.js), its
// duration in days, its scene (covers.js), its domains, and its summary; framework and draft
// when they apply. Modules to come (PDO, DOM) are not written on the site, so not here either.
const mod = (slug, title, file, days, scene, domains, summary, extra = {}) => ({ slug, title, file, days, scene, domains, summary, ...extra });

// The formations, in the order of the table of specs.md. A formation of a single module is named
// after it; the summary of a formation of several modules is sample content, written at step 13c.
const FORMATIONS = [
  { slug: "claude-code", title: "Claude Code", modules: [mod("fondamentaux", "Claude Code", "claude-code", 2, "terminal", ["ia-generative"], "Programmer avec un assistant d’IA, en gardant la main sur le code.")] },
  { slug: "prompt-engineering", title: "Prompt engineering", modules: [mod("fondamentaux", "Prompt engineering", "prompt-engineering", 1, "chat", ["ia-generative"], "Formuler ses demandes pour obtenir des réponses utiles et fiables.")] },
  { slug: "algorithmique", title: "Algorithmique", scene: "flowchart", summary: `Apprendre la logique de la programmation, avant tout langage${NB}: au papier, puis avec un robot.`, modules: [
    mod("fondamentaux", "Fondamentaux", "algorithmique", 3, "flowchart", ["programmation"], "Apprendre à résoudre un problème pas à pas, avant tout langage."),
    mod("robomind", "RoboMind", "robomind", 1, "steps", ["programmation"], "Programmer un robot virtuel pour découvrir la logique en jouant."),
  ] },
  { slug: "python", title: "Python", scene: "snake", summary: "Le langage simple et polyvalent, de ses bases à l’organisation d’un projet et au machine learning.", modules: [
    mod("fondamentaux", "Fondamentaux", "python", 3, "snake", ["programmation"], "Apprendre à programmer en Python, un langage simple et polyvalent."),
    mod("modules-et-packages", "Modules et packages", null, 1, "tree", ["programmation"], "Organiser un projet Python et gérer ses dépendances.", { level: "Intermédiaire" }),
    mod("poo", "POO", "poo", 3, "instances", ["programmation"], "Penser un programme Python en objets, de la classe à l’héritage."),
    mod("machine-learning", "Machine learning", "machine-learning", 2, "fit", ["programmation"], "Apprendre à un programme à faire des prédictions à partir de données réelles."),
    mod("django", "Django", "django", 3, "form", ["programmation", "developpement-web"], "Développer une application web complète avec un framework Python.", { framework: true, draft: true }),
  ] },
  { slug: "html", title: "HTML", modules: [mod("fondamentaux", "HTML", "html", 1, "markup", ["developpement-web"], "Écrire des pages web bien structurées, lisibles par tous.")] },
  { slug: "css", title: "CSS", scene: "layout", modules: [
    mod("fondamentaux", "Fondamentaux", "css", 2, "layout", ["developpement-web"], "Mettre en forme une page et l’adapter à tous les écrans."),
    mod("tailwind", "Tailwind", null, 2, "layout", ["developpement-web"], "Mettre en forme une page avec des classes utilitaires.", { framework: true, draft: true }),
  ] },
  { slug: "javascript", title: "JavaScript", scene: "event", summary: `Le langage du web, de ses bases à l’interactivité d’une page, sans quitter le HTML avec Alpine.`, modules: [
    mod("fondamentaux", "Fondamentaux", "javascript", 3, "event", ["programmation", "developpement-web"], "Apprendre le langage du web, des bases à la transformation des données."),
    mod("vue", "Vue", "vue", 2, "tree", ["developpement-web"], "Construire une interface réactive à partir de composants.", { framework: true, draft: true }),
    mod("alpine", "Alpine", "alpine", 1, "peaks", ["developpement-web"], "Ajouter de l’interactivité à une page, sans quitter le HTML.", { framework: true }),
  ] },
  { slug: "php", title: "PHP", scene: "server", summary: "Le langage serveur du web, de ses bases à une application complète avec Laravel.", modules: [
    mod("fondamentaux", "Fondamentaux", "php", 3, "server", ["programmation", "developpement-web"], "Apprendre les bases du langage serveur du web, du formulaire à la page dynamique."),
    mod("poo", "POO", "poo", 3, "instances", ["programmation", "developpement-web"], "Penser un programme PHP en objets, de la classe aux interfaces."),
    mod("laravel", "Laravel", "laravel", 4, "mvc", ["developpement-web"], "Développer une application web complète avec un framework PHP.", { framework: true }),
  ] },
  { slug: "merise", title: "Merise", modules: [mod("fondamentaux", "Merise", "merise", 2, "entities", ["bases-de-donnees"], "Modéliser les données d’un projet avant de créer la base.")] },
  { slug: "mysql", title: "MySQL", modules: [mod("fondamentaux", "MySQL", "mysql", 3, "table", ["bases-de-donnees"], "Créer une base de données et l’interroger avec le langage SQL.")] },
  { slug: "postgresql", title: "PostgreSQL", modules: [mod("fondamentaux", "PostgreSQL", "postgresql", 3, "join", ["bases-de-donnees"], "Apprendre SQL avec une base de données robuste et complète.", { draft: true })] },
  { slug: "uml", title: "UML", modules: [mod("fondamentaux", "UML", "uml", 2, "classes", ["conception-logicielle"], "Représenter un logiciel en diagrammes pour mieux le concevoir.")] },
  { slug: "principes-solid", title: "Principes SOLID", modules: [mod("fondamentaux", "Principes SOLID", "principes-solid", 2, "solid", ["conception-logicielle"], "Organiser son code objet pour qu’il reste simple à faire évoluer.")] },
  { slug: "design-patterns", title: "Design patterns", modules: [mod("fondamentaux", "Design patterns", "design-patterns", 2, "observer", ["conception-logicielle"], "Reconnaître et appliquer des solutions éprouvées aux problèmes courants.")] },
  { slug: "git-github", title: "Git / GitHub", modules: [mod("fondamentaux", "Git / GitHub", "git-github", 2, "branch", ["methodologie-et-tests", "gestion-de-projet"], "Versionner son code et travailler à plusieurs sur un projet.")] },
  { slug: "cypress", title: "Cypress", modules: [mod("fondamentaux", "Cypress", "cypress", 2, "checks", ["methodologie-et-tests"], "Tester une application comme le ferait un utilisateur.")] },
  { slug: "ci-cd", title: "CI / CD", modules: [mod("fondamentaux", "CI / CD", "ci-cd", 2, "pipeline", ["methodologie-et-tests"], "Vérifier et mettre en ligne automatiquement chaque modification.")] },
  { slug: "agilite", title: "Agilité", modules: [mod("scrum", "Scrum", "methode-agile", 2, "sprint", ["gestion-de-projet"], "Découvrir l’agilité en menant un projet fil rouge avec Scrum.")] },
];
FORMATIONS.forEach(formation => formation.modules.forEach(module => { module.formation = formation; }));
const published = formation => formation.modules.filter(module => !module.draft);

// The domains, in the order of specs.md; ghost is the single word behind the title of a module
// alone in its formation (branding: a faded word is always one word). Sample summaries for the
// renamed domains.
const OFFER_DOMAINS = [
  { slug: "ia-generative", title: "IA générative", ghost: "IA", scene: "network", isNew: true, summary: "Utiliser l’IA générative avec méthode et rigueur, au quotidien.", formations: ["claude-code", "prompt-engineering"] },
  { slug: "programmation", title: "Programmation", ghost: "Programmation", scene: "steps", summary: `Apprendre à programmer${NB}: la logique, puis les langages, de la console au web.`, formations: ["algorithmique", "python", "javascript", "php"] },
  { slug: "developpement-web", title: "Développement web", ghost: "Web", scene: "web", summary: `Du HTML aux frameworks${NB}: construire des sites et des applications web.`, formations: ["html", "css", "javascript", "php", "python"] },
  { slug: "bases-de-donnees", title: "Bases de données", ghost: "Donnees", scene: "database", summary: "Modéliser, concevoir et interroger des données.", formations: ["merise", "mysql", "postgresql"] },
  { slug: "conception-logicielle", title: "Conception logicielle", ghost: "Conception", scene: "blueprint", summary: "Penser l’architecture d’un logiciel avant de l’écrire.", formations: ["uml", "principes-solid", "design-patterns"] },
  { slug: "methodologie-et-tests", title: "Méthodologie et tests", ghost: "Methode", scene: "branch", summary: "Versionner, tester et livrer avec méthode.", formations: ["git-github", "cypress", "ci-cd"] },
  { slug: "gestion-de-projet", title: "Gestion de projet", ghost: "Projet", scene: "board", summary: "S’initier à l’agilité avec Scrum.", formations: ["agilite", "git-github"] },
];
const formationOf = slug => FORMATIONS.find(formation => formation.slug === slug);
const domainOf = slug => OFFER_DOMAINS.find(domain => domain.slug === slug);
// The published modules of a formation filed under a domain; a formation without any is left out.
const modulesIn = (formation, domain) => published(formation).filter(module => module.domains.includes(domain.slug));
const formationsIn = domain => domain.formations.map(formationOf).filter(formation => modulesIn(formation, domain).length);
const isNewModule = module => module.domains.some(slug => domainOf(slug).isNew);

// The addresses of the mock-up: a module by its key, ?module=<formation>-<module>, or the slug of
// its formation alone when it is its only published module.
const isSingle = formation => published(formation).length === 1;
const moduleKey = module => isSingle(module.formation) ? module.formation.slug : `${module.formation.slug}-${module.slug}`;
const moduleHref = module => `${FORMATIONS_PAGES.module}?${new URLSearchParams({ module: moduleKey(module) })}`;
const formationHref = formation => isSingle(formation) ? moduleHref(published(formation)[0]) : `${FORMATIONS_PAGES.formation}?${new URLSearchParams({ formation: formation.slug })}`;
const domainHref = domain => `${FORMATIONS_PAGES.domain}?${new URLSearchParams({ domain: domain.slug })}`;
const allModules = FORMATIONS.flatMap(published);
// The former links of the mock-up (?module=javascript) lead to the first module of the formation.
const moduleByKey = key => allModules.find(module => moduleKey(module) === key) || (formationOf(key) && published(formationOf(key))[0]);

// ── The framework mark ──────────────────────────────────────────────────────────────
// Chosen by the owner on 2026-10-30: « Framework » in small white capitals on a rectangle of the
// background of the site, 2 px smaller than « Nouveau »: in the top left corner of the cover of a
// module card, across the top edge of a card of the path of a formation, after the name in a list.
// Under the title of a module page, a badge in orange instead, as « Nouveau » (asked by the owner).
const frameworkMark = (where = "") => `<span class="app-fw${where ? ` is-${where}` : ""}">Framework</span>`;

// ── Cards ─────────────────────────────────────────────────────────────────────────────

// A module card: its name and its summary; a framework carries its mark on its cover. Used for
// a formation of a single module (named after it) and for the neighbors of a module.
const offerModuleCard = module => `
  <li class="app-card app-glass app-reveal app-tilt">
    <div class="app-cover" data-scene="${module.scene}" aria-hidden="true"><canvas></canvas>${isNewModule(module) || module.framework ? `<span class="app-cover-labels">${isNewModule(module) ? '<span class="app-new">Nouveau</span>' : ""}${module.framework ? frameworkMark() : ""}</span>` : ""}</div>
    <h3>${isSingle(module.formation) ? module.formation.title : module.title}</h3>
    <p>${module.summary}</p>
    <a class="app-card-more" href="${moduleHref(module)}" aria-label="${module.title}${NB}: voir le détail">Voir le détail</a>
  </li>`;

// A formation card: its modules filed under the domain, each a link to its module, and the band to
// the page of the formation; no count of its modules (dropped by the owner on 2026-10-30).
function formationCard(formation, domain) {
  const modules = modulesIn(formation, domain);
  const list = `<ul class="app-fcard-list">${modules.map(module => `
      <li><a href="${moduleHref(module)}"><span>${module.title}</span>${module.framework ? frameworkMark() : ""}</a></li>`).join("")}
    </ul>`;
  const face = `<h3>${formation.title}</h3>`;
  return `
  <li class="app-card app-glass app-reveal app-tilt app-fcard">
    <div class="app-cover" data-scene="${formation.scene}" aria-hidden="true"><canvas></canvas>${domain.isNew ? '<span class="app-new">Nouveau</span>' : ""}</div>
    ${face}${list}
    <a class="app-card-more" href="${formationHref(formation)}" aria-label="Formation ${formation.title}${NB}: voir la formation">Voir la formation</a>
  </li>`;
}

// The card of a formation in a domain: a module card when it has a single published module, a
// formation card otherwise (even when only one of its modules is filed under this domain).
const offerCard = (formation, domain) => isSingle(formation) ? offerModuleCard(published(formation)[0]) : formationCard(formation, domain);

// A domain card, as built on the site: its formations as tags at the bottom, the band « Voir les
// modules » to its page. Still in the mock-up (the slide of the built site is not copied here).
const offerDomainCard = domain => `
  <li class="app-card app-glass app-reveal app-tilt app-dcard">
    <div class="app-cover" data-scene="${domain.scene}" aria-hidden="true"><canvas></canvas>${domain.isNew ? '<span class="app-new">Nouveau</span>' : ""}</div>
    <h3>${domain.title}</h3><p>${domain.summary}</p>
    <p class="app-dcard-tags">${formationsIn(domain).map(formation => `#${unaccented(formation.title).toLowerCase().replace(/\s*\/\s*|\s+/g, "-")}`).join(" ")}</p>
    <a class="app-card-more" href="${domainHref(domain)}" aria-label="${domain.title}${NB}: voir les modules">Voir les modules</a>
  </li>`;

// The hero of a module, domain or formation page, as built on the site: the « Nouveau » label, a
// line above the title (the domains of a formation), the title over its faded word, a line under
// it (the framework badge of a module, over the faded word), the lead.
const offerHero = ({ id, title, ghost, above = "", under = "", lead, after = "", isNew = false, note = "" }) => `
  <section class="app-offer-hero" aria-labelledby="${id}" data-grid>
    <div class="app-wrap">
      ${isNew ? '<p class="app-offer-new app-reveal"><span class="app-new">Nouveau</span></p>' : ""}
      ${above ? `<div class="app-offer-above app-reveal">${above}</div>` : ""}
      <div class="app-offer-heading">
        ${ghost ? `<span class="app-offer-ghost" aria-hidden="true">${unaccented(ghost)}</span>` : ""}
        <div class="app-offer-titles"><h1 class="app-offer-title app-reveal" id="${id}">${title}</h1>${under}</div>
      </div>
      <div class="app-offer-lead app-reveal">${lead}</div>
      ${note ? `<p class="app-offer-note app-note app-reveal">${note}</p>` : ""}
      ${after}
    </div>
  </section>`;
const NEW_NOTE = `Une offre nouvelle, centrée sur la méthode et les bonnes pratiques${NB}: utiliser les outils d’IA pour être plus efficace et plus serein au quotidien.`;

// ── The left edge of the large titles ────────────────────────────────────────────────
// A letter carries a margin on its left, its side bearing, which spaces it from the letter before
// and grows with the size of the text: the D of « Développement web » started 6 px right of the
// edge at 92 px. Chosen by the owner on 2026-10-30 (optical alignment): each large title and each
// faded word moves left by the side bearing of its first letter, in em so that it holds at every
// size, and a round letter a little further, as typographers do, so that it looks aligned with a
// straight one. The side bearings of Manrope 800, read from the font file served by the site
// (xMin / unitsPerEm). The built site sets --bearing at build time; the mock-up does it here.
const SIDE_BEARINGS = { A: 0.02, B: 0.07, C: 0.03, D: 0.07, E: 0.07, F: 0.07, G: 0.03, H: 0.07, I: 0.08, J: 0, K: 0.07, L: 0.08, M: 0.07, N: 0.07, O: 0.03, P: 0.07, Q: 0.03, R: 0.07, S: 0.04, T: 0.01, U: 0.07, V: 0.005, W: 0.01, X: 0.01, Y: 0, Z: 0.05 };
const ROUND_OVERSHOOT = { C: 0.01, G: 0.01, O: 0.01, Q: 0.01, S: 0.01 };
const bearingOf = text => {
  const letter = unaccented(text.trim()).charAt(0).toUpperCase();
  return (SIDE_BEARINGS[letter] || 0) + (ROUND_OVERSHOOT[letter] || 0);
};
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".app-offer-title, .app-heading-title, .app-offer-ghost, .app-heading-ghost").forEach(element => {
    element.style.setProperty("--bearing", `${bearingOf(element.textContent)}em`);
  });
});

// The width of each large title in em, in Manrope 800 with the tracking of the titles, so that its
// size fits the width of the page (shared/formations.css, --title-em). Measured once the fonts are
// there; the site computes it at build time from the font file, as the side bearings.
document.fonts.ready.then(() => {
  const context = document.createElement("canvas").getContext("2d");
  context.font = `800 100px Manrope`;
  document.querySelectorAll(".app-offer-heading").forEach(heading => {
    const text = heading.querySelector(".app-offer-title").textContent.trim();
    const width = context.measureText(text).width / 100 - 0.045 * text.length;
    heading.style.setProperty("--title-em", (width + 0.04).toFixed(3));
    // The faded word, in capitals, without accents, with the tracking of the faded words.
    const ghost = heading.querySelector(".app-offer-ghost");
    if (ghost) {
      const word = unaccented(ghost.textContent.trim()).toUpperCase();
      heading.style.setProperty("--ghost-em", (context.measureText(word).width / 100 - 0.06 * word.length + 0.12).toFixed(3));
    }
  });
});
