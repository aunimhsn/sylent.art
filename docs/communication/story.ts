// The videos of the launch (roadmap, step 14a), drawn with the scenes of the site and GSAP:
// variant A « Le cube » and variant D « L'impact », as an Instagram story (1080 × 1920) or as a
// video of the LinkedIn and Facebook feeds (?format=feed, 1080 × 1350). Everything moves on one
// paused timeline that `story.seek(t)` sets to any time, the scenes included: the page of the
// supports drives it (?controlled=1), and render.mjs captures it frame by frame.
//
// The tokens are imported first: the scenes read their colors from them when they load.
import "../../src/styles/tokens.css";
import "./story.css";
import { gsap } from "gsap";
import * as THREE from "three";
import type { Scene } from "../../src/scripts/cover-kit";
import wordmark from "../../src/assets/brand/wordmark.svg?raw";
import facePhoto from "../../src/assets/portrait/face.png";
import { synthesize } from "./sound.js";

interface Cue {
  time: number;
  sound: string;
  pitch?: number;
  gain?: number;
  length?: number;
}

const params = new URLSearchParams(location.search);
const variant = params.get("variant") === "d" ? "d" : "a";
const launch = params.has("launch");
const feed = params.get("format") === "feed";
const WIDTH = 1080;
const HEIGHT = feed ? 1350 : 1920;
const stage = document.getElementById("stage") as HTMLElement;
stage.style.height = `${HEIGHT}px`;
if (params.has("safe") && !feed) stage.classList.add("safe");

let duration = 12;
const cues: Cue[] = [];

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
}

const slots: Slot[] = [];
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(1);
let room = [0, 0];

function addSlot(element: HTMLElement, scene: Scene) {
  const canvas = document.createElement("canvas");
  element.append(canvas);
  slots.push({
    element,
    canvas,
    context: canvas.getContext("2d") as CanvasRenderingContext2D,
    scene,
  });
}

async function draw(time: number) {
  const parts: { slot: Slot; x: number; w: number; h: number }[] = [];
  let x = 0;
  for (const slot of slots) {
    const w = slot.element.offsetWidth;
    const h = slot.element.offsetHeight;
    const shown =
      w > 0 &&
      h > 0 &&
      slot.element.checkVisibility({
        opacityProperty: true,
        visibilityProperty: true,
      });
    if (!shown) continue;
    parts.push({ slot, x, w, h });
    x += w;
  }
  if (parts.length === 0) return;
  const needed = [x, Math.max(...parts.map(({ h }) => h))];
  if (room[0] < needed[0] || room[1] < needed[1]) {
    room = [Math.max(room[0], needed[0]), Math.max(room[1], needed[1])];
    renderer.setSize(room[0], room[1], false);
  }
  renderer.setScissorTest(true);
  renderer.setClearColor(0x000000, 0);
  for (const { slot, x, w, h } of parts) {
    const { camera } = slot.scene;
    if (camera.aspect !== w / h) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    slot.scene.update(time);
    const bottom = room[1] - h;
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
  for (const { slot, x, w, h } of parts) {
    if (slot.canvas.width !== w || slot.canvas.height !== h) {
      slot.canvas.width = w;
      slot.canvas.height = h;
    } else {
      slot.context.clearRect(0, 0, w, h);
    }
    slot.context.drawImage(bitmap, x, 0, w, h, 0, 0, w, h);
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

async function cubeScene(size: number): Promise<Scene> {
  const family = css("--font-title");
  const photo = await photoOval();
  const faceTexture = ([small, big]: [string, string], index: number) => {
    const side = 1024;
    const unit = side / 512;
    const paint = document.createElement("canvas");
    paint.width = paint.height = side;
    const g = paint.getContext("2d") as CanvasRenderingContext2D;
    g.fillStyle = css("--cover-bg");
    g.fillRect(0, 0, side, side);
    g.strokeStyle = css("--cover-line");
    g.lineWidth = unit;
    for (let x = 0; x <= side; x += 32 * unit) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, side);
      g.stroke();
      g.beginPath();
      g.moveTo(0, x);
      g.lineTo(side, x);
      g.stroke();
    }
    if (index === 0) {
      const height = side * 0.84;
      const width = (photo.width / photo.height) * height;
      g.drawImage(photo, (side - width) / 2, side - height, width, height);
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
      } while (g.measureText(big).width > side - 96 * unit);
      g.textBaseline = "alphabetic";
      g.fillText(big, 44 * unit, side - 70 * unit);
      g.fillRect(48 * unit, side - 50 * unit, 72 * unit, 8 * unit);
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
  // The camera sees 7.5 units over the height of the slot: the cube takes `size` pixels.
  rig.scale.setScalar((size * 7.5) / (2 * HEIGHT));
  scene.add(rig);

  // The turns that bring each face to the front, as on the site, then the faces in the order
  // of the video: the photo, « Pourquoi ? », « Patience », « Bienveillance ».
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

// ── The end card of variant A ─────────────────────────────────────────────────────────
/** The logo, « Nouveau site », the address over an orange trail. */
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
  stage.append(html(`<div class="grid"></div>`));
  const trail = html(
    `<span class="trail" style="left:96px; top:${HEIGHT / 2 - 4}px; width:888px"></span>`,
  );
  const intro = html(
    `<div class="small" style="position:absolute; left:96px; top:${feed ? 110 : 300}px">Aunim Hassan · Formateur</div>`,
  );
  const cubeSlot = html(
    `<div class="slot" style="left:0; top:0; width:${WIDTH}px; height:${HEIGHT}px"></div>`,
  );
  stage.append(cubeSlot, trail, intro);
  addSlot(cubeSlot, await cubeScene(feed ? 560 : 660));

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
  const top = feed ? 480 : 720;
  const ghostWord = html(
    `<div class="ghost" style="top:${top - 80}px">${launch ? "En ligne" : "Bientot"}</div>`,
  );
  const title = html(
    `<h1 class="title" style="top:${top}px">${lines(texts)}</h1>`,
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

// ── Variant D: the impact ─────────────────────────────────────────────────────────────
// Out of the frame of the site, as the owner asked: the date, « nouveau site » and the address
// fall one after the other, each with a boom, a flash and shards, on a dark, a white then a dark
// screen; then silence, and the letters of « bientôt » walk in from the right, small and soft,
// while an orange ball bounces down to become the dot of its i.

/** The shards of the hits: small outlined blocks thrown from the center, then falling. */
function shardsScene(hits: { time: number; color: string }[]): Scene {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, WIDTH / HEIGHT, 0.1, 100);
  camera.position.set(0, 0, 14);
  const random = (k: number) => {
    const x = Math.sin(k * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  const shapes = [
    new THREE.BoxGeometry(0.22, 0.22, 0.22),
    new THREE.TetrahedronGeometry(0.17),
    new THREE.OctahedronGeometry(0.14),
  ];
  const signal = new THREE.Color(css("--signal"));
  const shards = hits.flatMap(({ time, color }, hit) =>
    Array.from({ length: 34 }, (_, index) => {
      const k = hit * 100 + index;
      const tint = index % 5 === 0 ? signal : new THREE.Color(color);
      const shard = new THREE.LineSegments(
        new THREE.EdgesGeometry(shapes[index % shapes.length]),
        new THREE.LineBasicMaterial({
          color: tint,
          transparent: true,
        }),
      );
      shard.scale.setScalar(0.6 + 1.6 * random(k + 0.5));
      scene.add(shard);
      const angle = random(k + 0.1) * Math.PI * 2;
      const speed = 3 + 6 * random(k + 0.2);
      return {
        shard,
        start: time,
        end: hits[hit + 1]?.time ?? Infinity,
        velocity: new THREE.Vector3(
          Math.cos(angle) * speed,
          Math.sin(angle) * speed + 2,
          (random(k + 0.3) - 0.3) * 6,
        ),
        spin: new THREE.Vector3(
          random(k + 0.4) * 9 - 4.5,
          random(k + 0.6) * 9 - 4.5,
          random(k + 0.7) * 9 - 4.5,
        ),
      };
    }),
  );
  return {
    scene,
    camera,
    update(time) {
      for (const { shard, start, end, velocity, spin } of shards) {
        const age = time - start;
        shard.visible = age >= 0 && time < end;
        if (!shard.visible) continue;
        shard.position
          .copy(velocity)
          .multiplyScalar(age)
          .add(new THREE.Vector3(0, -4.5 * age * age, 0));
        shard.rotation.set(spin.x * age, spin.y * age, spin.z * age);
        (shard.material as THREE.LineBasicMaterial).opacity = Math.max(
          0,
          1 - age / 1.1,
        );
      }
    },
  };
}

/** Sets the font size of each element so that its text spans `width` pixels on one line. */
function fit(elements: HTMLElement[], width: number) {
  for (const element of elements) {
    element.style.fontSize = "100px";
    element.style.fontSize = `${(100 * width) / element.getBoundingClientRect().width}px`;
  }
}

function variantImpact() {
  duration = 10;
  const white = "#f4f4f4";
  const black = css("--bg");
  const hits = [
    { time: 1.0, color: white, background: black, text: white, flash: white },
    { time: 2.15, color: black, background: white, text: black, flash: black },
    { time: 3.3, color: white, background: black, text: white, flash: white },
  ];
  const quiet = 4.55;

  // Everything that shakes on a hit is in one layer; the stage keeps its background.
  const shake = html(`<div class="layer"></div>`);
  const shardSlot = html(
    `<div class="slot" style="left:0; top:0; width:${WIDTH}px; height:${HEIGHT}px"></div>`,
  );
  const flash = html(`<div class="layer flash"></div>`);
  // The date of the launch, « nouveau site » as a block justified on both sides, the address.
  const words = [
    `<div class="hit"><span class="hit-line">3/11/26</span></div>`,
    `<div class="hit hit-block"><span class="hit-line">Nouveau</span><span class="hit-line">site</span></div>`,
    `<div class="hit"><span class="hit-line hit-address">sylent.art</span></div>`,
  ].map(html);
  shake.append(shardSlot, ...words);
  stage.append(shake, flash);
  fit(
    words.flatMap((word) => [...word.querySelectorAll<HTMLElement>(".hit-line")]),
    WIDTH - 2 * 110,
  );
  addSlot(
    shardSlot,
    shardsScene(hits.map(({ time, color }) => ({ time, color }))),
  );

  // The tension before the first hit: a small orange dot that swells.
  const dot = html(`<div class="dot"></div>`);
  shake.append(dot);
  tl.fromTo(
    dot,
    { scale: 0.5, autoAlpha: 0.5 },
    {
      scale: 1.6,
      autoAlpha: 1,
      duration: hits[0].time - 0.27,
      ease: "power2.in",
      immediateRender: false,
    },
    0.15,
  );
  tl.to(dot, { autoAlpha: 0, duration: 0.01 }, hits[0].time - 0.12);
  cues.push({ time: 0.15, sound: "riser", length: 0.85, gain: 0.8 });

  hits.forEach(({ time, background, text, flash: flashColor }, index) => {
    const word = words[index];
    // The word falls from the camera in 0.18 s, blurred, and lands on the hit.
    tl.set(word, { color: text }, 0);
    tl.fromTo(
      word,
      { scale: 2.8, autoAlpha: 0, filter: "blur(24px)" },
      {
        scale: 1,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.18,
        ease: "power4.in",
        immediateRender: false,
      },
      time - 0.18,
    );
    // Then it drifts closer until the next one; the two lines of « nouveau site » slide apart.
    tl.to(word, { scale: 1.06, duration: 1, ease: "none" }, time);
    if (word.classList.contains("hit-block")) {
      const [first, second] = word.querySelectorAll(".hit-line");
      tl.to(first, { x: -28, duration: 1, ease: "power2.out" }, time);
      tl.to(second, { x: 28, duration: 1, ease: "power2.out" }, time);
    }
    const next = hits[index + 1]?.time ?? quiet;
    tl.set(
      word,
      { autoAlpha: 0 },
      index < hits.length - 1 ? next - 0.18 : next,
    );
    tl.set(stage, { backgroundColor: background }, time);
    tl.fromTo(
      flash,
      { autoAlpha: 0.85, backgroundColor: flashColor },
      {
        autoAlpha: 0,
        duration: 0.3,
        ease: "power2.out",
        immediateRender: false,
      },
      time,
    );
    tl.to(
      shake,
      {
        keyframes: [
          { x: -34, y: 20, duration: 0.04 },
          { x: 26, y: -16, duration: 0.05 },
          { x: -16, y: 10, duration: 0.06 },
          { x: 8, y: -5, duration: 0.07 },
          { x: 0, y: 0, duration: 0.08 },
        ],
        ease: "none",
      },
      time,
    );
    cues.push({
      time,
      sound: "impact",
      gain: 0.8 + 0.1 * index,
      pitch: 1 - 0.08 * index,
    });
  });

  // Silence and black: then the soft word, its letters walking in from the right one by one.
  tl.set(stage, { backgroundColor: black }, quiet);
  cues.push({ time: quiet, sound: "cut" });
  const soft = launch ? "en ligne" : "bientôt";
  const cute = html(
    `<div class="cute">${[...soft]
      .map((letter) =>
        letter === "i"
          ? `<span class="letter">ı</span>`
          : `<span class="letter">${letter === " " ? "&nbsp;" : letter}</span>`,
      )
      .join("")}</div>`,
  );
  const ball = html(`<div class="ball"></div>`);
  stage.append(cute, ball);
  // The places of the letters and the dot of the i, measured before any tween moves them.
  const box = stage.getBoundingClientRect();
  const letters = [...cute.querySelectorAll<HTMLElement>(".letter")];
  const places = letters.map((letter) => letter.getBoundingClientRect());
  const dotless = letters.findIndex((letter) => letter.textContent === "ı");
  const glyph = places[dotless];
  const ballSize = 30;
  const target = {
    x: glyph.left - box.left + glyph.width / 2 - ballSize / 2,
    y: glyph.top - box.top + glyph.height * 0.14 - ballSize / 2,
  };
  gsap.set(ball, { x: target.x, y: target.y });

  // Each letter waddles in: it sways from one foot to the other and hops at every step, then
  // stops in its place with a little bounce. The letters leave two steps apart, so that all
  // their steps fall on one beat: a « tut » on each, from one foot to the other.
  const step = 0.13;
  const beats = new Set<number>();
  const walk = 1.3;
  const steps = Math.round(walk / step);
  let arrived = quiet;
  letters.forEach((letter, index) => {
    if (letter.textContent?.trim() === "") return;
    const start = quiet + 0.3 + index * 2 * step;
    const from = WIDTH + 80 - (places[index].left - box.left);
    // Its own short tween shows it: it reverts reliably when the video loops back.
    tl.fromTo(
      letter,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.01, immediateRender: false },
      start,
    );
    tl.fromTo(
      letter,
      { x: from },
      { x: 0, duration: walk, ease: "power1.out", immediateRender: false },
      start,
    );
    tl.fromTo(
      letter,
      { rotation: -11 },
      {
        rotation: 11,
        duration: step,
        ease: "sine.inOut",
        repeat: steps - 1,
        yoyo: true,
        immediateRender: false,
      },
      start,
    );
    tl.fromTo(
      letter,
      { y: 0 },
      {
        y: -22,
        duration: step / 2,
        ease: "power1.out",
        repeat: steps * 2 - 1,
        yoyo: true,
        immediateRender: false,
      },
      start,
    );
    const stop = start + walk;
    tl.to(
      letter,
      { rotation: 0, y: 0, duration: 0.35, ease: "back.out(4)" },
      stop,
    );
    for (let beat = 1; beat <= steps; beat++)
      beats.add(Math.round((start - quiet) / step) + beat);
    arrived = Math.max(arrived, stop);
  });
  [...beats].forEach((beat) =>
    cues.push({
      time: quiet + beat * step,
      sound: "step",
      pitch: beat % 2 ? 1 : 1.19,
    }),
  );

  // The ball falls from above the screen and bounces three times onto the i.
  const fall = arrived + 0.3;
  const bounces = [fall + 0.5, fall + 0.82, fall + 1.02];
  tl.fromTo(
    ball,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.01, immediateRender: false },
    fall,
  );
  tl.fromTo(
    ball,
    { y: -120 },
    { y: target.y, duration: 0.5, ease: "power2.in", immediateRender: false },
    fall,
  );
  tl.to(
    ball,
    { y: target.y - 150, duration: 0.16, ease: "power2.out" },
    bounces[0],
  );
  tl.to(
    ball,
    { y: target.y, duration: 0.16, ease: "power2.in" },
    bounces[0] + 0.16,
  );
  tl.to(
    ball,
    { y: target.y - 50, duration: 0.1, ease: "power2.out" },
    bounces[1],
  );
  tl.to(
    ball,
    { y: target.y, duration: 0.1, ease: "power2.in" },
    bounces[1] + 0.1,
  );
  bounces.forEach((at, index) => {
    tl.fromTo(
      ball,
      { scaleX: 1.35, scaleY: 0.65 },
      {
        scaleX: 1,
        scaleY: 1,
        duration: 0.12,
        ease: "power2.out",
        immediateRender: false,
      },
      at,
    );
    cues.push({ time: at, sound: "boop", pitch: [1, 1.25, 1.5][index] });
  });
  cues.push({ time: bounces[2] + 0.02, sound: "chime" });
  // Once the dot is in place, the word gives a little happy wave.
  tl.fromTo(
    letters,
    { y: 0 },
    {
      keyframes: [
        { y: -18, duration: 0.14, ease: "power2.out" },
        { y: 0, duration: 0.22, ease: "power2.in" },
      ],
      stagger: 0.05,
      immediateRender: false,
    },
    bounces[2] + 0.05,
  );
  duration = Math.max(duration, bounces[2] + 1.6);
}

// ── Start ─────────────────────────────────────────────────────────────────────────────
const family = css("--font-title");
await Promise.all([
  document.fonts.load(`800 120px ${family}`),
  document.fonts.load(`700 26px ${family}`),
  document.fonts.load(`600 150px ${family}`, "bıentôt"),
  document.fonts.load(`500 40px ${css("--font-text")}`),
]);
if (variant === "d") variantImpact();
else await variantCube();
tl.seek(0);

/** Sets the video to a time, in seconds, and draws its scenes. */
async function seek(time: number) {
  tl.seek(time, false);
  await draw(time);
}

declare global {
  interface Window {
    story: {
      duration: number;
      cues: Cue[];
      seek: (time: number) => Promise<void>;
      /** The samples of its sound at 48 kHz, if it has one. */
      sound: () => Float32Array | null;
    };
  }
}
window.story = {
  duration,
  cues,
  seek,
  sound: () => (cues.length ? synthesize(cues, duration) : null),
};

// ?controlled=1: the page of the supports or render.mjs drives the time; ?t=4.5 holds one
// frame; otherwise the video loops, with a second of its last frame.
const held = params.get("t");
if (held !== null) await seek(Number(held));
else if (!params.has("controlled")) {
  const begin = performance.now();
  let busy = false;
  const loop = (now: number) => {
    requestAnimationFrame(loop);
    if (busy) return;
    busy = true;
    const time = ((now - begin) / 1000) % (duration + 1);
    seek(Math.min(time, duration)).finally(() => (busy = false));
  };
  requestAnimationFrame(loop);
} else await seek(0);
document.documentElement.dataset.ready = "true";
