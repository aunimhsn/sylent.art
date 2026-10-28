// The intro of the hero of the home page (from docs/mockups/home-site.html): the header comes
// down, the headline rises line by line from behind a mask, then the text, the buttons and the
// motto. Without motion, everything is shown at once.
//
// The elements of the intro (.intro) stay hidden until data-intro-started is set on <html>: here
// once the intro is ready, or by the hero itself after 4 s if this script doesn't start.
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

const root = document.documentElement;

if (root.dataset.motion === "on") {
  gsap.registerPlugin(SplitText);
  // The lines of the headline depend on its font.
  document.fonts.ready.then(intro);
} else {
  root.dataset.introStarted = "true";
}

function intro() {
  // Too late: the hero has already been shown by its fallback, don't play it again.
  if (root.dataset.introStarted) return;
  const header = document.getElementById("header");
  const split = SplitText.create(".hero-title", {
    type: "lines",
    mask: "lines",
  });
  gsap
    .timeline({ defaults: { ease: "expo.out", duration: 1.1 } })
    // The header has its own transition on transform, for when it hides: off during the intro,
    // and the header gets its transform back from its classes afterwards.
    .from(header, {
      yPercent: -100,
      duration: 0.9,
      onStart: () => header?.style.setProperty("transition", "none"),
      onComplete: () => header?.style.removeProperty("transition"),
      clearProps: "transform",
    })
    .from(split.lines, { yPercent: 110, stagger: 0.09, duration: 1.2 }, "-=0.5")
    .from(
      ".hero .intro:not(.hero-title)",
      { y: 28, autoAlpha: 0, stagger: 0.1 },
      "-=0.8",
    )
    // Back to plain text, which wraps again if the window is resized.
    .add(() => split.revert());
  // The starting state of the intro is set: the elements can leave their hidden state.
  root.dataset.introStarted = "true";
}
