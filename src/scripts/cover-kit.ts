// The types and helpers shared by the scenes of the covers (src/scripts/covers.ts and
// src/scripts/module-scenes.ts): the shapes they are built from, in the colors of the tokens.
import * as THREE from "three";

/** What a scene shows beside it (the cycle of a lesson), read by the page through CSS. */
export interface SceneState {
  phase: number;
  progress: number;
  count: number;
  lap?: string;
}

export interface Scene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** The object that the text of the scene follows (the runner of the cycle of a lesson). */
  anchor?: THREE.Object3D;
  update(time: number): SceneState | void;
}

/** The material of a line, a dot or the outline of a block, which the orange can tint. */
type Tintable = THREE.Material & { color: THREE.Color; opacity: number };

// ── Colors, from the tokens (src/styles/tokens.css) ──────────────────────────────────
const css = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const COVER = new THREE.Color(css("--cover-bg"));
export const WHITE = new THREE.Color(css("--text"));

/**
 * A gray between the background of the covers (0) and the text (1), mixed in sRGB as CSS
 * would: the fill of the blocks and the lines of the grids of the scenes.
 */
export const gray = (amount: number) => {
  const [from, to] = [COVER, WHITE].map((color) =>
    color.getRGB({ r: 0, g: 0, b: 0 }, THREE.SRGBColorSpace),
  );
  return new THREE.Color().setRGB(
    from.r + (to.r - from.r) * amount,
    from.g + (to.g - from.g) * amount,
    from.b + (to.b - from.b) * amount,
    THREE.SRGBColorSpace,
  );
};
/** The fill of a block, a little lighter than the cover, so that it hides what is behind. */
export const FILL = gray(0.02);

// The signal color of the site (orange), for a few elements of each scene: what moves, what is
// aimed at, what succeeds (docs/branding.md, Animated covers). On a block, its lines take the
// color; a line or a dot takes it whole.
const SIGNAL = new THREE.Color(css("--signal"));

// ── Helpers of the scenes ─────────────────────────────────────────────────────────────
export const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
export const ease = (x: number) => x * x * (3 - 2 * x);
export const clamp = (x: number) => Math.min(1, Math.max(0, x));
export const lineMaterial = (opacity: number) =>
  new THREE.LineBasicMaterial({ color: WHITE, transparent: true, opacity });
export const outline = (
  geometry: THREE.BufferGeometry,
  opacity = 1,
  threshold = 10,
) =>
  new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, threshold),
    lineMaterial(opacity),
  );
/** A solid shape, filled with the dark of the cover and outlined in white. */
export const block = (geometry: THREE.BufferGeometry, opacity = 1) => {
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: FILL }),
  );
  mesh.add(outline(geometry, opacity));
  return mesh;
};
export const dot = (radius = 0.06, opacity = 1) =>
  new THREE.Mesh(
    new THREE.SphereGeometry(radius, 16, 12),
    new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity }),
  );
export const polyline = (points: THREE.Vector3[], opacity = 1) =>
  new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    lineMaterial(opacity),
  );
/** A circle of lines around the origin, in the plane of x and y. */
export const circle = (radius: number, opacity = 1, segments = 64) =>
  polyline(
    Array.from({ length: segments + 1 }, (_, k) =>
      v(
        Math.cos((k / segments) * Math.PI * 2) * radius,
        Math.sin((k / segments) * Math.PI * 2) * radius,
      ),
    ),
    opacity,
  );
export const view = (
  x: number,
  y: number,
  z: number,
  look: [number, number, number] = [0, 0, 0],
) => {
  const camera = new THREE.PerspectiveCamera(32, 3 / 2, 0.1, 100);
  camera.position.set(x, y, z);
  camera.lookAt(...look);
  return camera;
};
/** The point at the fraction f of the length of a path. */
export const along = (points: THREE.Vector3[], f: number) => {
  const lengths = points
    .slice(1)
    .map((point, k) => point.distanceTo(points[k]));
  let left = f * lengths.reduce((sum, length) => sum + length, 0);
  for (let k = 0; k < lengths.length; k++) {
    if (left <= lengths[k]) {
      return points[k]
        .clone()
        .lerp(points[k + 1], lengths[k] ? left / lengths[k] : 0);
    }
    left -= lengths[k];
  }
  return points[points.length - 1].clone();
};
/** A fixed pseudo-random number between 0 and 1, so that a scene looks the same at each visit. */
export const random = (k: number) => {
  const x = Math.sin(k * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
/** The material of a line, a dot or the lines of a block, to light it up or fade it. */
export const tinted = (object: THREE.Object3D) => {
  const target =
    object instanceof THREE.Mesh && object.children[0]
      ? object.children[0]
      : object;
  return (target as THREE.Mesh | THREE.Line).material as Tintable;
};
export const accent = <T extends THREE.Object3D>(object: T) => {
  tinted(object).color.copy(SIGNAL);
  return object;
};
/** From white (0) to the signal color (1): an element lights up when something reaches it. */
export const glow = (object: THREE.Object3D, amount: number) =>
  tinted(object).color.copy(WHITE).lerp(SIGNAL, clamp(amount));
/**
 * A trail of dots in the signal color that fade behind a moving point, given in the space of
 * the parent; it starts again after a jump (the start of a new loop).
 */
export const trail = (
  parent: THREE.Object3D,
  count = 7,
  radius = 0.05,
  spacing = 2,
) => {
  const points = Array.from({ length: count }, (_, k) => {
    const point = accent(
      dot(radius * (1 - (k / count) * 0.6), 0.6 * (1 - k / count)),
    );
    point.visible = false;
    parent.add(point);
    return point;
  });
  const history: THREE.Vector3[] = [];
  // A scene that moves its frame under the point (the spiral) shifts the history with it.
  return (
    position: THREE.Vector3,
    visible = true,
    shift: THREE.Vector3 | null = null,
  ) => {
    if (shift) history.forEach((point) => point.sub(shift));
    if (history.length && history[0].distanceTo(position) > 0.5)
      history.length = 0;
    history.unshift(position.clone());
    if (history.length > count * spacing) history.length = count * spacing;
    points.forEach((point, k) => {
      const at = history[k * spacing];
      point.visible = visible && k > 0 && Boolean(at);
      if (at) point.position.copy(at);
    });
  };
};
