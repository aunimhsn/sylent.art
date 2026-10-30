// The path of a formation page (formation-site.html): its modules in the advised order, along a
// rail that lies over the right of their cards and runs a little past the first and the last
// (step 13b of roadmap.md). The rail fills with orange as the page scrolls, and the square of a
// module lights up when the orange reaches it: the orange says how far the reader has gone. No
// rail on a phone; nothing moves when the visitor asked to reduce motion.
const list = document.querySelector("[data-path]");
const steps = [...list.querySelectorAll("[data-step]")];
const phone = matchMedia("(max-width: 639px)");
const motion = document.documentElement.dataset.motion === "on";
const clamp = x => Math.min(1, Math.max(0, x));
// The reader is where the orange reaches: a line at 60 % of the height of the window.
const MARK = 0.6;

// The centers of the modules on the rail and the ends of the rail, in the space of the list, and
// how far the reader is.
function reading() {
  const box = list.getBoundingClientRect();
  const centers = steps.map(step => {
    const node = step.querySelector(".app-step-node").getBoundingClientRect();
    return node.top + node.height / 2 - box.top;
  });
  const overhang = parseFloat(getComputedStyle(list).getPropertyValue("--overhang")) || 0;
  const top = -overhang, bottom = box.height + overhang;
  const at = motion ? innerHeight * MARK - box.top : Infinity;
  const reached = centers.map(center => center <= at + 1);
  return { box, centers, overhang, top, bottom, at, progress: clamp((at - top) / (bottom - top)), reached };
}

// ── The rail: CSS, driven by the scroll ─────────────────────────────────────────────

function line() {
  const update = () => {
    const state = reading();
    list.style.setProperty("--first", `${state.top}px`);
    list.style.setProperty("--length", `${state.bottom - state.top}px`);
    list.style.setProperty("--progress", state.progress.toFixed(4));
    steps.forEach((step, index) => step.classList.toggle("is-reached", state.reached[index]));
  };
  return update;
}

// ── On scroll and resize ───────────────────────────────────────────────────────────

const draw = line();
let queued = false;
const request = () => {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    if (!phone.matches) draw();
  });
};
addEventListener("scroll", request, { passive: true });
addEventListener("resize", request);
new ResizeObserver(request).observe(list);
request();
