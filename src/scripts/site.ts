// The behavior shared by every page (from docs/mockups/shared/site.js): the header that hides
// while scrolling down, the mobile menu, the back-to-top button, the contact links and the
// orange fluid of the grids. The texts it shows come from the page (data attributes), so that
// they stay in src/i18n/fr.json.
import { gsap } from "gsap";

const reduced = document.documentElement.dataset.motion === "off";
const byId = (id: string) => document.getElementById(id) as HTMLElement;

// ── Header: solid once the page scrolls, hidden while scrolling down ─────────────────────
const header = byId("header");
let lastScroll = 0;
addEventListener(
  "scroll",
  () => {
    const y = scrollY;
    header.classList.toggle("is-scrolled", y > 20);
    if (!header.classList.contains("is-menu")) {
      header.classList.toggle("is-hidden", y > 400 && y > lastScroll);
    }
    lastScroll = y;
  },
  { passive: true },
);

// ── Mobile menu ───────────────────────────────────────────────────────────────────────
const menu = byId("menu");
const burger = byId("burger");
function toggleMenu(open = !menu.classList.contains("is-open")) {
  menu.classList.toggle("is-open", open);
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

// ── Back to the top: shown once the first screen is passed; the focus goes back to the logo,
// for the keyboard ─────────────────────────────────────────────────────────────────────
const backToTop = byId("back-to-top");
addEventListener(
  "scroll",
  () => backToTop.classList.toggle("is-visible", scrollY > innerHeight * 0.8),
  { passive: true },
);
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

// ── The orange fluid of the grids ─────────────────────────────────────────────────────
// Under the pointer, an orange fluid runs along the lines of a grid. Each crossing holds some
// energy: the pointer pours energy into the crossings around it as it moves, the energy spreads
// to the neighbor crossings and fades, and each line glows with the energy of its two ends. The
// fluid is drawn in a layer (.fluid) that the host of the grid places over it, with the same
// mask. A host marks itself with data-fluid, set to the token of its cell size.
function gridFluid(host: HTMLElement, cell: number) {
  const layer = document.createElement("div");
  layer.className = "fluid";
  layer.setAttribute("aria-hidden", "true");
  const canvas = document.createElement("canvas");
  layer.append(canvas);
  host.prepend(layer);
  const context = canvas.getContext("2d");
  if (!context) return;
  const signal = getComputedStyle(document.documentElement)
    .getPropertyValue("--signal")
    .trim();
  const [red, green, blue] = [1, 3, 5].map((index) =>
    parseInt(signal.slice(index, index + 2), 16),
  );
  let columns = 0;
  let rows = 0;
  let energy = new Float32Array(0);
  let next = new Float32Array(0);
  let width = 0;
  let height = 0;
  let running = false;
  let seen = false;
  let pointer: { x: number; y: number } | null = null;

  function resize() {
    const ratio = Math.min(devicePixelRatio, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context!.setTransform(ratio, 0, 0, ratio, 0, 0);
    columns = Math.ceil(width / cell) + 1;
    rows = Math.ceil(height / cell) + 1;
    energy = new Float32Array(columns * rows);
    next = new Float32Array(columns * rows);
  }
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(([entry]) => {
    seen = entry.isIntersecting;
  }).observe(canvas);

  // Pour energy into the crossings within 1.6 cells of the pointer, more as it moves faster. The
  // pointer is followed over the whole page, since the layer of a page top lies under its content.
  addEventListener("pointermove", (event) => {
    const box = canvas.getBoundingClientRect();
    const x = event.clientX - box.left;
    const y = event.clientY - box.top;
    if (x < 0 || y < 0 || x > box.width || y > box.height) {
      pointer = null;
      return;
    }
    const moved = pointer ? Math.hypot(x - pointer.x, y - pointer.y) : 0;
    pointer = { x, y };
    const amount = Math.min(0.9, 0.12 + moved / 60);
    const reach = cell * 1.6;
    const lastRow = Math.min(rows - 1, Math.ceil((y + reach) / cell));
    const lastColumn = Math.min(columns - 1, Math.ceil((x + reach) / cell));
    for (
      let row = Math.max(0, Math.floor((y - reach) / cell));
      row <= lastRow;
      row++
    ) {
      for (
        let column = Math.max(0, Math.floor((x - reach) / cell));
        column <= lastColumn;
        column++
      ) {
        const distance = Math.hypot(column * cell - x, row * cell - y);
        if (distance < reach) {
          const index = row * columns + column;
          energy[index] = Math.min(
            1,
            energy[index] + amount * (1 - distance / reach),
          );
        }
      }
    }
    if (!running) {
      running = true;
      requestAnimationFrame(step);
    }
  });
  document.documentElement.addEventListener("pointerleave", () => {
    pointer = null;
  });

  function line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    a: number,
    b: number,
  ) {
    if (a + b < 0.02) return;
    const gradient = context!.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(
      0,
      `rgb(${red} ${green} ${blue} / ${Math.min(1, a * 1.3)})`,
    );
    gradient.addColorStop(
      1,
      `rgb(${red} ${green} ${blue} / ${Math.min(1, b * 1.3)})`,
    );
    context!.strokeStyle = gradient;
    context!.beginPath();
    context!.moveTo(x1, y1);
    context!.lineTo(x2, y2);
    context!.stroke();
  }

  function step() {
    // Spread: each crossing moves toward the mean of its neighbors, then fades a little.
    let total = 0;
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const index = row * columns + column;
        let sum = 0;
        let count = 0;
        if (column > 0) {
          sum += energy[index - 1];
          count++;
        }
        if (column < columns - 1) {
          sum += energy[index + 1];
          count++;
        }
        if (row > 0) {
          sum += energy[index - columns];
          count++;
        }
        if (row < rows - 1) {
          sum += energy[index + columns];
          count++;
        }
        const value =
          (energy[index] + (sum / count - energy[index]) * 0.42) * 0.968;
        next[index] = value < 0.004 ? 0 : value;
        total += next[index];
      }
    }
    [energy, next] = [next, energy];

    if (seen) {
      context!.clearRect(0, 0, width, height);
      // A soft wide stroke for the glow, then the thin line itself.
      for (const [lineWidth, alpha] of [
        [4, 0.22],
        [1, 1],
      ]) {
        context!.lineWidth = lineWidth;
        context!.globalAlpha = alpha;
        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columns; column++) {
            const index = row * columns + column;
            const x = column * cell + 0.5;
            const y = row * cell + 0.5;
            if (column < columns - 1) {
              line(x, y, x + cell, y, energy[index], energy[index + 1]);
            }
            if (row < rows - 1) {
              line(x, y, x, y + cell, energy[index], energy[index + columns]);
            }
          }
        }
      }
      context!.globalAlpha = 1;
    }
    // Stop once the fluid is gone: energy only comes with pointermove, which starts the loop again.
    if (total > 0.01) requestAnimationFrame(step);
    else {
      running = false;
      context!.clearRect(0, 0, width, height);
    }
  }
}

if (!reduced) {
  const styles = getComputedStyle(document.documentElement);
  document.querySelectorAll<HTMLElement>("[data-fluid]").forEach((host) => {
    const cell = parseFloat(styles.getPropertyValue(host.dataset.fluid ?? ""));
    if (cell > 0) gridFluid(host, cell);
  });
}
