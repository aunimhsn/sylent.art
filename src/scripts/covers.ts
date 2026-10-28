// The animated covers (from docs/mockups/shared/covers.js): one small Three.js scene in each
// element marked .cover, named by its data-scene. Imported by the components that show covers:
// the domain cards and the cycle of a lesson of the home page. The scenes of the modules come
// with the offer list (step 8).
//
// A single renderer draws every scene, then each frame is copied into the canvas of its cover:
// one WebGL context for all the covers, and the covers follow their cards (reveal, flip). Only
// the covers on screen move, and a card under the pointer plays faster. Without motion, each
// scene draws one still frame. Without WebGL, the covers keep their grid.
import * as THREE from "three";

const motion = document.documentElement.dataset.motion === "on";

/** What a scene shows beside it (the cycle of a lesson), read by the page through CSS. */
interface SceneState {
  phase: number;
  progress: number;
  count: number;
  lap?: string;
}

interface Scene {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** The object that the text of the scene follows (the runner of the cycle of a lesson). */
  anchor?: THREE.Object3D;
  update(time: number): SceneState | void;
}

/** The material of a line, a dot or the outline of a block, which the orange can tint. */
type Tintable = THREE.Material & { color: THREE.Color; opacity: number };

// ── Helpers of the scenes ─────────────────────────────────────────────────────────────
const WHITE = 0xffffff;
const FILL = 0x151515;
const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
const ease = (x: number) => x * x * (3 - 2 * x);
const clamp = (x: number) => Math.min(1, Math.max(0, x));
const lineMaterial = (opacity: number) =>
  new THREE.LineBasicMaterial({ color: WHITE, transparent: true, opacity });
const outline = (geometry: THREE.BufferGeometry, opacity = 1, threshold = 10) =>
  new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, threshold),
    lineMaterial(opacity),
  );
/** A solid shape, filled with the dark of the cover and outlined in white. */
const block = (geometry: THREE.BufferGeometry, opacity = 1) => {
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: FILL }),
  );
  mesh.add(outline(geometry, opacity));
  return mesh;
};
const dot = (radius = 0.06, opacity = 1) =>
  new THREE.Mesh(
    new THREE.SphereGeometry(radius, 16, 12),
    new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity }),
  );
const polyline = (points: THREE.Vector3[], opacity = 1) =>
  new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(points),
    lineMaterial(opacity),
  );
const view = (
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

// The signal color of the site (orange), for a few elements of each scene: what moves, what is
// aimed at, what succeeds (docs/branding.md, Animated covers). On a block, its lines take the
// color; a line or a dot takes it whole.
const SIGNAL = new THREE.Color(
  getComputedStyle(document.documentElement)
    .getPropertyValue("--signal")
    .trim(),
);
const PLAIN = new THREE.Color(WHITE);
const tinted = (object: THREE.Object3D) => {
  const target =
    object instanceof THREE.Mesh && object.children[0]
      ? object.children[0]
      : object;
  return (target as THREE.Mesh | THREE.Line).material as Tintable;
};
const accent = <T extends THREE.Object3D>(object: T) => {
  tinted(object).color.copy(SIGNAL);
  return object;
};
/** From white (0) to the signal color (1): an element lights up when something reaches it. */
const glow = (object: THREE.Object3D, amount: number) =>
  tinted(object).color.copy(PLAIN).lerp(SIGNAL, clamp(amount));
/**
 * A trail of dots in the signal color that fade behind a moving point, given in the space of
 * the parent; it starts again after a jump (the start of a new loop).
 */
const trail = (
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

// ── The scenes ────────────────────────────────────────────────────────────────────────
const SCENES: Record<string, () => Scene> = {
  // Initiation: a little robot finds its way on a grid, step by step, as in Robomind.
  steps() {
    const scene = new THREE.Scene();
    scene.add(new THREE.GridHelper(6, 6, 0x5a5a5a, 0x2a2a2a));
    const path: [number, number][] = [
      [-1.5, -1.5],
      [-0.5, -1.5],
      [0.5, -1.5],
      [0.5, -0.5],
      [0.5, 0.5],
      [1.5, 0.5],
      [1.5, 1.5],
    ];
    scene.add(
      polyline(
        path.map(([x, z]) => v(x, 0.01, z)),
        0.35,
      ),
    );
    const goal = accent(
      outline(new THREE.CylinderGeometry(0.34, 0.34, 0.02, 40), 0.9),
    );
    goal.position.set(1.5, 0.02, 1.5);
    scene.add(goal);
    const robot = block(new THREE.BoxGeometry(0.6, 0.6, 0.6));
    const eye = accent(dot(0.06));
    eye.position.set(0, 0.1, 0.31);
    robot.add(eye);
    scene.add(robot);
    const crumbs = trail(scene, 8, 0.035, 4);
    const last = path.length - 1;
    return {
      scene,
      camera: view(3.8, 4.9, 5.7),
      update(t) {
        const p = (t * 1.1) % (last + 2);
        const done = p >= last;
        const i = done ? last - 1 : Math.floor(p);
        const f = done ? 1 : ease(p - i);
        const [ax, az] = path[i];
        const [bx, bz] = path[i + 1];
        robot.position.set(
          ax + (bx - ax) * f,
          0.3 + (done ? 0 : Math.sin(f * Math.PI) * 0.25),
          az + (bz - az) * f,
        );
        robot.rotation.y = Math.atan2(bx - ax, bz - az);
        goal.scale.setScalar(
          done ? 1 + Math.sin(((p - last) / 2) * Math.PI) * 0.5 : 1,
        );
        glow(robot, done ? Math.sin(((p - last) / 2) * Math.PI) : 0);
        crumbs(v(robot.position.x, 0.03, robot.position.z), !done);
      },
    };
  },
  // Web: the layers of a page (structure, style, behavior) pulled apart.
  web() {
    const scene = new THREE.Scene();
    const stack = new THREE.Group();
    scene.add(stack);
    let behavior: THREE.Object3D | undefined;
    const pages = [0, 1, 2].map((index) => {
      const page = new THREE.Group();
      const w = 3.2;
      const h = 2.1;
      const front = index === 2;
      page.add(block(new THREE.PlaneGeometry(w, h), front ? 1 : 0.45));
      page.add(
        polyline(
          [v(-w / 2, h / 2 - 0.3, 0.01), v(w / 2, h / 2 - 0.3, 0.01)],
          front ? 0.6 : 0.3,
        ),
      );
      [0, 1, 2].forEach((k) => {
        const light =
          front && k === 0 ? accent(dot(0.05)) : dot(0.045, front ? 0.9 : 0.4);
        light.position.set(-w / 2 + 0.2 + k * 0.15, h / 2 - 0.15, 0.01);
        page.add(light);
      });
      [
        [0.35, 1.6],
        [0.1, 2.2],
        [-0.15, 1.2],
      ].forEach(([y, length]) =>
        page.add(
          polyline(
            [v(-1.35, y, 0.01), v(-1.35 + length, y, 0.01)],
            front ? 0.7 : 0.3,
          ),
        ),
      );
      const box = outline(
        new THREE.PlaneGeometry(1.1, 0.6),
        front ? 0.8 : 0.35,
      );
      box.position.set(0.85, -0.6, 0.01);
      page.add(box);
      if (front) behavior = box;
      stack.add(page);
      return page;
    });
    return {
      scene,
      camera: view(0, 0.5, 6.4, [0, 0, -0.6]),
      update(t) {
        const spread = 0.6 + Math.sin(t * 0.9) * 0.3;
        pages.forEach((page, i) =>
          page.position.set((i - 1) * 0.35, (i - 1) * -0.2, (i - 2) * spread),
        );
        if (behavior) glow(behavior, (spread - 0.6) / 0.3);
        stack.rotation.set(-0.12, -0.55 + Math.sin(t * 0.5) * 0.2, 0);
      },
    };
  },
  // Python and data: a field of bars rising and falling like live data.
  chart() {
    const scene = new THREE.Scene();
    scene.add(new THREE.GridHelper(5, 5, 0x4a4a4a, 0x262626));
    const unit = new THREE.BoxGeometry(0.5, 1, 0.5);
    unit.translate(0, 0.5, 0);
    const bars: [THREE.Mesh, number, number][] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const bar = block(unit, 0.85);
        bar.position.set((i - 1.5) * 0.85, 0, (j - 1.5) * 0.85);
        scene.add(bar);
        bars.push([bar, i, j]);
      }
    }
    return {
      scene,
      camera: view(4.3, 3.8, 5.5, [0, 0.55, 0]),
      update(t) {
        bars.forEach(([bar, i, j]) => {
          bar.scale.y =
            0.2 +
            1.6 *
              (0.5 + 0.5 * Math.sin(t * 1.4 + i * 0.7 + j * 1.1)) *
              (0.4 + (i + j) / 10);
          glow(bar, (bar.scale.y - 1.45) / 0.3);
        });
      },
    };
  },
  // Databases: a stack of disks, with a ring of records moving around it.
  database() {
    const scene = new THREE.Scene();
    const disk = new THREE.CylinderGeometry(1.2, 1.2, 0.42, 64);
    const disks = [0, 1, 2].map(() => {
      const mesh = block(disk, 0.95);
      scene.add(mesh);
      return mesh;
    });
    const ring = new THREE.Group();
    const found = accent(dot(0.065));
    for (let k = 0; k < 16; k++) {
      const record = k === 0 ? found : dot(0.045, 0.9);
      const angle = (k / 16) * Math.PI * 2;
      record.position.set(Math.cos(angle) * 1.75, 0, Math.sin(angle) * 1.75);
      ring.add(record);
    }
    scene.add(ring);
    const wake = trail(scene, 9, 0.05, 2);
    const where = v(0, 0, 0);
    return {
      scene,
      camera: view(0, 2.5, 7, [0, 0.25, 0]),
      update(t) {
        disks.forEach((mesh, i) => {
          mesh.position.y = (i - 1) * 0.62 + Math.sin(t * 1.6 + i) * 0.06;
        });
        ring.rotation.y = -t * 0.6;
        ring.position.y = Math.sin(t * 0.8) * 0.7;
        ring.updateMatrixWorld(true);
        wake(found.getWorldPosition(where));
      },
    };
  },
  // Method and tests: a Git graph, a branch that leaves the main line and merges back, tested.
  branch() {
    const scene = new THREE.Scene();
    const graph = new THREE.Group();
    scene.add(graph);
    const main = new THREE.LineCurve3(v(-2.6, -0.5), v(2.6, -0.5));
    const feature = new THREE.CatmullRomCurve3([
      v(-1.6, -0.5),
      v(-0.9, 0.55, 0.3),
      v(0.9, 0.55, 0.3),
      v(1.6, -0.5),
    ]);
    graph.add(
      polyline(main.getPoints(2), 0.7),
      polyline(feature.getPoints(48), 0.7),
    );
    const commits = [
      ...[-2.2, -1.6, -0.4, 0.6, 1.6, 2.2].map((x) => v(x, -0.5)),
      ...[0.2, 0.5, 0.8].map((u) => feature.getPoint(u)),
    ].map((point) => {
      const commit = dot(0.1);
      commit.position.copy(point);
      graph.add(commit);
      return commit;
    });
    const pulses = [dot(0.06, 0.8), accent(dot(0.07))];
    graph.add(...pulses);
    const wake = trail(graph, 7, 0.05, 2);
    const check = accent(polyline([v(-0.2, 0), v(-0.06, -0.15), v(0.24, 0.2)]));
    check.position.set(2.2, 0.05, 0);
    graph.add(check);
    return {
      scene,
      camera: view(0, 0.4, 6.6),
      update(t) {
        pulses[0].position.copy(main.getPoint((t * 0.25) % 1));
        const u = (t * 0.32) % 1;
        pulses[1].position.copy(feature.getPoint(u));
        wake(pulses[1].position);
        commits.forEach((commit, k) =>
          commit.scale.setScalar(
            1 + Math.max(0, Math.sin(t * 2 - k * 0.7)) * 0.4,
          ),
        );
        glow(commits[1], 1 - u * 8);
        glow(commits[4], (u - 0.88) / 0.12);
        check.material.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.5));
        graph.rotation.set(0.15, Math.sin(t * 0.4) * 0.35, 0);
      },
    };
  },
  // AI: a small neural network, with signals running through its links.
  network() {
    const scene = new THREE.Scene();
    const net = new THREE.Group();
    scene.add(net);
    const layers = [3, 5, 5, 2].map((count, l) =>
      Array.from({ length: count }, (_, k) =>
        v(
          (l - 1.5) * 1.35,
          (k - (count - 1) / 2) * 0.55,
          Math.sin(k * 1.7 + l) * 0.25,
        ),
      ),
    );
    const links = layers
      .slice(0, -1)
      .flatMap((layer, l) =>
        layer.flatMap((a) => layers[l + 1].map((b) => [a, b, l] as const)),
      );
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(
        links.flatMap(([a, b]) => [a.x, a.y, a.z, b.x, b.y, b.z]),
        3,
      ),
    );
    net.add(new THREE.LineSegments(geometry, lineMaterial(0.18)));
    const neurons = new Map(
      layers.flat().map((point) => {
        const neuron = dot(0.09);
        neuron.position.copy(point);
        net.add(neuron);
        return [point, neuron];
      }),
    );
    const outputs = layers[3].map((point) => neurons.get(point)!);
    // Each signal crosses the network layer by layer, on links chosen by a fixed sequence.
    const signals = Array.from({ length: 8 }, (_, k) => {
      const lit = k % 4 === 0;
      const mesh = lit ? accent(dot(0.06)) : dot(0.05);
      net.add(mesh);
      return {
        mesh,
        seed: k * 5 + 3,
        wake: lit ? trail(net, 6, 0.045, 2) : null,
      };
    });
    return {
      scene,
      camera: view(0, 0, 6.4),
      update(t) {
        outputs.forEach((neuron) => glow(neuron, 0));
        signals.forEach((signal) => {
          const p = (t * 0.7 + signal.seed * 0.37) % 3;
          const l = Math.floor(p);
          const choices = links.filter((link) => link[2] === l);
          const [a, b] =
            choices[
              (signal.seed * 7 + Math.floor(t * 0.7 + signal.seed * 0.37) * 3) %
                choices.length
            ];
          signal.mesh.position.lerpVectors(a, b, p - l);
          if (!signal.wake) return;
          signal.wake(signal.mesh.position);
          if (l === 2 && p - l > 0.8) glow(neurons.get(b)!, (p - l - 0.8) * 5);
        });
        net.rotation.y = Math.sin(t * 0.35) * 0.5;
      },
    };
  },
  // Project management: a Scrum board where a card moves from one column to the next.
  board() {
    const scene = new THREE.Scene();
    const board = new THREE.Group();
    scene.add(board);
    const columns = [-1.5, 0, 1.5];
    columns.forEach((x) => {
      const column = outline(new THREE.PlaneGeometry(1.3, 2.6), 0.4);
      column.position.x = x;
      board.add(column, polyline([v(x - 0.65, 1.0), v(x + 0.65, 1.0)], 0.4));
    });
    const card = new THREE.BoxGeometry(1.0, 0.32, 0.06);
    [
      [0, 0.6],
      [0, 0.15],
      [1, 0.6],
      [2, 0.6],
      [2, 0.15],
      [2, -0.3],
    ].forEach(([c, y]) => {
      const still = block(card, 0.5);
      still.position.set(columns[c], y, 0.05);
      board.add(still);
    });
    const mover = block(card);
    board.add(mover);
    const stops = [
      v(columns[0], -0.3, 0.05),
      v(columns[1], -0.3, 0.05),
      v(columns[2], -0.75, 0.05),
    ];
    return {
      scene,
      camera: view(0.7, 0.5, 5.7),
      update(t) {
        const p = (t * 0.5) % 3;
        const leg = Math.floor(p);
        const f = ease(Math.min(1, (p - leg) * 1.5));
        glow(mover, leg < 2 ? 0.3 + 0.7 * Math.sin(f * Math.PI) : 1 - (p - 2));
        if (leg < 2) {
          mover.position.lerpVectors(stops[leg], stops[leg + 1], f);
          mover.position.z += Math.sin(f * Math.PI) * 0.5;
          mover.rotation.z = Math.sin(f * Math.PI) * 0.12;
        } else {
          mover.position.copy(stops[2]);
          mover.rotation.z = 0;
        }
        board.rotation.set(-0.1, -0.25 + Math.sin(t * 0.4) * 0.12, 0);
      },
    };
  },
  // Software design: the plan of a part drawn line by line, then the part takes shape.
  blueprint() {
    const scene = new THREE.Scene();
    const grid = new THREE.GridHelper(6, 12, 0x3a3a3a, 0x222222);
    grid.position.y = -0.6;
    scene.add(grid);
    const group = new THREE.Group();
    scene.add(group);
    const shape = new THREE.BoxGeometry(1.8, 1.1, 1.1);
    // The part, drawn before its lines, so that it hides the lines behind it once it appears.
    const body = new THREE.Mesh(
      shape,
      new THREE.MeshBasicMaterial({
        color: FILL,
        transparent: true,
        opacity: 0,
      }),
    );
    body.renderOrder = -1;
    group.add(body);
    const corners = new THREE.EdgesGeometry(shape).attributes.position;
    const lines = Array.from({ length: corners.count / 2 }, (_, k) => {
      const a = new THREE.Vector3().fromBufferAttribute(corners, 2 * k);
      const b = new THREE.Vector3().fromBufferAttribute(corners, 2 * k + 1);
      const line = polyline([v(0, 0), b.clone().sub(a)]);
      line.position.copy(a);
      group.add(line);
      return [line, a, b] as const;
    });
    const pen = accent(dot(0.06));
    group.add(pen);
    return {
      scene,
      camera: view(3.2, 2.4, 4.6, [0, -0.1, 0]),
      update(t) {
        const cycle = (t * 0.22) % 1;
        const drawn = clamp(cycle / 0.6) * lines.length;
        const shown = ease(clamp((cycle - 0.6) / 0.12));
        const out = 1 - ease(clamp((cycle - 0.92) / 0.08));
        lines.forEach(([line], k) => {
          const f = clamp(drawn - k);
          line.visible = f > 0;
          line.scale.setScalar(Math.max(0.001, f));
          line.material.opacity = out;
          glow(line, shown * (1 - clamp((cycle - 0.75) / 0.17)));
        });
        const k = Math.min(lines.length - 1, Math.floor(drawn));
        pen.visible = cycle < 0.6;
        pen.position.copy(lines[k][1]).lerp(lines[k][2], clamp(drawn - k));
        body.visible = shown > 0;
        body.material.opacity = 0.95 * shown * out;
        group.rotation.y = 0.5 + t * 0.15;
      },
    };
  },
  // ── The cycle of a lesson (pedagogy of the home page) ──
  // Theory 20 %, practice 50 %, correction 30 %, then again, as a spiral that climbs a step at
  // each turn, without end. The spiral slides down as the runner climbs, so that the runner
  // stays at the same height; the page fades the spiral out toward the bottom and in toward the
  // top, where the turns are swapped, so that the loop has no seam. Behind the runner the turns
  // done in white and the session under way in the signal color, above it the turns to come,
  // faint. The scene reports its phase, and names its runner, which the name of the phase
  // follows. The cycle starts mid-practice, so that a still scene shows the practice.
  spiral() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    const radius = 1.35;
    const pitch = 0.62;
    const below = 4;
    const above = 4;
    const steps = 160;
    const at = (u: number) =>
      v(
        Math.cos(Math.PI / 2 - u * Math.PI * 2) * radius,
        u * pitch,
        -Math.sin(Math.PI / 2 - u * Math.PI * 2) * radius,
      );
    const path = Array.from({ length: (below + above) * steps + 1 }, (_, i) =>
      at(i / steps - below),
    );
    const faint = polyline(path, 0.18);
    const done = polyline(path, 0.75);
    const lit = accent(polyline(path));
    group.add(faint, done, lit);
    const starts = [0, 0.2, 0.7];
    const shares = [0.2, 0.5, 0.3];
    // A small mark where each phase starts, on every turn; it brightens once passed.
    const marks: [
      THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>,
      number,
    ][] = [];
    for (let k = -below; k < above; k++) {
      starts.forEach((start) => {
        const mark = dot(0.035, 0.35);
        mark.position.copy(at(k + start));
        group.add(mark);
        marks.push([mark, k + start]);
      });
    }
    const runner = accent(dot(0.06));
    group.add(runner);
    const wake = trail(group, 8, 0.04, 3);
    let lastLap: number | undefined;
    let shownLap: string | undefined;
    return {
      scene,
      camera: view(5.4, 3.0, 7.0, [0, 0, 0]),
      anchor: runner,
      update(t) {
        // In turns, 10 s each; a still scene stands mid-practice.
        const time = t * 0.1 + 0.32;
        const lap = Math.floor(time);
        const u = time - lap;
        const phase = u < 0.2 ? 0 : u < 0.7 ? 1 : 2;
        // Each turn is a session. A new one starts: its tag shows once (two tags take turns, so
        // that it plays again), and the trail follows the step down of the spiral.
        const newLap = lastLap !== undefined && lap > lastLap;
        if (newLap) shownLap = String(lap % 2);
        lastLap = lap;
        done.geometry.setDrawRange(0, below * steps + 1);
        lit.geometry.setDrawRange(
          below * steps,
          Math.max(2, Math.round(u * steps) + 1),
        );
        marks.forEach(([mark, place]) => {
          mark.material.opacity = place <= u ? 0.8 : 0.35;
        });
        runner.position.copy(at(u));
        wake(runner.position, true, newLap ? v(0, pitch, 0) : null);
        group.position.y = -u * pitch;
        group.rotation.y = Math.sin(t * 0.25) * 0.15;
        // What the page shows beside the scene: the phase, how far it has gone (0 to 1), and
        // the share of the turn done in it, in whole percent (up to 20, 50 or 30). Still, the
        // practice shows its whole share.
        const progress = motion ? (u - starts[phase]) / shares[phase] : 0.5;
        const count = motion
          ? Math.min(
              shares[phase] * 100,
              Math.floor((u - starts[phase]) * 100) + 1,
            )
          : 50;
        return { phase, progress, count, lap: shownLap };
      },
    };
  },
};

// ── The renderer shared by every cover ────────────────────────────────────────────────
function start(renderer: THREE.WebGLRenderer) {
  const dpr = Math.min(devicePixelRatio, 2);
  const items = [
    ...document.querySelectorAll<HTMLElement>(".cover[data-scene]"),
  ].flatMap((cover) => {
    const make = SCENES[cover.dataset.scene ?? ""];
    const canvas = cover.querySelector("canvas");
    const context = canvas?.getContext("2d");
    if (!make || !canvas || !context) return [];
    return [
      {
        cover,
        canvas,
        context,
        card: cover.closest(".card"),
        time: 1.3,
        visible: true,
        ...make(),
      },
    ];
  });
  type Item = (typeof items)[number];
  // The renderer grows to the largest cover, and each cover takes its part from the bottom left.
  let room = [0, 0];
  const anchor = new THREE.Vector3();

  function draw(item: Item) {
    const width = Math.round(item.cover.clientWidth * dpr);
    const height = Math.round(item.cover.clientHeight * dpr);
    if (!width || !height) return;
    if (item.canvas.width !== width || item.canvas.height !== height) {
      item.canvas.width = width;
      item.canvas.height = height;
      item.camera.aspect = width / height;
      item.camera.updateProjectionMatrix();
    }
    if (room[0] < width || room[1] < height) {
      room = [Math.max(room[0], width), Math.max(room[1], height)];
      renderer.setSize(room[0], room[1], false);
    }
    // A scene may return what it shows (the cycle of a lesson), for the text beside it: its
    // phase and new session as data attributes, how far the phase has gone and its count as
    // properties.
    const state = item.update(item.time);
    if (state) {
      const { phase, progress, count, lap } = state;
      if (item.cover.dataset.phase !== String(phase))
        item.cover.dataset.phase = String(phase);
      if (lap !== undefined && item.cover.dataset.lap !== lap)
        item.cover.dataset.lap = lap;
      item.cover.style.setProperty("--phase-progress", progress.toFixed(3));
      item.cover.style.setProperty("--count", String(count));
    }
    renderer.setViewport(0, 0, width, height);
    renderer.setScissor(0, 0, width, height);
    renderer.setScissorTest(true);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(item.scene, item.camera);
    // A scene may also name the object that its text follows: its place in the cover, in
    // percent.
    if (item.anchor) {
      const point = item.anchor.getWorldPosition(anchor).project(item.camera);
      item.cover.style.setProperty("--anchor-x", `${(point.x + 1) * 50}%`);
      item.cover.style.setProperty("--anchor-y", `${(1 - point.y) * 50}%`);
    }
    item.context.clearRect(0, 0, width, height);
    item.context.drawImage(
      renderer.domElement,
      0,
      room[1] - height,
      width,
      height,
      0,
      0,
      width,
      height,
    );
  }

  if (motion) {
    const watcher = new IntersectionObserver((entries) =>
      entries.forEach((entry) => {
        const item = items.find(
          (candidate) => candidate.cover === entry.target,
        );
        if (item) item.visible = entry.isIntersecting;
      }),
    );
    items.forEach((item) => watcher.observe(item.cover));
    const timer = new THREE.Timer();
    renderer.setAnimationLoop((now) => {
      timer.update(now);
      const delta = Math.min(timer.getDelta(), 0.1);
      items.forEach((item) => {
        if (!item.visible) return;
        item.time += delta * (item.card?.matches(":hover") ? 2.2 : 1);
        draw(item);
      });
    });
  } else {
    items.forEach((item) =>
      new ResizeObserver(() => draw(item)).observe(item.cover),
    );
  }
}

if (document.querySelector(".cover[data-scene]")) {
  try {
    start(new THREE.WebGLRenderer({ antialias: true, alpha: true }));
  } catch {
    // No WebGL: the covers keep their grid.
  }
}
