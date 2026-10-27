// The parts shared by every page of the mock-up, loaded at the start of <body>, before the
// script of the page: the brand, the icons and the helpers the pages use to build their content,
// then the header, the mobile menu and the back-to-top button, and their behavior. A page sets
// data-page on <body> (home, contact) to mark its link in the navigation.

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
};
const icon = (name, size = 22) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;

// Section heading, after the former site: a title over a large faded word.
const heading = (title, ghost, id, level = 2) => `
  <div class="app-heading">
    <span class="app-heading-ghost" aria-hidden="true">${ghost}</span>
    <h${level} class="app-heading-title" id="${id}">${title}</h${level}>
  </div>`;

// The pages of the mock-up, and the links of the navigation.
const PAGES = { home: "home-site.html", contact: "contact-site.html" };
const NAVIGATION = [["Formations", `${PAGES.home}#formations`, "courses"], ["Articles", "#", "articles"], ["À propos", "#", "about"], ["Contact", PAGES.contact, "contact"]];
const currentPage = document.body.dataset.page;
const current = page => page === currentPage ? ' aria-current="page"' : "";

// The call to action and the footer, which a page places at its end.
const siteCta = () => `
  <section class="app-cta" aria-labelledby="cta-title">
    <span class="app-cta-ghost" aria-hidden="true">Échanger</span>
    <div class="app-wrap">
      <h2 class="app-reveal" id="cta-title">Un module à confier${NB}?<br>Parlons de vos apprenants.</h2>
      <a class="app-button app-magnetic app-reveal" href="${PAGES.contact}">Me contacter</a>
    </div>
  </section>`;
const siteFooter = () => `
  <footer class="app-footer">
    <div class="app-footer-logo" role="img" aria-label="Sylent">${WORDMARK}</div>
    <div class="app-wrap">
      <div class="app-footer-grid">
        <div><p class="app-motto">Une vie, mille leçons</p><p>Formateur en informatique, sur site ou à distance.</p></div>
        <div><h2>Navigation</h2><ul>${NAVIGATION.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul></div>
        <div><h2>Contact</h2><ul><li><a href="mailto:aunim.hassan@gmail.com">aunim.hassan@gmail.com</a></li><li><a href="tel:+33613449424">06${NB}13${NB}44${NB}94${NB}24</a></li><li><a href="https://www.linkedin.com/in/aunimhsn/">linkedin.com/in/aunimhsn</a></li><li><a href="https://github.com/aunimhsn">github.com/aunimhsn</a></li></ul></div>
        <div><h2>Informations</h2><ul><li><a href="#">Mentions légales</a></li><li><a href="#">Confidentialité</a></li><li>NDA${NB}: à fournir</li></ul></div>
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
      <nav class="app-nav" aria-label="Navigation principale">${NAVIGATION.map(([label, href, page]) => `<a href="${href}"${current(page)}>${label}</a>`).join("")}</nav>
      <a class="app-button app-magnetic" href="${PAGES.contact}">Me contacter</a>
      <button class="app-burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu" id="burger">${icon("menu", 24)}</button>
    </div>
  </header>
  <div class="app-menu" id="menu" aria-hidden="true">
    ${NAVIGATION.map(([label, href, page]) => `<a class="app-menu-link" href="${href}"${current(page)}>${label}</a>`).join("")}
    <a class="app-button" href="${PAGES.contact}">Me contacter</a>
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

// The reveals start hidden; if the animations don't start (a library that doesn't load), show
// everything.
document.documentElement.classList.add("is-js");
setTimeout(() => { if (!window.sylentMotion) document.documentElement.classList.remove("is-js"); }, 4000);
