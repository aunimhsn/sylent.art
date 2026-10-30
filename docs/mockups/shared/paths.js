// The path of a formation page (formation-site.html): its modules in the advised order, along a
// rail that lies over the right of their cards and runs a little past the first and the last
// (step 13b of roadmap.md). Two looks, chosen with ?path=:
// - line: the rail fills with orange as the page scrolls, and the square of a module lights up
//   when the orange reaches it;
// - thread: two strands of light twisted around the rail (Three.js), which cross at each module,
//   with a point of light that runs down to where the reader is and leaves an orange trail.
// The orange means how far the reader has gone. No rail on a phone; nothing moves when the
// visitor asked to reduce motion.
import * as THREE from "three";

const list = document.querySelector("[data-path]");
const steps = [...list.querySelectorAll("[data-step]")];
const look = list.classList.contains("is-thread") ? "thread" : "line";
const phone = matchMedia("(max-width: 639px)");
const motion = document.documentElement.dataset.motion === "on";
const clamp = x => Math.min(1, Math.max(0, x));
const SIGNAL = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--signal").trim() || "#d3450e");
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

// ── Line: CSS only, driven by the scroll ─────────────────────────────────────────────

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

// ── Thread: two strands around the rail ──────────────────────────────────────────────

function thread() {
  const canvas = document.createElement("canvas");
  canvas.className = "app-path-canvas";
  canvas.setAttribute("aria-hidden", "true");
  list.prepend(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  // One unit is one CSS pixel, y pointing down as on the page.
  const camera = new THREE.OrthographicCamera(0, 1, 0, -1, -100, 100);

  // A strand is a polyline with a color per point: brighter in front, orange once reached.
  const PER_GAP = 48;
  const gaps = steps.length - 1;
  const total = (gaps + 2) * PER_GAP + 1;
  const strand = () => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(total * 3), 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(total * 3), 3));
    const object = new THREE.Line(geometry, new THREE.LineBasicMaterial({ vertexColors: true }));
    scene.add(object);
    return object;
  };
  const strands = [strand(), strand()];
  // The rungs between the strands, three per gap, faint.
  const RUNGS = 3;
  const rungGeometry = new THREE.BufferGeometry();
  rungGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(gaps * RUNGS * 6), 3));
  rungGeometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(gaps * RUNGS * 6), 3));
  scene.add(new THREE.LineSegments(rungGeometry, new THREE.LineBasicMaterial({ vertexColors: true })));
  // A knot per module: a small octahedron in lines that turns, and flares when reached.
  const knots = steps.map(() => {
    const knot = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(7)), new THREE.LineBasicMaterial({ color: 0xffffff }));
    knot.userData.reachedAt = -1;
    scene.add(knot);
    return knot;
  });
  // The runner and its trail.
  const trail = Array.from({ length: 14 }, (_, k) => {
    const dot = new THREE.Mesh(new THREE.CircleGeometry(k ? 2.6 * (1 - k / 18) : 3.6, 20), new THREE.MeshBasicMaterial({ color: k ? SIGNAL : 0xffffff, transparent: true, opacity: k ? 0.7 * (1 - k / 14) : 1 }));
    dot.position.z = -k * 0.01;
    scene.add(dot);
    return dot;
  });
  const history = [];
  const glow = new THREE.Mesh(new THREE.CircleGeometry(12, 32), new THREE.MeshBasicMaterial({ color: SIGNAL, transparent: true, opacity: 0.18 }));
  scene.add(glow);

  const color = new THREE.Color(), gray = new THREE.Color();
  let width = 0, height = 0;
  const clock = new THREE.Clock();

  return () => {
    const state = reading();
    const time = motion ? clock.getElapsedTime() : 0;
    if (canvas.clientWidth !== width || canvas.clientHeight !== height) {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      renderer.setSize(width, height, false);
    }
    // The canvas starts at the top of the rail, above the list.
    Object.assign(camera, { right: width, top: state.overhang, bottom: state.overhang - height });
    camera.updateProjectionMatrix();
    const { centers } = state;
    const center = width / 2, amplitude = width * 0.36;
    // The page y of a position p along the modules (integer p: a module), and back.
    const yOf = p => {
      if (p <= 0) return centers[0] + p * (centers[1] - centers[0]);
      if (p >= gaps) return centers[gaps] + (p - gaps) * (centers[gaps] - centers[gaps - 1]);
      const k = Math.floor(p);
      return centers[k] + (p - k) * (centers[k + 1] - centers[k]);
    };
    const pOf = y => {
      if (y < centers[0]) return (y - centers[0]) / (centers[1] - centers[0]);
      for (let k = 0; k < gaps; k++) if (y <= centers[k + 1]) return k + (y - centers[k]) / (centers[k + 1] - centers[k]);
      return gaps + (y - centers[gaps]) / (centers[gaps] - centers[gaps - 1]);
    };
    // The strands run from one end of the rail to the other, fading out at both ends.
    const start = pOf(state.top), end = pOf(state.bottom);
    // Half a turn between two modules, so that the strands cross on each one; the amplitude
    // breathes, which keeps the crossings in place.
    const xOf = (p, side) => center + amplitude * (0.86 + 0.14 * Math.sin(time * 1.3 + p * 2.1)) * Math.sin(Math.PI * p + side * Math.PI);
    const depthOf = (p, side) => Math.cos(Math.PI * p + side * Math.PI);
    const shade = (p, side, y) => {
      const front = (depthOf(p, side) + 1) / 2;
      const ends = clamp(Math.min(p - start, end - p) / 0.3);
      gray.setScalar(0.16 + 0.5 * front);
      color.copy(gray);
      if (y <= state.at) color.lerp(SIGNAL, 0.55 + 0.45 * front);
      return color.multiplyScalar(ends);
    };
    strands.forEach((object, side) => {
      const positions = object.geometry.attributes.position.array, colors = object.geometry.attributes.color.array;
      for (let k = 0; k < total; k++) {
        const p = start + (end - start) * k / (total - 1);
        const y = yOf(p);
        positions.set([xOf(p, side), -y, depthOf(p, side)], k * 3);
        shade(p, side, y).toArray(colors, k * 3);
      }
      object.geometry.attributes.position.needsUpdate = true;
      object.geometry.attributes.color.needsUpdate = true;
    });
    const rungPositions = rungGeometry.attributes.position.array, rungColors = rungGeometry.attributes.color.array;
    for (let gap = 0, index = 0; gap < gaps; gap++) {
      for (let r = 1; r <= RUNGS; r++, index++) {
        const p = gap + r / (RUNGS + 1), y = yOf(p);
        rungPositions.set([xOf(p, 0), -y, -1, xOf(p, 1), -y, -1], index * 6);
        color.setScalar(0.12);
        if (y <= state.at) color.lerp(SIGNAL, 0.35);
        color.toArray(rungColors, index * 6);
        color.toArray(rungColors, index * 6 + 3);
      }
    }
    rungGeometry.attributes.position.needsUpdate = true;
    rungGeometry.attributes.color.needsUpdate = true;
    knots.forEach((knot, index) => {
      if (state.reached[index] && knot.userData.reachedAt < 0) knot.userData.reachedAt = time;
      if (!state.reached[index]) knot.userData.reachedAt = -1;
      const since = knot.userData.reachedAt < 0 ? Infinity : time - knot.userData.reachedAt;
      knot.position.set(center, -centers[index], 2);
      knot.rotation.set(time * 0.6 + index, time * 0.9, 0);
      knot.scale.setScalar(1 + 0.7 * Math.exp(-since * 5));
      knot.material.color.set(0x8a8a8a);
      if (state.reached[index]) knot.material.color.lerp(SIGNAL, 1);
    });
    // The runner follows the reader along the front strand, from the first module to the last.
    const y = Math.min(Math.max(state.at, state.top + state.overhang * 0.5), state.bottom - state.overhang * 0.5);
    const p = pOf(y);
    const runner = new THREE.Vector3(xOf(p, 0), -y, 3);
    history.unshift(runner);
    if (history.length > trail.length * 2) history.length = trail.length * 2;
    trail.forEach((dot, k) => {
      const at = history[k * 2];
      dot.visible = Boolean(at) && state.at > state.top;
      if (at) dot.position.set(at.x, at.y, 3 - k * 0.01);
    });
    glow.position.set(runner.x, runner.y, 2.5);
    glow.visible = trail[0].visible;
    glow.scale.setScalar(1 + 0.25 * Math.sin(time * 4));
    renderer.render(scene, camera);
  };
}

// ── The loop: every frame while the path is on screen, otherwise on scroll and resize ────

const draw = look === "thread" ? thread() : line();
const update = () => { if (!phone.matches) draw(); };
let visible = true, queued = false;
const frame = () => {
  queued = false;
  update();
  if (motion && visible && look !== "line") request();
};
const request = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible) request(); }).observe(list.closest(".app-formation-body") || list);
addEventListener("scroll", request, { passive: true });
addEventListener("resize", request);
new ResizeObserver(request).observe(list);
request();
