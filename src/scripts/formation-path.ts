// The path of a formation page (from docs/mockups/shared/paths.js): its modules in the advised
// order, along a rail that lies over the right of their cards and runs a little past the first and
// the last. The rail fills with orange as the page scrolls, and the square of a module lights up
// when the orange reaches it: the orange says how far the reader has gone (docs/branding.md,
// Components). No rail on a phone; without motion, the rail is full and every square lit.
const list = document.querySelector<HTMLElement>("[data-path]");

if (list) {
  const steps = [...list.querySelectorAll<HTMLElement>("[data-step]")];
  const phone = matchMedia("(width < 640px)");
  const motion = document.documentElement.dataset.motion === "on";
  const clamp = (x: number) => Math.min(1, Math.max(0, x));
  // The reader is where the orange reaches: a line at 60 % of the height of the window.
  const mark = 0.6;

  // The ends of the rail in the space of the list, the share of it that the orange fills, and
  // the squares it reached, at the center of each one.
  const draw = () => {
    const box = list.getBoundingClientRect();
    const overhang =
      parseFloat(getComputedStyle(list).getPropertyValue("--overhang")) || 0;
    const top = -overhang;
    const bottom = box.height + overhang;
    const at = motion ? innerHeight * mark - box.top : Infinity;
    list.style.setProperty("--first", `${top}px`);
    list.style.setProperty("--length", `${bottom - top}px`);
    list.style.setProperty(
      "--progress",
      clamp((at - top) / (bottom - top)).toFixed(4),
    );
    for (const step of steps) {
      const node = step.querySelector(".step-node")!.getBoundingClientRect();
      const center = node.top + node.height / 2 - box.top;
      step.classList.toggle("is-reached", center <= at + 1);
    }
  };

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
}
