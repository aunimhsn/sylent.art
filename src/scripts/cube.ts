// The cube of the hero of the home page (from docs/mockups/home-site.html): a quality or a figure
// on each face, read from data-faces on its canvas, inside a shell of orange edges.
//
// The first face may show the owner's face instead of a word (data-photo): the cube presents it
// first and holds it longer.
//
// It presents its faces one after the other, squarely, in the order of the messages. Under the
// mouse it follows the pointer (to the right it shows its right face, at the edges its back, top
// and bottom), and resumes from the nearest face when the mouse leaves. A drag spins it, and the
// scroll turns it a little more. Without motion, it draws one still frame; without WebGL, the
// hero keeps its grid.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

const root = document.documentElement;
const motion = root.dataset.motion === "on";
const css = (name: string) =>
  getComputedStyle(root).getPropertyValue(name).trim();

const canvas = document.getElementById("cube-canvas") as HTMLCanvasElement;
const area = document.getElementById("cube-area") as HTMLElement;
const hero = document.getElementById("hero") as HTMLElement;
const faces: [string, string][] = JSON.parse(canvas.dataset.faces ?? "[]");
const photoSource = canvas.dataset.photo;

let renderer: THREE.WebGLRenderer | undefined;
try {
  // Without motion, one frame is drawn: keep it, so that it survives the compositing.
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: !motion,
  });
} catch {
  canvas.remove();
}

if (renderer) start(renderer);

async function start(renderer: THREE.WebGLRenderer) {
  const family = css("--font-title");
  // The faces are painted with the title font. A face of the list that fails to load (the
  // metric fallback names a local font the system may not have) must not stop the cube.
  await Promise.allSettled([
    document.fonts.load(`800 120px ${family}`),
    document.fonts.load(`700 24px ${family}`),
  ]);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 14);
  const photo = photoSource ? await photoOval(photoSource) : undefined;

  // A face: its small label at the top, its large word at the bottom over a short rule, or the
  // owner's face, on a faint grid, in the colors of the covers (src/styles/tokens.css).
  function faceTexture([small, big]: [string, string], index: number) {
    const size = 512;
    const paint = document.createElement("canvas");
    paint.width = paint.height = size;
    const g = paint.getContext("2d")!;
    g.fillStyle = css("--cover-bg");
    g.fillRect(0, 0, size, size);
    g.strokeStyle = css("--cover-line");
    for (let x = 0; x <= size; x += 32) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x, size);
      g.stroke();
      g.beginPath();
      g.moveTo(0, x);
      g.lineTo(size, x);
      g.stroke();
    }
    const withPhoto = photoSource !== undefined && index === 0;
    if (withPhoto && photo) {
      const height = size * 0.84;
      const width = (photo.width / photo.height) * height;
      g.drawImage(photo, (size - width) / 2, size - height, width, height);
    }
    g.fillStyle = css("--secondary");
    g.font = `700 24px ${family}`;
    g.letterSpacing = "4px";
    g.textBaseline = "top";
    g.fillText(small.toUpperCase(), 48, 52);
    if (withPhoto) return textureOf(paint);
    g.letterSpacing = "-4px";
    g.fillStyle = css("--text");
    let fontSize = 160;
    do {
      g.font = `800 ${fontSize}px ${family}`;
      fontSize -= 4;
    } while (g.measureText(big).width > size - 96);
    g.textBaseline = "alphabetic";
    g.fillText(big, 44, size - 70);
    g.fillRect(48, size - 50, 72, 8);
    return textureOf(paint);
  }

  function textureOf(paint: HTMLCanvasElement) {
    const texture = new THREE.CanvasTexture(paint);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return texture;
  }

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const cube = new THREE.Mesh(
    geometry,
    faces.map(
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
  // The shell around the cube: its edges only, in the translucent signal color, so that the
  // cube shows clearly inside.
  const shell = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(2.7, 2.7, 2.7)),
    new THREE.LineBasicMaterial({
      color: new THREE.Color(css("--signal")),
      transparent: true,
      opacity: 0.4,
    }),
  );
  const rig = new THREE.Group();
  rig.add(cube, shell);
  scene.add(rig);

  // The canvas covers the hero; the cube stands on the visual area, whatever the layout.
  function layout() {
    const box = hero.getBoundingClientRect();
    const spot = area.getBoundingClientRect();
    renderer.setSize(box.width, box.height, false);
    camera.aspect = box.width / box.height;
    camera.updateProjectionMatrix();
    const height =
      2 *
      Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) *
      camera.position.z;
    const unit = height / box.height;
    rig.position.x =
      (spot.left + spot.width / 2 - box.left - box.width / 2) * unit;
    rig.position.y =
      -(spot.top + spot.height / 2 - box.top - box.height / 2) * unit + 0.2;
    rig.scale.setScalar(
      (Math.min(spot.width, spot.height) * unit) /
        (box.width < 900 ? 3.9 : 4.6),
    );
  }
  layout();

  const state = { scroll: 0, scale: motion ? 0 : 1 };
  const lean = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(0.28, -0.42, 0),
  );
  // The turns that bring each face to the front, in the order of the messages.
  const faceTurns = [
    [0, -Math.PI / 2],
    [Math.PI / 2, 0],
    [0, 0],
    [0, Math.PI / 2],
    [-Math.PI / 2, 0],
    [0, Math.PI],
  ];
  const faceViews = faceTurns.map(([x, y]) =>
    lean
      .clone()
      .multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, 0))),
  );
  // The photo face holds longer, the first time from the end of the scale-in (0.5 + 1.6 s).
  const holdOf = (index: number) => (photoSource && index === 0 ? 5 : 3.2);
  let face = 0;
  let nextFace = photoSource ? 2.1 + 4.5 : 3.2;
  const presented = faceViews[0].clone();
  const followed = new THREE.Quaternion();
  const scrollTurn = new THREE.Quaternion();
  let drag: { x: number; y: number } | null = null;
  let follow: { x: number; y: number; base: THREE.Quaternion } | null = null;
  const timer = new THREE.Timer();

  function frame() {
    const time = timer.getElapsed();
    if (motion) {
      if (follow) presented.slerp(followed, 0.1);
      else if (!drag) {
        if (time >= nextFace) {
          face = (face + 1) % faceViews.length;
          nextFace = time + holdOf(face);
        }
        presented.slerp(faceViews[face], 0.06);
      }
      shell.rotation.x = -time * 0.15;
      shell.rotation.y = time * 0.11;
    }
    scrollTurn.setFromEuler(
      new THREE.Euler(state.scroll * 0.6, state.scroll * 1.4, 0),
    );
    cube.quaternion.copy(scrollTurn).multiply(presented);
    cube.scale.setScalar(state.scale);
    renderer.render(scene, camera);
  }

  if (!motion) {
    new ResizeObserver(() => {
      layout();
      frame();
    }).observe(hero);
    return;
  }
  new ResizeObserver(layout).observe(hero);

  // The pointer from -1 to 1 across the area of the cube.
  const across = (event: PointerEvent) => {
    const spot = area.getBoundingClientRect();
    return [
      ((event.clientX - spot.left) / spot.width) * 2 - 1,
      ((event.clientY - spot.top) / spot.height) * 2 - 1,
    ];
  };
  area.addEventListener("pointerdown", (event) => {
    drag = { x: event.clientX, y: event.clientY };
    follow = null;
    area.setPointerCapture(event.pointerId);
  });
  area.addEventListener("pointermove", (event) => {
    if (drag) {
      const turn = new THREE.Euler(
        (event.clientY - drag.y) * 0.009,
        (event.clientX - drag.x) * 0.009,
        0,
      );
      presented.premultiply(new THREE.Quaternion().setFromEuler(turn));
      drag = { x: event.clientX, y: event.clientY };
      return;
    }
    if (event.pointerType !== "mouse") return;
    const [nx, ny] = across(event);
    // The first move sets the start, so that the cube doesn't jump when the pointer comes in.
    if (!follow) follow = { x: nx, y: ny, base: presented.clone() };
    const turn = new THREE.Euler(
      (ny - follow.y) * (Math.PI / 2),
      (nx - follow.x) * Math.PI,
      0,
    );
    followed.setFromEuler(turn).multiply(follow.base);
  });
  const release = () => {
    drag = null;
    nextFace = timer.getElapsed() + 2.5;
  };
  area.addEventListener("pointerup", release);
  area.addEventListener("pointercancel", release);
  area.addEventListener("pointerleave", () => {
    follow = null;
    // Resume from the face that is nearest to what the visitor is looking at.
    face = faceViews.reduce(
      (best, view, index) =>
        Math.abs(view.dot(presented)) > Math.abs(faceViews[best].dot(presented))
          ? index
          : best,
      0,
    );
    nextFace = timer.getElapsed() + 2;
  });

  // Only while the hero is on screen.
  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  }).observe(hero);
  renderer.setAnimationLoop((now) => {
    timer.update(now);
    if (visible) frame();
  });

  gsap.registerPlugin(ScrollTrigger);
  gsap.to(state, {
    scale: 1,
    duration: 1.6,
    delay: 0.5,
    ease: "elastic.out(1, 0.6)",
  });
  const leaving = { trigger: hero, start: "top top", end: "bottom top" };
  gsap.to(state, {
    scroll: 1,
    ease: "none",
    scrollTrigger: { ...leaving, scrub: 0.6 },
  });
  gsap.to(canvas, {
    yPercent: 18,
    autoAlpha: 0.2,
    ease: "none",
    scrollTrigger: { ...leaving, scrub: true },
  });
}

// The owner's face in an oval that fades into the grid of its face; nothing if it fails to load.
async function photoOval(source: string) {
  const image = new Image();
  image.src = source;
  try {
    await image.decode();
  } catch {
    return undefined;
  }
  const oval = document.createElement("canvas");
  const { naturalWidth: width, naturalHeight: height } = image;
  oval.width = width;
  oval.height = height;
  const g = oval.getContext("2d")!;
  g.drawImage(image, 0, 0);
  const fade = g.createRadialGradient(0, 0, 0, 0, 0, 1);
  fade.addColorStop(0.55, "#000000");
  fade.addColorStop(1, "transparent");
  // The unit circle stretched over the oval: centered, a little above the middle.
  g.setTransform(width * 0.5, 0, 0, height * 0.62, width * 0.5, height * 0.38);
  g.globalCompositeOperation = "destination-in";
  g.fillStyle = fade;
  g.fillRect(-1, -1, 2, 2);
  return oval;
}
