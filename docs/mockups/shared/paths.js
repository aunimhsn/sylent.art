// The path of a formation page (formation-site.html): its modules in the advised order, beside a
// rail. Three looks, chosen with ?path= (step 13b of roadmap.md):
// - line: the rail fills with orange as the page scrolls, and the square of a module lights up
//   when the orange reaches it;
// - thread: two strands of light twisted around the rail (Three.js), which cross at each module,
//   with a point of light that runs down to where the reader is and leaves an orange trail;
// - strata: the modules as stacked slabs (Three.js), the first at the bottom, a framework as a
//   frame on top of its language; the slab of the module being read rises and lights up.
// The orange always means the same thing: how far the reader has gone. Nothing moves when the
// visitor asked to reduce motion.
import * as THREE from "three";

const list = document.querySelector("[data-path]");
const steps = [...list.querySelectorAll("[data-step]")];
const look = ["thread", "strata"].find(name => list.classList.contains(`is-${name}`)) || "line";
const motion = document.documentElement.dataset.motion === "on";
const clamp = x => Math.min(1, Math.max(0, x));
const SIGNAL = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--signal").trim() || "#d3450e");
// The reader is where the orange reaches: a line at 60 % of the height of the window.
const MARK = 0.6;

// The centers of the modules on the rail, in the space of the list, and how far the reader is.
function reading() {
  const box = list.getBoundingClientRect();
  const centers = steps.map(step => {
    const node = step.querySelector(".app-step-node").getBoundingClientRect();
    return node.top + node.height / 2 - box.top;
  });
  const at = motion ? innerHeight * MARK - box.top : Infinity;
  const first = centers[0], last = centers[centers.length - 1];
  const reached = centers.map(center => center <= at + 1);
  return { box, centers, at, first, last, progress: clamp((at - first) / (last - first)), reached, active: Math.max(0, reached.lastIndexOf(true)) };
}

// ── Line: CSS only, driven by the scroll ─────────────────────────────────────────────

function line() {
  const update = () => {
    const state = reading();
    list.style.setProperty("--first", `${state.first}px`);
    list.style.setProperty("--length", `${state.last - state.first}px`);
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
  const PER_GAP = 48, OVERHANG = 0.45;
  const gaps = steps.length - 1;
  const total = Math.ceil((gaps + 2 * OVERHANG) * PER_GAP) + 1;
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
      Object.assign(camera, { right: width, bottom: -height });
      camera.updateProjectionMatrix();
    }
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
      for (let k = 0; k < gaps; k++) if (y <= centers[k + 1]) return k + (y - centers[k]) / (centers[k + 1] - centers[k]);
      return gaps;
    };
    // Half a turn between two modules, so that the strands cross on each one; the amplitude
    // breathes, which keeps the crossings in place.
    const xOf = (p, side) => center + amplitude * (0.86 + 0.14 * Math.sin(time * 1.3 + p * 2.1)) * Math.sin(Math.PI * p + side * Math.PI);
    const depthOf = (p, side) => Math.cos(Math.PI * p + side * Math.PI);
    const shade = (p, side, y) => {
      const front = (depthOf(p, side) + 1) / 2;
      const ends = clamp(Math.min(p + OVERHANG, gaps + OVERHANG - p) / OVERHANG);
      gray.setScalar(0.16 + 0.5 * front);
      color.copy(gray);
      if (y <= state.at) color.lerp(SIGNAL, 0.55 + 0.45 * front);
      return color.multiplyScalar(ends);
    };
    strands.forEach((object, side) => {
      const positions = object.geometry.attributes.position.array, colors = object.geometry.attributes.color.array;
      for (let k = 0; k < total; k++) {
        const p = -OVERHANG + k / PER_GAP;
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
    const y = Math.min(Math.max(state.at, centers[0]), centers[gaps]);
    const p = pOf(y);
    const runner = new THREE.Vector3(xOf(p, 0), -y, 3);
    history.unshift(runner);
    if (history.length > trail.length * 2) history.length = trail.length * 2;
    trail.forEach((dot, k) => {
      const at = history[k * 2];
      dot.visible = Boolean(at) && state.at > centers[0] - 40;
      if (at) dot.position.set(at.x, at.y, 3 - k * 0.01);
    });
    glow.position.set(runner.x, runner.y, 2.5);
    glow.visible = trail[0].visible;
    glow.scale.setScalar(1 + 0.25 * Math.sin(time * 4));
    renderer.render(scene, camera);
  };
}

// ── Strata: the modules as stacked slabs ───────────────────────────────────────────────

function strata() {
  const stage = document.querySelector("[data-strata]");
  const canvas = stage.querySelector("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
  camera.position.set(6, 4.6, 6);
  camera.lookAt(0, 0, 0);

  const SIZE = 2.6, THICK = 0.3, GAP = 1.05;
  const FILL = new THREE.Color(0x111111), FILL_LIT = new THREE.Color(0x2a1208), WHITE = new THREE.Color(0xffffff);
  const stack = new THREE.Group();
  stack.position.y = -(steps.length - 1) * GAP / 2;
  scene.add(stack);
  const slabs = steps.map((step, index) => {
    const geometry = new THREE.BoxGeometry(SIZE, THICK, SIZE);
    const slab = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: FILL }));
    const lines = [new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }))];
    // A framework: a frame raised on its slab, the structure it gives to its language.
    if (step.querySelector(".app-fw")) {
      const frame = new THREE.EdgesGeometry(new THREE.BoxGeometry(SIZE * 0.72, 0.22, SIZE * 0.72));
      const raised = new THREE.LineSegments(frame, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
      raised.position.y = THICK / 2 + 0.11;
      lines.push(raised);
    } else {
      // The others: a few grooves on their top, one more per module, as the knowledge grows.
      const points = [];
      for (let k = 1; k <= index + 1; k++) {
        const z = -SIZE / 2 + k * SIZE / (index + 2);
        points.push(new THREE.Vector3(-SIZE * 0.38, THICK / 2 + 0.001, z), new THREE.Vector3(SIZE * 0.38, THICK / 2 + 0.001, z));
      }
      lines.push(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 })));
    }
    lines.forEach(object => slab.add(object));
    slab.position.y = index * GAP;
    stack.add(slab);
    const label = document.createElement("span");
    label.className = "app-strata-label";
    label.textContent = step.querySelector(".app-step-title").firstChild.textContent.trim();
    stage.append(label);
    return { slab, lines, label, lift: 0 };
  });

  // The module under the pointer wins over the module being read.
  let hovered = -1;
  steps.forEach((step, index) => {
    step.addEventListener("pointerenter", () => { hovered = index; });
    step.addEventListener("pointerleave", () => { hovered = -1; });
  });

  let width = 0, height = 0, last = 0;
  const clock = new THREE.Clock();
  const corner = new THREE.Vector3();
  return () => {
    const state = reading();
    const time = motion ? clock.getElapsedTime() : 0;
    const delta = motion ? Math.min(time - last, 0.1) : 1;
    last = time;
    if (canvas.clientWidth !== width || canvas.clientHeight !== height) {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      renderer.setSize(width, height, false);
      // The stack on the left two thirds, the names of the modules on the right.
      const half = (steps.length - 1) * GAP / 2 + 2;
      const aspect = width / height;
      Object.assign(camera, { top: half, bottom: -half, left: -SIZE * 0.85, right: -SIZE * 0.85 + 2 * half * aspect });
      camera.updateProjectionMatrix();
    }
    const active = hovered >= 0 ? hovered : state.active;
    stack.rotation.y = 0.22 * Math.sin(time * 0.35);
    slabs.forEach((item, index) => {
      const target = index === active ? 1 : 0;
      item.lift += (target - item.lift) * Math.min(1, delta * 6);
      const lift = item.lift;
      item.slab.position.set(0, index * GAP + lift * 0.34, 0);
      item.slab.material.color.copy(FILL).lerp(FILL_LIT, lift);
      item.lines.forEach((object, k) => {
        object.material.color.copy(WHITE).lerp(SIGNAL, lift);
        object.material.opacity = (k ? 0.3 : 0.45) + 0.55 * lift;
      });
      // The name of the module, beside the right corner of its slab.
      corner.set(SIZE / 2, 0, -SIZE / 2);
      item.slab.localToWorld(corner);
      corner.project(camera);
      item.label.style.setProperty("--x", `${(corner.x + 1) / 2 * width + 14}px`);
      item.label.style.setProperty("--y", `${(1 - corner.y) / 2 * height}px`);
      item.label.classList.toggle("is-active", index === active);
      steps[index].classList.toggle("is-active", index === active);
    });
    renderer.render(scene, camera);
  };
}

// ── The loop: every frame while the path is on screen, otherwise on scroll and resize ────

const update = look === "thread" ? thread() : look === "strata" ? strata() : line();
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
