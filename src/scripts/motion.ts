// The animations shared by every page (from docs/mockups/shared/motion.js), run after the
// content: reveals on scroll, section headings, the faded word of the call to action, the rules
// of the pedagogy and of the program of a module, the key figures and the magnetic buttons.
// Nothing moves when the visitor asked to reduce motion.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const root = document.documentElement;

if (root.dataset.motion === "on") {
  // Tells the base layout that the elements hidden for their reveal will show.
  root.dataset.motionStarted = "true";
  gsap.registerPlugin(ScrollTrigger, SplitText);

  // Reveals on scroll, in small batches.
  ScrollTrigger.batch(".reveal", {
    start: "top 88%",
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        duration: 1,
        ease: "power3.out",
        overwrite: true,
      }),
  });

  // Section headings, as on the former site: the title rises, the large word behind it slides
  // as the page scrolls.
  document.querySelectorAll(".heading").forEach((block) => {
    const title = block.querySelector(".heading-title");
    if (!title) return;
    // SplitText names the title after its visible text; a title shown without its accents
    // keeps its real name.
    const label = title.getAttribute("aria-label");
    SplitText.create(title, {
      type: "words",
      mask: "words",
      onSplit: (self) =>
        gsap.from(self.words, {
          yPercent: 100,
          stagger: 0.05,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: block, start: "top 86%" },
        }),
    });
    if (label) title.setAttribute("aria-label", label);
    const ghost = block.querySelector(".heading-ghost");
    if (!ghost) return;
    gsap.fromTo(
      ghost,
      { xPercent: 6 },
      {
        xPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: block,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  // The large faded word of the call to action slides the same way.
  document.querySelectorAll(".cta").forEach((band) => {
    const ghost = band.querySelector(".cta-ghost");
    if (!ghost) return;
    gsap.fromTo(
      ghost,
      { xPercent: 8 },
      {
        xPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: band,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });

  // The rules of the pedagogy draw themselves as the steps scroll, one after the other.
  document.querySelectorAll(".steps").forEach((steps) => {
    steps.querySelectorAll(".step-rule").forEach((rule, index) => {
      gsap.fromTo(
        rule,
        { "--progress": 0 },
        {
          "--progress": 1,
          ease: "none",
          scrollTrigger: {
            trigger: steps,
            start: `top ${80 - index * 6}%`,
            end: `top ${40 - index * 6}%`,
            scrub: true,
          },
        },
      );
    });
  });

  // A rule marked data-draw (the parts of the program of a module) draws itself as it scrolls
  // into view.
  document.querySelectorAll("[data-draw]").forEach((part) => {
    gsap.fromTo(
      part,
      { "--progress": 0 },
      {
        "--progress": 1,
        ease: "none",
        scrollTrigger: {
          trigger: part,
          start: "top 92%",
          end: "top 62%",
          scrub: true,
        },
      },
    );
  });

  // The key figures count up, from data-from (or 0) to data-to.
  document.querySelectorAll<HTMLElement>(".count").forEach((counter) => {
    const value = { n: Number(counter.dataset.from ?? 0) };
    gsap.to(value, {
      n: Number(counter.dataset.to),
      duration: 2,
      ease: "power2.out",
      scrollTrigger: { trigger: counter, start: "top 92%" },
      onUpdate: () => {
        counter.textContent = String(Math.round(value.n));
      },
    });
  });

  // Pointer devices: the main buttons are magnetic.
  if (matchMedia("(hover: hover)").matches) {
    document.querySelectorAll<HTMLElement>(".magnetic").forEach((button) => {
      const moveX = gsap.quickTo(button, "x", {
        duration: 0.5,
        ease: "power3",
      });
      const moveY = gsap.quickTo(button, "y", {
        duration: 0.5,
        ease: "power3",
      });
      button.addEventListener("pointermove", (event) => {
        const box = button.getBoundingClientRect();
        moveX((event.clientX - box.left - box.width / 2) * 0.3);
        moveY((event.clientY - box.top - box.height / 2) * 0.4);
      });
      button.addEventListener("pointerleave", () => {
        moveX(0);
        moveY(0);
      });
    });
  }
}
