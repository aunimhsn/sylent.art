// The Instagram story of the launch (roadmap, step 14a): three variants of 12 s, drawn with the
// scenes of the covers of the site and GSAP. Everything moves on one paused timeline that
// `story.seek(t)` sets to any time, the scenes included, so that render.mjs can capture the
// story frame by frame, the same at every run.
//
// The tokens are imported first: the scenes read their colors from them when they load.
import "../../src/styles/tokens.css";
import "./story.css";
import { gsap } from "gsap";
import * as THREE from "three";
import type { Scene } from "../../src/scripts/cover-kit";
import { MODULE_SCENES } from "../../src/scripts/module-scenes";
import wordmark from "../../src/assets/brand/wordmark.svg?raw";
import facePhoto from "../../src/assets/portrait/face.png";

const DURATION = 12;

const params = new URLSearchParams(location.search);
const variant = params.get("variant") ?? "a";
const launch = params.has("launch");
const stage = document.getElementById("stage") as HTMLElement;
if (params.has("safe")) stage.classList.add("safe");

const css = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();

/** An element from its markup. */
function html(markup: string) {
  const template = document.createElement("template");
  template.innerHTML = markup.trim();
  return template.content.firstElementChild as HTMLElement;
}

/** Lines of a title, each one in its mask. */
const lines = (texts: string[]) =>
  texts
    .map((text) => `<span class="line"><span>${text}</span></span>`)
    .join("");

/** Words that appear one by one. */
const words = (text: string) =>
  text
    .split(" ")
    .map((word) => `<span class="word">${word}</span>`)
    .join(" ");

const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

// ── The scenes, drawn by one renderer ─────────────────────────────────────────────────
// As on the site (src/scripts/covers.ts), the scenes of a frame are drawn side by side in one
// renderer, then copied through an image bitmap into the canvas of their slot: drawImage
// straight from a WebGL canvas swaps red and blue on the owner's Firefox.
interface Slot {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  scene: Scene;
  /** When its scene starts, in the time of the story. */
  start: number;
}

const slots: Slot[] = [];
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(1);
const ROW_LIMIT = 4096;
let room = [0, 0];

function addSlot(element: HTMLElement, scene: Scene, start = 0) {
  const canvas = document.createElement("canvas");
  element.append(canvas);
  slots.push({
    element,
    canvas,
    context: canvas.getContext("2d") as CanvasRenderingContext2D,
    scene,
    start,
  });
}

async function draw(time: number) {
  const box = stage.getBoundingClientRect();
  const parts: { slot: Slot; x: number; y: number; w: number; h: number }[] =
    [];
  let [x, y, rowHeight, used] = [0, 0, 0, 0];
  for (const slot of slots) {
    const w = slot.element.offsetWidth;
    const h = slot.element.offsetHeight;
    const rect = slot.element.getBoundingClientRect();
    const shown =
      w > 0 &&
      h > 0 &&
      slot.element.checkVisibility({
        opacityProperty: true,
        visibilityProperty: true,
      }) &&
      rect.bottom > box.top &&
      rect.top < box.bottom &&
      rect.right > box.left &&
      rect.left < box.right;
    if (!shown) continue;
    if (x > 0 && x + w > ROW_LIMIT) [x, y, rowHeight] = [0, y + rowHeight, 0];
    parts.push({ slot, x, y, w, h });
    x += w;
    used = Math.max(used, x);
    rowHeight = Math.max(rowHeight, h);
  }
  if (parts.length === 0) return;
  const needed = [used, y + rowHeight];
  if (room[0] < needed[0] || room[1] < needed[1]) {
    room = [Math.max(room[0], needed[0]), Math.max(room[1], needed[1])];
    renderer.setSize(room[0], room[1], false);
  }
  renderer.setScissorTest(true);
  renderer.setClearColor(0x000000, 0);
  for (const { slot, x, y, w, h } of parts) {
    const { camera } = slot.scene;
    if (camera.aspect !== w / h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    slot.scene.update(Math.max(0, time - slot.start));
    const bottom = room[1] - y - h;
    renderer.setViewport(x, bottom, w, h);
    renderer.setScissor(x, bottom, w, h);
    renderer.clear();
    renderer.render(slot.scene.scene, camera);
  }
  const bitmap = await createImageBitmap(
    renderer.domElement,
    0,
    0,
    needed[0],
    needed[1],
  );
  for (const { slot, x, y, w, h } of parts) {
    if (slot.canvas.width !== w || slot.canvas.height !== h) {
      slot.canvas.width = w;
      slot.canvas.height = h;
    } else {
      slot.context.clearRect(0, 0, w, h);
    }
    slot.context.drawImage(bitmap, x, y, w, h, 0, 0, w, h);
  }
  bitmap.close();
}

// ── The cube of the hero (src/scripts/cube.ts), turned by the timeline ───────────────
const FACES: [string, string][] = [
  ["Votre formateur", ""],
  ["Le sens", "Pourquoi ?"],
  ["Par an depuis 2023", "900+ h"],
  ["Pas à pas", "Patience"],
  ["En toute sérénité", "Bienveillance"],
  ["Organismes", "5"],
];

async function photoOval() {
  const image = new Image();
  image.src = facePhoto;
  await image.decode();
  const oval = document.createElement("canvas");
  const { naturalWidth: width, naturalHeight: height } = image;
  oval.width = width;
  oval.height = height;
  const g = oval.getContext("2d") as CanvasRenderingContext2D;
  g.drawImage(image, 0, 0);
  const fade = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  fade.addColorStop(0.55, "#000000");
  fade.addColorStop(1, "transparent");
  g.setTransform(width * 0.5, 0, 0, height * 0.62, width * 0.5, height * 0.38);
  g.globalCompositeOperation = "destination-in";
  g.fillStyle = fade;
  g.fillRect(-1, -1, 2, 2);
  return oval;
}

/** The state of the cube that the timeline animates: its size and the face it shows. */
const cubeState = { scale: 0, turn: 0 };

async function cubeScene(): Promise<Scene> {
  const family = css("--font-title");
  const photo = await photoOval();
  const faceTexture = ([small, big]: [string, string], index: number) => {
    const size = 1024;
    const unit = size / 512;
    const paint = document.createElement("canvas");
    paint.width = paint.height = size;
    const g = paint.getContext("2d") as CanvasRenderingContext2D;
    g.fillStyle = css("--cover-bg");
    g.fillRect(0, 0, size, size);
    g.strokeStyle = css("--cover-line");
    g.lineWidth = unit;
    for (let x = 0; x <= size; x += 32 * unit) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, size);
      g.stroke();
      g.beginPath();
      g.moveTo(0, x);
      g.lineTo(size, x);
      g.stroke();
    }
    if (index === 0) {
      const height = size * 0.84;
      const width = (photo.width / photo.height) * height;
      g.drawImage(photo, (size - width) / 2, size - height, width, height);
    }
    g.fillStyle = css("--secondary");
    g.font = `700 ${24 * unit}px ${family}`;
    g.letterSpacing = `${4 * unit}px`;
    g.textBaseline = "top";
    g.fillText(small.toUpperCase(), 48 * unit, 52 * unit);
    if (big) {
      g.letterSpacing = `${-4 * unit}px`;
      g.fillStyle = css("--text");
      let fontSize = 160 * unit;
      do {
        g.font = `800 ${fontSize}px ${family}`;
        fontSize -= 4 * unit;
      } while (g.measureText(big).width > size - 96 * unit);
      g.textBaseline = "alphabetic";
      g.fillText(big, 44 * unit, size - 70 * unit);
      g.fillRect(48 * unit, size - 50 * unit, 72 * unit, 8 * unit);
    }
    const texture = new THREE.CanvasTexture(paint);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 14);
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube = new THREE.Mesh(
    geometry,
    FACES.map(
      (face, index) =>
        new THREE.MeshBasicMaterial({
          map: faceTexture(face, index),
          transparent: true,
          opacity: 0.95,
        }),
    ),
  );
  cube.add(
    new THREE.LineSegments(
      new THREE.EdgesGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: new THREE.Color(css("--text")),
        transparent: true,
        opacity: 0.9,
      }),
    ),
  );
  const shell = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.7, 2.7, 2.7)),
    new THREE.LineBasicMaterial({
      color: new THREE.Color(css("--signal")),
      transparent: true,
      opacity: 0.5,
    }),
  );
  const rig = new THREE.Group();
  rig.add(cube, shell);
  rig.scale.setScalar(1.3);
  scene.add(rig);

  // The turns that bring each face to the front, as on the site.
  const lean = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0.28, -0.42, 0),
  );
  const views = [
    [0, -Math.PI / 2],
    [Math.PI / 2, 0],
    [0, 0],
    [0, Math.PI / 2],
    [-Math.PI / 2, 0],
    [0, Math.PI],
  ].map(([x, y]) =>
    lean
      .clone()
      .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, 0))),
  );
  // The faces in the order of the story: the photo, « Pourquoi ? », « Patience »,
  // « Bienveillance ».
  const shown = [0, 3, 4, 2].map((index) => views[index]);
  return {
    scene,
    camera,
    update(time) {
      const index = Math.min(Math.floor(cubeState.turn), shown.length - 2);
      cube.quaternion.slerpQuaternions(
        shown[index],
        shown[index + 1],
        cubeState.turn - index,
      );
      cube.scale.setScalar(cubeState.scale);
      shell.scale.setScalar(cubeState.scale);
      shell.rotation.x = -time * 0.15;
      shell.rotation.y = time * 0.11;
    },
  };
}

// ── The parts shared by the variants ──────────────────────────────────────────────────
function grid() {
  stage.append(html(`<div class="grid"></div>`));
}

/** A large heading of the site: its title over its faded word, which slides from the right. */
function heading(title: string, ghost: string, top: number, at: number) {
  const ghostWord = html(
    `<div class="ghost" style="top:${top - 70}px">${ghost}</div>`,
  );
  const titleLine = html(
    `<h1 class="title" style="top:${top}px; font-size:120px">${lines([title])}</h1>`,
  );
  stage.append(ghostWord, titleLine);
  tl.fromTo(
    ghostWord,
    { x: 520, autoAlpha: 0 },
    { x: -260, autoAlpha: 1, duration: 6, ease: "power1.out" },
    at,
  );
  tl.fromTo(
    titleLine.querySelector(".line > span"),
    { yPercent: 110 },
    { yPercent: 0, duration: 0.8 },
    at + 0.2,
  );
  return [ghostWord, titleLine];
}

/** The end card: the logo, « Nouveau site », the address over an orange trail. */
function endCard(at: number) {
  const end = html(`
    <div class="end">
      <div class="end-mark">${wordmark}</div>
      <div class="small">${launch ? "Nouveau site · en ligne" : "Nouveau site · bientôt"}</div>
      <div class="end-url">${lines(["sylent.art"])}</div>
      <div class="end-rule"><span class="trail"></span></div>
    </div>`);
  stage.append(end);
  tl.fromTo(end, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, at);
  tl.fromTo(
    end.querySelector(".end-mark"),
    { y: 80, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.9 },
    at,
  );
  tl.fromTo(
    end.querySelector(".small"),
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.6 },
    at + 0.5,
  );
  tl.fromTo(
    end.querySelector(".end-url .line > span"),
    { yPercent: 110 },
    { yPercent: 0, duration: 0.8 },
    at + 0.7,
  );
  tl.fromTo(
    end.querySelector(".trail"),
    { scaleX: 0 },
    { scaleX: 1, duration: 1, ease: "power2.inOut" },
    at + 1.1,
  );
}

/** Hides elements by sliding them up. */
function leave(elements: (Element | null)[], at: number) {
  tl.to(
    elements,
    { y: -80, autoAlpha: 0, duration: 0.4, ease: "power2.in", stagger: 0.05 },
    at,
  );
}

// ── Variant A: the cube ───────────────────────────────────────────────────────────────
// An orange trail draws itself, the cube of the hero arrives with the owner's face and turns to
// three of its qualities, then « Mon site fait peau neuve. ».
async function variantCube() {
  grid();
  const trail = html(
    `<span class="trail" style="left:96px; top:956px; width:888px"></span>`,
  );
  const intro = html(
    `<div class="small" style="position:absolute; left:96px; top:300px">Aunim Hassan · Formateur</div>`,
  );
  const cubeSlot = html(
    `<div class="slot" style="left:0; top:0; width:1080px; height:1920px"></div>`,
  );
  stage.append(cubeSlot, trail, intro);
  addSlot(cubeSlot, await cubeScene());

  tl.fromTo(
    trail,
    { scaleX: 0 },
    { scaleX: 1, duration: 0.9, ease: "power2.inOut" },
    0.1,
  );
  tl.set(trail, { transformOrigin: "right center" }, 1.0);
  tl.to(trail, { scaleX: 0, duration: 0.5, ease: "power2.in" }, 1.0);
  tl.to(
    cubeState,
    { scale: 1, duration: 1.6, ease: "elastic.out(1, 0.6)" },
    1.0,
  );
  tl.fromTo(intro, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 1.6);
  [3.3, 4.5, 5.7].forEach((at, index) =>
    tl.to(
      cubeState,
      { turn: index + 1, duration: 0.6, ease: "power2.inOut" },
      at,
    ),
  );
  tl.to(cubeState, { scale: 0, duration: 0.5, ease: "power3.in" }, 7.0);
  leave([intro], 7.0);

  const texts = launch
    ? ["Mon", "nouveau", "site."]
    : ["Mon site", "fait peau", "neuve."];
  const ghostWord = html(
    `<div class="ghost" style="top:640px">${launch ? "En ligne" : "Bientot"}</div>`,
  );
  const title = html(
    `<h1 class="title" style="top:720px; font-size:128px">${lines(texts)}</h1>`,
  );
  stage.append(ghostWord, title);
  tl.fromTo(
    ghostWord,
    { x: 400, autoAlpha: 0 },
    { x: -200, autoAlpha: 1, duration: 3, ease: "power1.out" },
    7.2,
  );
  tl.fromTo(
    title.querySelectorAll(".line > span"),
    { yPercent: 110 },
    { yPercent: 0, duration: 0.8, stagger: 0.12 },
    7.5,
  );
  leave([title, ghostWord], 9.2);
  endCard(9.6);
}

// ── Variant B: the modules ────────────────────────────────────────────────────────────
// A wall of module cards, each with its scene, scrolls up under « Formations », then the offer
// in three lines.
const MODULES: [string, string, keyof typeof MODULE_SCENES][] = [
  ["HTML", "Développement web", "markup"],
  ["CSS", "Développement web", "layout"],
  ["JavaScript", "Développement web", "event"],
  ["PHP", "Développement web", "server"],
  ["Laravel", "Développement web", "mvc"],
  ["Python", "Programmation", "snake"],
  ["Machine learning", "Programmation", "fit"],
  ["MySQL", "Bases de données", "table"],
  ["Merise", "Bases de données", "entities"],
  ["UML", "Conception logicielle", "classes"],
  ["Principes SOLID", "Conception logicielle", "solid"],
  ["Scrum", "Gestion de projet", "sprint"],
  ["Cypress", "Méthodologie et tests", "checks"],
  ["CI / CD", "Méthodologie et tests", "pipeline"],
  ["Claude Code", "IA générative", "terminal"],
  ["Prompt engineering", "IA générative", "chat"],
];

function variantModules() {
  grid();
  const headingParts = heading("Formations", "Apprendre", 300, 0);
  const viewport = html(
    `<div class="layer" style="top:500px; overflow:hidden; -webkit-mask-image:linear-gradient(transparent, #000 60px, #000 85%, transparent); mask-image:linear-gradient(transparent, #000 60px, #000 85%, transparent)"></div>`,
  );
  const wall = html(`<div class="layer" style="top:60px"></div>`);
  viewport.append(wall);
  stage.append(viewport);
  const pitch = 458;
  MODULES.forEach(([title, domain, scene], index) => {
    const row = Math.floor(index / 2);
    const tile = html(`
      <article class="tile" style="left:${96 + (index % 2) * 468}px; top:${row * pitch}px">
        <div class="slot"></div>
        <h2 class="tile-title"><span class="tile-domain">${domain}</span>${title}</h2>
      </article>`);
    wall.append(tile);
    addSlot(
      tile.querySelector(".slot") as HTMLElement,
      MODULE_SCENES[scene](),
      index * 0.3,
    );
    if (row < 3)
      tl.fromTo(
        tile,
        { y: 120, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8 },
        0.5 + index * 0.12,
      );
  });
  const rows = Math.ceil(MODULES.length / 2);
  tl.to(
    wall,
    { y: -(rows * pitch - 1100), duration: 6, ease: "power1.inOut" },
    1.4,
  );
  leave([viewport, ...headingParts], 7.3);

  const facts = html(
    `<h1 class="title" style="top:640px; font-size:120px">${lines([
      "7 domaines.",
      "24 modules.",
      '<span class="signal">Une méthode.</span>',
    ])}</h1>`,
  );
  stage.append(facts);
  tl.fromTo(
    facts.querySelectorAll(".line > span"),
    { yPercent: 110 },
    { yPercent: 0, duration: 0.8, stagger: 0.35 },
    7.6,
  );
  leave([facts], 9.2);
  endCard(9.6);
}

// ── Variant C: the method ─────────────────────────────────────────────────────────────
// The cycle of a lesson, its three phases filling their share, then the promise of the site.
function variantMethod() {
  grid();
  const headingParts = heading("Pedagogie", "Accompagner", 300, 0);
  const phases: [string, string, number][] = [
    ["Théorie", "20 %", 0.2],
    ["Pratique", "50 %", 0.5],
    ["Correction", "30 %", 0.3],
  ];
  const steps = html(
    `<div class="steps" style="top:560px">${phases
      .map(
        ([name, share], index) => `
        <div class="step">
          <span class="step-number">${["I", "II", "III"][index]}</span>
          <span class="step-name"><span>${name}</span><span class="step-share">${share}</span></span>
          <span class="gauge"><span></span></span>
        </div>`,
      )
      .join("")}</div>`,
  );
  const again = html(
    `<div class="small" style="position:absolute; left:96px; top:1150px">Puis on recommence</div>`,
  );
  const sceneSlot = html(
    `<div class="slot" style="left:0; top:1180px; width:1080px; height:680px"></div>`,
  );
  stage.append(steps, again, sceneSlot);
  addSlot(sceneSlot, MODULE_SCENES.sprint(), 4.2);
  steps.querySelectorAll(".step").forEach((step, index) => {
    const at = 1.0 + index * 1.0;
    tl.fromTo(
      step.querySelectorAll(".step-number, .step-name"),
      { y: 80, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1 },
      at,
    );
    tl.fromTo(
      step.querySelector(".gauge"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3 },
      at + 0.2,
    );
    tl.fromTo(
      step.querySelector(".gauge > span"),
      { scaleX: 0 },
      { scaleX: phases[index][2], duration: 0.9, ease: "power2.inOut" },
      at + 0.3,
    );
  });
  tl.fromTo(
    [again, sceneSlot],
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.8, stagger: 0.2 },
    4.2,
  );
  leave([...headingParts, steps, again, sceneSlot], 6.8);

  const promise = html(
    `<p class="promise" style="top:700px">${words(
      "Je prends vos apprenants par la main,",
    )} <span class="highlight">${words("jusqu’à la maîtrise.")}</span></p>`,
  );
  stage.append(promise);
  tl.fromTo(
    promise.querySelectorAll(".word"),
    { y: 60, autoAlpha: 0 },
    { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.11 },
    7.3,
  );
  leave([promise], 9.2);
  endCard(9.6);
}

// ── Start ─────────────────────────────────────────────────────────────────────────────
const family = css("--font-title");
await Promise.all([
  document.fonts.load(`800 120px ${family}`),
  document.fonts.load(`700 26px ${family}`),
  document.fonts.load(`500 40px ${css("--font-text")}`),
]);
if (variant === "b") variantModules();
else if (variant === "c") variantMethod();
else await variantCube();
tl.seek(0);

/** Sets the story to a time, in seconds, and draws its scenes. */
async function seek(time: number) {
  tl.seek(time, false);
  await draw(time);
}

declare global {
  interface Window {
    story: { duration: number; seek: (time: number) => Promise<void> };
  }
}
window.story = { duration: DURATION, seek };

// ?capture=1: render.mjs drives the time; ?t=4.5 holds one frame; otherwise the story loops,
// with a second of the end card.
const held = params.get("t");
if (held !== null) await seek(Number(held));
else if (!params.has("capture")) {
  const begin = performance.now();
  let busy = false;
  const loop = (now: number) => {
    requestAnimationFrame(loop);
    if (busy) return;
    busy = true;
    const time = ((now - begin) / 1000) % (DURATION + 1);
    seek(Math.min(time, DURATION)).finally(() => (busy = false));
  };
  requestAnimationFrame(loop);
}
document.documentElement.dataset.ready = "true";
