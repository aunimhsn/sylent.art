// The covers of the offer cards, shared by the pages that show domains (home, offer page,
// offer list): one small Three.js scene per domain, and the tilt of the cards under the pointer.
// Loaded as a module, after the content of the page and after GSAP, with the import map of three.
import * as THREE from "three";

const motion = document.documentElement.dataset.motion === "on";

// ── Covers of the offers: one small Three.js scene per domain ─────────────────────────
// A single renderer draws every scene, then each frame is copied into the canvas of its
// card: one WebGL context for all the covers, and the covers follow the cards (reveal, tilt).
let coverRenderer;
try {
  coverRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
} catch {
  coverRenderer = null;
}
if (coverRenderer) {
  const dpr = Math.min(devicePixelRatio, 2);
  const WHITE = 0xffffff;
  const FILL = 0x151515;
  const v = (x, y, z = 0) => new THREE.Vector3(x, y, z);
  const ease = x => x * x * (3 - 2 * x);
  const lineMaterial = opacity => new THREE.LineBasicMaterial({ color: WHITE, transparent: true, opacity });
  const outline = (geometry, opacity = 1, threshold = 10) => new THREE.LineSegments(new THREE.EdgesGeometry(geometry, threshold), lineMaterial(opacity));
  const block = (geometry, opacity = 1) => {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: FILL }));
    mesh.add(outline(geometry, opacity));
    return mesh;
  };
  const dot = (radius = 0.06, opacity = 1) => new THREE.Mesh(new THREE.SphereGeometry(radius, 16, 12), new THREE.MeshBasicMaterial({ color: WHITE, transparent: true, opacity }));
  const polyline = (points, opacity = 1) => new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), lineMaterial(opacity));
  const view = (x, y, z, look = [0, 0, 0]) => {
    const camera = new THREE.PerspectiveCamera(32, 3 / 2, 0.1, 100);
    camera.position.set(x, y, z);
    camera.lookAt(...look);
    return camera;
  };

  const SCENES = {
    // Initiation: a little robot finds its way on a grid, step by step, as in Robomind.
    steps() {
      const scene = new THREE.Scene();
      scene.add(new THREE.GridHelper(6, 6, 0x5a5a5a, 0x2a2a2a));
      const path = [[-1.5, -1.5], [-0.5, -1.5], [0.5, -1.5], [0.5, -0.5], [0.5, 0.5], [1.5, 0.5], [1.5, 1.5]];
      scene.add(polyline(path.map(([x, z]) => v(x, 0.01, z)), 0.35));
      const goal = outline(new THREE.CylinderGeometry(0.34, 0.34, 0.02, 40), 0.9);
      goal.position.set(1.5, 0.02, 1.5);
      scene.add(goal);
      const robot = block(new THREE.BoxGeometry(0.6, 0.6, 0.6));
      const eye = dot(0.06);
      eye.position.set(0, 0.1, 0.31);
      robot.add(eye);
      scene.add(robot);
      const last = path.length - 1;
      return { scene, camera: view(3.8, 4.9, 5.7), update(t) {
        const p = (t * 1.1) % (last + 2);
        const done = p >= last;
        const i = done ? last - 1 : Math.floor(p);
        const f = done ? 1 : ease(p - i);
        const [ax, az] = path[i], [bx, bz] = path[i + 1];
        robot.position.set(ax + (bx - ax) * f, 0.3 + (done ? 0 : Math.sin(f * Math.PI) * 0.25), az + (bz - az) * f);
        robot.rotation.y = Math.atan2(bx - ax, bz - az);
        goal.scale.setScalar(done ? 1 + Math.sin((p - last) / 2 * Math.PI) * 0.5 : 1);
      } };
    },
    // Web: the layers of a page (structure, style, behavior) pulled apart.
    web() {
      const scene = new THREE.Scene();
      const stack = new THREE.Group();
      scene.add(stack);
      const pages = [0, 1, 2].map(index => {
        const page = new THREE.Group();
        const w = 3.2, h = 2.1, front = index === 2;
        page.add(block(new THREE.PlaneGeometry(w, h), front ? 1 : 0.45));
        page.add(polyline([v(-w / 2, h / 2 - 0.3, 0.01), v(w / 2, h / 2 - 0.3, 0.01)], front ? 0.6 : 0.3));
        [0, 1, 2].forEach(k => {
          const light = dot(0.045, front ? 0.9 : 0.4);
          light.position.set(-w / 2 + 0.2 + k * 0.15, h / 2 - 0.15, 0.01);
          page.add(light);
        });
        [[0.35, 1.6], [0.1, 2.2], [-0.15, 1.2]].forEach(([y, length]) => page.add(polyline([v(-1.35, y, 0.01), v(-1.35 + length, y, 0.01)], front ? 0.7 : 0.3)));
        const box = outline(new THREE.PlaneGeometry(1.1, 0.6), front ? 0.8 : 0.35);
        box.position.set(0.85, -0.6, 0.01);
        page.add(box);
        stack.add(page);
        return page;
      });
      return { scene, camera: view(0, 0.5, 6.4, [0, 0, -0.6]), update(t) {
        const spread = 0.6 + Math.sin(t * 0.9) * 0.3;
        pages.forEach((page, i) => page.position.set((i - 1) * 0.35, (i - 1) * -0.2, (i - 2) * spread));
        stack.rotation.set(-0.12, -0.55 + Math.sin(t * 0.5) * 0.2, 0);
      } };
    },
    // Python and data: a field of bars rising and falling like live data.
    chart() {
      const scene = new THREE.Scene();
      scene.add(new THREE.GridHelper(5, 5, 0x4a4a4a, 0x262626));
      const unit = new THREE.BoxGeometry(0.5, 1, 0.5);
      unit.translate(0, 0.5, 0);
      const bars = [];
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const bar = block(unit, 0.85);
        bar.position.set((i - 1.5) * 0.85, 0, (j - 1.5) * 0.85);
        scene.add(bar);
        bars.push([bar, i, j]);
      }
      return { scene, camera: view(4.3, 3.8, 5.5, [0, 0.55, 0]), update(t) {
        bars.forEach(([bar, i, j]) => { bar.scale.y = 0.2 + 1.6 * (0.5 + 0.5 * Math.sin(t * 1.4 + i * 0.7 + j * 1.1)) * (0.4 + (i + j) / 10); });
      } };
    },
    // Databases: a stack of disks, with a ring of records moving around it.
    database() {
      const scene = new THREE.Scene();
      const disk = new THREE.CylinderGeometry(1.2, 1.2, 0.42, 64);
      const disks = [0, 1, 2].map(() => { const mesh = block(disk, 0.95); scene.add(mesh); return mesh; });
      const ring = new THREE.Group();
      for (let k = 0; k < 16; k++) {
        const record = dot(0.045, 0.9);
        const angle = k / 16 * Math.PI * 2;
        record.position.set(Math.cos(angle) * 1.75, 0, Math.sin(angle) * 1.75);
        ring.add(record);
      }
      scene.add(ring);
      return { scene, camera: view(0, 2.5, 7, [0, 0.25, 0]), update(t) {
        disks.forEach((mesh, i) => { mesh.position.y = (i - 1) * 0.62 + Math.sin(t * 1.6 + i) * 0.06; });
        ring.rotation.y = -t * 0.6;
        ring.position.y = Math.sin(t * 0.8) * 0.7;
      } };
    },
    // Method and tests: a Git graph, a branch that leaves the main line and merges back, tested.
    branch() {
      const scene = new THREE.Scene();
      const graph = new THREE.Group();
      scene.add(graph);
      const main = new THREE.LineCurve3(v(-2.6, -0.5), v(2.6, -0.5));
      const feature = new THREE.CatmullRomCurve3([v(-1.6, -0.5), v(-0.9, 0.55, 0.3), v(0.9, 0.55, 0.3), v(1.6, -0.5)]);
      graph.add(polyline(main.getPoints(2), 0.7), polyline(feature.getPoints(48), 0.7));
      const commits = [...[-2.2, -1.6, -0.4, 0.6, 1.6, 2.2].map(x => v(x, -0.5)), ...[0.2, 0.5, 0.8].map(u => feature.getPoint(u))].map(point => {
        const commit = dot(0.1);
        commit.position.copy(point);
        graph.add(commit);
        return commit;
      });
      const pulses = [dot(0.06, 0.8), dot(0.06, 0.8)];
      graph.add(...pulses);
      const check = polyline([v(-0.2, 0), v(-0.06, -0.15), v(0.24, 0.2)]);
      check.position.set(2.2, 0.05, 0);
      graph.add(check);
      return { scene, camera: view(0, 0.4, 6.6), update(t) {
        pulses[0].position.copy(main.getPoint((t * 0.25) % 1));
        pulses[1].position.copy(feature.getPoint((t * 0.32) % 1));
        commits.forEach((commit, k) => commit.scale.setScalar(1 + Math.max(0, Math.sin(t * 2 - k * 0.7)) * 0.4));
        check.material.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 1.5));
        graph.rotation.set(0.15, Math.sin(t * 0.4) * 0.35, 0);
      } };
    },
    // AI: a small neural network, with signals running through its links.
    network() {
      const scene = new THREE.Scene();
      const net = new THREE.Group();
      scene.add(net);
      const layers = [3, 5, 5, 2].map((count, l) => Array.from({ length: count }, (_, k) => v((l - 1.5) * 1.35, (k - (count - 1) / 2) * 0.55, Math.sin(k * 1.7 + l) * 0.25)));
      const links = layers.slice(0, -1).flatMap((layer, l) => layer.flatMap(a => layers[l + 1].map(b => [a, b, l])));
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(links.flatMap(([a, b]) => [a.x, a.y, a.z, b.x, b.y, b.z]), 3));
      net.add(new THREE.LineSegments(geometry, lineMaterial(0.18)));
      layers.flat().forEach(point => { const neuron = dot(0.09); neuron.position.copy(point); net.add(neuron); });
      // Each signal crosses the network layer by layer, on links chosen by a fixed sequence.
      const signals = Array.from({ length: 8 }, (_, k) => { const mesh = dot(0.05); net.add(mesh); return { mesh, seed: k * 5 + 3 }; });
      return { scene, camera: view(0, 0, 6.4), update(t) {
        signals.forEach(signal => {
          const p = (t * 0.7 + signal.seed * 0.37) % 3;
          const l = Math.floor(p);
          const choices = links.filter(link => link[2] === l);
          const [a, b] = choices[(signal.seed * 7 + Math.floor(t * 0.7 + signal.seed * 0.37) * 3) % choices.length];
          signal.mesh.position.lerpVectors(a, b, p - l);
        });
        net.rotation.y = Math.sin(t * 0.35) * 0.5;
      } };
    },
    // Project management: a Scrum board where a card moves from one column to the next.
    board() {
      const scene = new THREE.Scene();
      const board = new THREE.Group();
      scene.add(board);
      const columns = [-1.5, 0, 1.5];
      columns.forEach(x => {
        const column = outline(new THREE.PlaneGeometry(1.3, 2.6), 0.4);
        column.position.x = x;
        board.add(column, polyline([v(x - 0.65, 1.0), v(x + 0.65, 1.0)], 0.4));
      });
      const card = new THREE.BoxGeometry(1.0, 0.32, 0.06);
      [[0, 0.6], [0, 0.15], [1, 0.6], [2, 0.6], [2, 0.15], [2, -0.3]].forEach(([c, y]) => {
        const still = block(card, 0.5);
        still.position.set(columns[c], y, 0.05);
        board.add(still);
      });
      const mover = block(card);
      board.add(mover);
      const stops = [v(columns[0], -0.3, 0.05), v(columns[1], -0.3, 0.05), v(columns[2], -0.75, 0.05)];
      return { scene, camera: view(0.7, 0.5, 5.7), update(t) {
        const p = (t * 0.5) % 3, leg = Math.floor(p), f = ease(Math.min(1, (p - leg) * 1.5));
        if (leg < 2) {
          mover.position.lerpVectors(stops[leg], stops[leg + 1], f);
          mover.position.z += Math.sin(f * Math.PI) * 0.5;
          mover.rotation.z = Math.sin(f * Math.PI) * 0.12;
        } else {
          mover.position.copy(stops[2]);
          mover.rotation.z = 0;
        }
        board.rotation.set(-0.1, -0.25 + Math.sin(t * 0.4) * 0.12, 0);
      } };
    },
    // Custom: modules that come apart and fit back together.
    custom() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const piece = new THREE.BoxGeometry(0.7, 0.7, 0.7);
      const parts = [];
      for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
        const part = block(piece, 0.9);
        group.add(part);
        parts.push([part, v(x, y, z)]);
      }
      return { scene, camera: view(2.9, 2.3, 4.7), update(t) {
        const gap = 0.36 + 0.32 * (0.5 + 0.5 * Math.sin(t * 1.2));
        parts.forEach(([part, direction]) => part.position.copy(direction).multiplyScalar(gap));
        group.rotation.set(0.3, t * 0.4, 0);
      } };
    },
  };

  const items = [...document.querySelectorAll(".app-cover")].map(cover => {
    const canvas = cover.querySelector("canvas");
    return { cover, canvas, context: canvas.getContext("2d"), card: cover.closest(".app-card"), time: 1.3, visible: true, ...SCENES[cover.dataset.scene]() };
  });
  let room = [0, 0];
  function drawCover(item) {
    const width = Math.round(item.cover.clientWidth * dpr), height = Math.round(item.cover.clientHeight * dpr);
    if (!width || !height) return;
    if (item.canvas.width !== width || item.canvas.height !== height) {
      item.canvas.width = width;
      item.canvas.height = height;
      item.camera.aspect = width / height;
      item.camera.updateProjectionMatrix();
    }
    if (room[0] < width || room[1] < height) {
      room = [Math.max(room[0], width), Math.max(room[1], height)];
      coverRenderer.setSize(room[0], room[1], false);
    }
    item.update(item.time);
    coverRenderer.setViewport(0, 0, width, height);
    coverRenderer.setScissor(0, 0, width, height);
    coverRenderer.setScissorTest(true);
    coverRenderer.setClearColor(0x000000, 0);
    coverRenderer.clear();
    coverRenderer.render(item.scene, item.camera);
    item.context.clearRect(0, 0, width, height);
    item.context.drawImage(coverRenderer.domElement, 0, room[1] - height, width, height, 0, 0, width, height);
  }
  if (motion) {
    // Only the covers on screen move; a card under the pointer plays faster.
    const watcher = new IntersectionObserver(entries => entries.forEach(entry => { items.find(item => item.cover === entry.target).visible = entry.isIntersecting; }));
    items.forEach(item => watcher.observe(item.cover));
    const clock = new THREE.Clock();
    coverRenderer.setAnimationLoop(() => {
      const delta = Math.min(clock.getDelta(), 0.1);
      items.forEach(item => {
        if (!item.visible) return;
        item.time += delta * (item.card.matches(":hover") ? 2.2 : 1);
        drawCover(item);
      });
    });
  } else {
    items.forEach(item => new ResizeObserver(() => drawCover(item)).observe(item.cover));
  }
}

// Pointer devices: the cards tilt and light up under the pointer.
if (motion && window.gsap && matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".app-tilt").forEach(card => {
    const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
    const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
    gsap.set(card, { transformPerspective: 900 });
    card.addEventListener("pointermove", event => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width, y = (event.clientY - box.top) / box.height;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
      rotateY((x - 0.5) * 7);
      rotateX((0.5 - y) * 7);
    });
    card.addEventListener("pointerleave", () => { rotateX(0); rotateY(0); });
  });
}
