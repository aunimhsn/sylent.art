// The behavior of the top of every page (from docs/mockups/shared/site.js): the header that hides
// while scrolling down, the mobile menu, the back-to-top button and the contact links. The texts it shows come from the page (data attributes), so that
// they stay in src/i18n/fr.json.
import { gsap } from "gsap";

const reduced = document.documentElement.dataset.motion === "off";
const byId = (id: string) => document.getElementById(id) as HTMLElement;

// ── Header: solid once the page scrolls, hidden while scrolling down ─────────────────────
// The back-to-top button shows once the first screen is passed. Both are set at load too, for a
// page opened at an anchor or reloaded halfway.
const header = byId("header");
const backToTop = byId("back-to-top");
let lastScroll = scrollY;
function onScroll() {
  const y = scrollY;
  header.classList.toggle("is-scrolled", y > 20);
  if (!header.classList.contains("is-menu")) {
    header.classList.toggle("is-hidden", y > 400 && y > lastScroll);
  }
  lastScroll = y;
  backToTop.classList.toggle("is-visible", y > innerHeight * 0.8);
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ── Mobile menu ───────────────────────────────────────────────────────────────────────
// While it is open, the rest of the page is out of reach of the keyboard and screen readers.
const menu = byId("menu");
const burger = byId("burger");
function toggleMenu(open = !menu.classList.contains("is-open")) {
  menu.classList.toggle("is-open", open);
  for (const element of document.body.children) {
    if (
      element !== header &&
      element !== menu &&
      element.tagName !== "SCRIPT"
    ) {
      (element as HTMLElement).inert = open;
    }
  }
  header.classList.toggle("is-menu", open);
  menu.setAttribute("aria-hidden", String(!open));
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute(
    "aria-label",
    (open ? burger.dataset.closeLabel : burger.dataset.openLabel) ?? "",
  );
  document.body.style.overflow = open ? "hidden" : "";
  if (open && !reduced) {
    gsap.fromTo(
      menu.querySelectorAll("a"),
      { y: 40, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.06,
        duration: 0.7,
        delay: 0.2,
        ease: "expo.out",
      },
    );
  }
}
burger.addEventListener("click", () => toggleMenu());
menu.addEventListener("click", (event) => {
  if ((event.target as Element).closest("a")) toggleMenu(false);
});
addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("is-open")) {
    toggleMenu(false);
    burger.focus();
  }
});
// The menu exists below 900 px only: a window widened past it closes the menu, whose button
// disappears.
matchMedia("(width >= 900px)").addEventListener("change", (event) => {
  if (event.matches && menu.classList.contains("is-open")) toggleMenu(false);
});

// ── Back to the top: the focus goes back to the logo, for the keyboard ──────────────────
backToTop.addEventListener("click", () => {
  scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  header.querySelector("a")?.focus({ preventScroll: true });
});

// ── Contact links ─────────────────────────────────────────────────────────────────────
// A click on an email address copies it, with a small orange « Copiée », since many visitors
// have no mail application set up on their computer; a screen reader hears it too. If the copy
// fails, the link opens the mail application, as it does without JavaScript.
const announcer = byId("announcer");

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

document.addEventListener("click", async (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>(
    'a[href^="mailto:"]',
  );
  if (!link) return;
  event.preventDefault();
  if (!(await copyText(link.href.replace("mailto:", "")))) {
    location.href = link.href;
    return;
  }
  const box = link.getBoundingClientRect();
  const badge = Object.assign(document.createElement("span"), {
    className: "copied",
    textContent: announcer.dataset.copied ?? "",
  });
  badge.setAttribute("aria-hidden", "true");
  Object.assign(badge.style, {
    left: `${box.left + box.width / 2 + scrollX}px`,
    top: `${box.top + scrollY - 22}px`,
  });
  badge.addEventListener("animationend", () => badge.remove());
  document.body.append(badge);
  announcer.textContent = "";
  announcer.textContent = announcer.dataset.announce ?? "";
});

// A phone number is a link only on touch screens, where it opens the phone application;
// elsewhere it leaves the keyboard path (and the pointer, in global.css).
if (!matchMedia("(pointer: coarse)").matches) {
  document
    .querySelectorAll<HTMLAnchorElement>('a[href^="tel:"]')
    .forEach((link) => {
      link.tabIndex = -1;
    });
}
