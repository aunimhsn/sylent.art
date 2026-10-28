// The animations shared by every page, loaded after GSAP and after the content of the page:
// reveals on scroll, section headings and magnetic buttons. Nothing moves when the visitor asked
// to reduce motion.
(() => {
  if (reduced || !window.gsap) return;
  window.sylentMotion = true;
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Reveals on scroll, in small batches.
  ScrollTrigger.batch(".app-reveal", {
    start: "top 88%",
    onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.08, duration: 1, ease: "power3.out", overwrite: true }),
  });

  // Section headings, as on the former site: the title rises, the large word behind it slides as
  // the page scrolls.
  document.querySelectorAll(".app-heading").forEach(block => {
    const title = block.querySelector(".app-heading-title");
    // SplitText names the title after its visible text; a title shown without its accents keeps
    // its real name.
    const label = title.getAttribute("aria-label");
    SplitText.create(title, { type: "words", mask: "words", onSplit: self => gsap.from(self.words, { yPercent: 100, stagger: 0.05, duration: 1, ease: "expo.out", scrollTrigger: { trigger: block, start: "top 86%" } }) });
    if (label) title.setAttribute("aria-label", label);
    gsap.fromTo(block.querySelector(".app-heading-ghost"), { xPercent: 6 }, { xPercent: -4, ease: "none", scrollTrigger: { trigger: block, start: "top bottom", end: "bottom top", scrub: true } });
  });
  gsap.utils.toArray(".app-cta").forEach(band => {
    gsap.fromTo(band.querySelector(".app-cta-ghost"), { xPercent: 8 }, { xPercent: -8, ease: "none", scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true } });
  });

  // Pointer devices: the main buttons are magnetic.
  if (matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".app-magnetic").forEach(button => {
      const moveX = gsap.quickTo(button, "x", { duration: 0.5, ease: "power3" });
      const moveY = gsap.quickTo(button, "y", { duration: 0.5, ease: "power3" });
      button.addEventListener("pointermove", event => {
        const box = button.getBoundingClientRect();
        moveX((event.clientX - box.left - box.width / 2) * 0.3);
        moveY((event.clientY - box.top - box.height / 2) * 0.4);
      });
      button.addEventListener("pointerleave", () => { moveX(0); moveY(0); });
    });
  }
})();
