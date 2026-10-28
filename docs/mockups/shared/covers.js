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
  const clamp = x => Math.min(1, Math.max(0, x));
  // The point at the fraction f of the length of a path.
  const along = (points, f) => {
    const lengths = points.slice(1).map((point, k) => point.distanceTo(points[k]));
    let left = f * lengths.reduce((sum, length) => sum + length, 0);
    for (let k = 0; k < lengths.length; k++) {
      if (left <= lengths[k]) return points[k].clone().lerp(points[k + 1], lengths[k] ? left / lengths[k] : 0);
      left -= lengths[k];
    }
    return points[points.length - 1].clone();
  };
  const circle = (radius, opacity = 1, segments = 64) => polyline(Array.from({ length: segments + 1 }, (_, k) => v(Math.cos(k / segments * Math.PI * 2) * radius, Math.sin(k / segments * Math.PI * 2) * radius)), opacity);
  // A fixed pseudo-random number between 0 and 1, so that a scene looks the same at each visit.
  const random = k => { const x = Math.sin(k * 12.9898) * 43758.5453; return x - Math.floor(x); };
  // The lines of a block, to light it up.
  const edges = mesh => mesh.children[0].material;
  // The signal color of the site (orange), for a few elements of each scene: what moves, what
  // is aimed at, what succeeds. On a block, its lines take the color; a line or a dot takes it whole.
  const SIGNAL = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--signal").trim() || "#d3450e");
  const PLAIN = new THREE.Color(WHITE);
  const tinted = object => (object.isMesh && object.children[0] ? object.children[0] : object).material;
  const accent = object => { tinted(object).color.copy(SIGNAL); return object; };
  // From white (0) to the signal color (1): an element lights up when something reaches it.
  const glow = (object, amount) => tinted(object).color.copy(PLAIN).lerp(SIGNAL, clamp(amount));
  // A trail of dots in the signal color that fade behind a moving point, given in the space of the parent; it
  // starts again after a jump (the start of a new loop).
  const trail = (parent, count = 7, radius = 0.05, spacing = 2) => {
    const points = Array.from({ length: count }, (_, k) => {
      const point = accent(dot(radius * (1 - k / count * 0.6), 0.6 * (1 - k / count)));
      point.visible = false;
      parent.add(point);
      return point;
    });
    const history = [];
    return (position, visible = true) => {
      if (history.length && history[0].distanceTo(position) > 0.5) history.length = 0;
      history.unshift(position.clone());
      if (history.length > count * spacing) history.length = count * spacing;
      points.forEach((point, k) => {
        const at = history[k * spacing];
        point.visible = visible && k > 0 && Boolean(at);
        if (at) point.position.copy(at);
      });
    };
  };

  const SCENES = {
    // Initiation: a little robot finds its way on a grid, step by step, as in Robomind.
    steps() {
      const scene = new THREE.Scene();
      scene.add(new THREE.GridHelper(6, 6, 0x5a5a5a, 0x2a2a2a));
      const path = [[-1.5, -1.5], [-0.5, -1.5], [0.5, -1.5], [0.5, -0.5], [0.5, 0.5], [1.5, 0.5], [1.5, 1.5]];
      scene.add(polyline(path.map(([x, z]) => v(x, 0.01, z)), 0.35));
      const goal = accent(outline(new THREE.CylinderGeometry(0.34, 0.34, 0.02, 40), 0.9));
      goal.position.set(1.5, 0.02, 1.5);
      scene.add(goal);
      const robot = block(new THREE.BoxGeometry(0.6, 0.6, 0.6));
      const eye = accent(dot(0.06));
      eye.position.set(0, 0.1, 0.31);
      robot.add(eye);
      scene.add(robot);
      const crumbs = trail(scene, 8, 0.035, 4);
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
        glow(robot, done ? Math.sin((p - last) / 2 * Math.PI) : 0);
        crumbs(v(robot.position.x, 0.03, robot.position.z), !done);
      } };
    },
    // Web: the layers of a page (structure, style, behavior) pulled apart.
    web() {
      const scene = new THREE.Scene();
      const stack = new THREE.Group();
      scene.add(stack);
      let behavior;
      const pages = [0, 1, 2].map(index => {
        const page = new THREE.Group();
        const w = 3.2, h = 2.1, front = index === 2;
        page.add(block(new THREE.PlaneGeometry(w, h), front ? 1 : 0.45));
        page.add(polyline([v(-w / 2, h / 2 - 0.3, 0.01), v(w / 2, h / 2 - 0.3, 0.01)], front ? 0.6 : 0.3));
        [0, 1, 2].forEach(k => {
          const light = front && k === 0 ? accent(dot(0.05)) : dot(0.045, front ? 0.9 : 0.4);
          light.position.set(-w / 2 + 0.2 + k * 0.15, h / 2 - 0.15, 0.01);
          page.add(light);
        });
        [[0.35, 1.6], [0.1, 2.2], [-0.15, 1.2]].forEach(([y, length]) => page.add(polyline([v(-1.35, y, 0.01), v(-1.35 + length, y, 0.01)], front ? 0.7 : 0.3)));
        const box = outline(new THREE.PlaneGeometry(1.1, 0.6), front ? 0.8 : 0.35);
        box.position.set(0.85, -0.6, 0.01);
        page.add(box);
        if (front) behavior = box;
        stack.add(page);
        return page;
      });
      return { scene, camera: view(0, 0.5, 6.4, [0, 0, -0.6]), update(t) {
        const spread = 0.6 + Math.sin(t * 0.9) * 0.3;
        pages.forEach((page, i) => page.position.set((i - 1) * 0.35, (i - 1) * -0.2, (i - 2) * spread));
        glow(behavior, (spread - 0.6) / 0.3);
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
        bars.forEach(([bar, i, j]) => {
          bar.scale.y = 0.2 + 1.6 * (0.5 + 0.5 * Math.sin(t * 1.4 + i * 0.7 + j * 1.1)) * (0.4 + (i + j) / 10);
          glow(bar, (bar.scale.y - 1.45) / 0.3);
        });
      } };
    },
    // Databases: a stack of disks, with a ring of records moving around it.
    database() {
      const scene = new THREE.Scene();
      const disk = new THREE.CylinderGeometry(1.2, 1.2, 0.42, 64);
      const disks = [0, 1, 2].map(() => { const mesh = block(disk, 0.95); scene.add(mesh); return mesh; });
      const ring = new THREE.Group();
      let found;
      for (let k = 0; k < 16; k++) {
        const record = k === 0 ? (found = accent(dot(0.065))) : dot(0.045, 0.9);
        const angle = k / 16 * Math.PI * 2;
        record.position.set(Math.cos(angle) * 1.75, 0, Math.sin(angle) * 1.75);
        ring.add(record);
      }
      scene.add(ring);
      const wake = trail(scene, 9, 0.05, 2);
      const where = v(0, 0, 0);
      return { scene, camera: view(0, 2.5, 7, [0, 0.25, 0]), update(t) {
        disks.forEach((mesh, i) => { mesh.position.y = (i - 1) * 0.62 + Math.sin(t * 1.6 + i) * 0.06; });
        ring.rotation.y = -t * 0.6;
        ring.position.y = Math.sin(t * 0.8) * 0.7;
        ring.updateMatrixWorld(true);
        wake(found.getWorldPosition(where));
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
      const pulses = [dot(0.06, 0.8), accent(dot(0.07))];
      graph.add(...pulses);
      const wake = trail(graph, 7, 0.05, 2);
      const check = accent(polyline([v(-0.2, 0), v(-0.06, -0.15), v(0.24, 0.2)]));
      check.position.set(2.2, 0.05, 0);
      graph.add(check);
      return { scene, camera: view(0, 0.4, 6.6), update(t) {
        pulses[0].position.copy(main.getPoint((t * 0.25) % 1));
        const u = (t * 0.32) % 1;
        pulses[1].position.copy(feature.getPoint(u));
        wake(pulses[1].position);
        commits.forEach((commit, k) => commit.scale.setScalar(1 + Math.max(0, Math.sin(t * 2 - k * 0.7)) * 0.4));
        glow(commits[1], 1 - u * 8);
        glow(commits[4], (u - 0.88) / 0.12);
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
      const neurons = new Map(layers.flat().map(point => { const neuron = dot(0.09); neuron.position.copy(point); net.add(neuron); return [point, neuron]; }));
      const outputs = layers[3].map(point => neurons.get(point));
      // Each signal crosses the network layer by layer, on links chosen by a fixed sequence.
      const signals = Array.from({ length: 8 }, (_, k) => {
        const lit = k % 4 === 0;
        const mesh = lit ? accent(dot(0.06)) : dot(0.05);
        net.add(mesh);
        return { mesh, seed: k * 5 + 3, wake: lit ? trail(net, 6, 0.045, 2) : null };
      });
      return { scene, camera: view(0, 0, 6.4), update(t) {
        outputs.forEach(neuron => glow(neuron, 0));
        signals.forEach(signal => {
          const p = (t * 0.7 + signal.seed * 0.37) % 3;
          const l = Math.floor(p);
          const choices = links.filter(link => link[2] === l);
          const [a, b] = choices[(signal.seed * 7 + Math.floor(t * 0.7 + signal.seed * 0.37) * 3) % choices.length];
          signal.mesh.position.lerpVectors(a, b, p - l);
          if (!signal.wake) return;
          signal.wake(signal.mesh.position);
          if (l === 2 && p - l > 0.8) glow(neurons.get(b), (p - l - 0.8) * 5);
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
      } };
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
      const body = new THREE.Mesh(shape, new THREE.MeshBasicMaterial({ color: FILL, transparent: true, opacity: 0 }));
      body.renderOrder = -1;
      group.add(body);
      const corners = new THREE.EdgesGeometry(shape).attributes.position;
      const lines = Array.from({ length: corners.count / 2 }, (_, k) => {
        const a = new THREE.Vector3().fromBufferAttribute(corners, 2 * k), b = new THREE.Vector3().fromBufferAttribute(corners, 2 * k + 1);
        const line = polyline([v(0, 0), b.clone().sub(a)]);
        line.position.copy(a);
        group.add(line);
        return [line, a, b];
      });
      const pen = accent(dot(0.06));
      group.add(pen);
      return { scene, camera: view(3.2, 2.4, 4.6, [0, -0.1, 0]), update(t) {
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
        parts.push([part, v(x, y, z), x > 0 && y > 0 && z > 0]);
      }
      return { scene, camera: view(2.9, 2.3, 4.7), update(t) {
        const gap = 0.36 + 0.32 * (0.5 + 0.5 * Math.sin(t * 1.2));
        parts.forEach(([part, direction, key]) => {
          part.position.copy(direction).multiplyScalar(gap);
          glow(part, key ? 1 : (0.43 - gap) / 0.07 * 0.6);
        });
        group.rotation.set(0.3, t * 0.4, 0);
      } };
    },
    // ── The cycle of a lesson (pedagogy of the home page) ──
    // Theory 20 %, practice 50 %, correction 30 %, then again; the scene reports its phase and
    // names its runner, which the name of the phase follows. The cycle starts mid-practice, so
    // that a still scene shows the practice.

    // Spiral: the cycle climbs a step at each turn, and the spiral stays in place. The runner goes
    // up three turns, one session each: behind it the turns done in white and the turn under way
    // in the signal color, above it the turns to come, faint. At the top, everything fades out
    // and the climb starts again from the bottom.
    spiral() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const radius = 1.35, pitch = 0.62, turns = 3, steps = 160;
      const at = u => v(Math.cos(Math.PI / 2 - u * Math.PI * 2) * radius, (u - turns / 2) * pitch, -Math.sin(Math.PI / 2 - u * Math.PI * 2) * radius);
      const path = Array.from({ length: turns * steps + 1 }, (_, i) => at(i / steps));
      const faint = polyline(path, 0.18), done = polyline(path, 0.75), lit = accent(polyline(path));
      group.add(faint, done, lit);
      // A small mark where each phase starts, on every turn; it brightens once passed.
      const marks = [];
      for (let k = 0; k < turns; k++) [0, 0.2, 0.7].forEach(start => { const mark = dot(0.035, 0.35); mark.position.copy(at(k + start)); group.add(mark); marks.push([mark, k + start]); });
      const runner = accent(dot(0.06));
      group.add(runner);
      const wake = trail(group, 8, 0.04, 3);
      const fading = [faint, done, lit, runner].map(object => [object.material, object.material.opacity]);
      let lastLap;
      return { scene, camera: view(4.4, 2.5, 5.7, [0, 0, 0]), anchor: runner, data: {}, update(t) {
        // In turns: three turns of climb, then a short fade; a still scene stands mid-practice
        // on the middle turn.
        const time = (t * 0.1 + 1.32) % (turns + 0.15);
        const climb = Math.min(time, turns - 1e-6);
        const lap = Math.floor(climb), u = climb - lap;
        this.phase = u < 0.2 ? 0 : u < 0.7 ? 1 : 2;
        // The share of the turn done in this phase, in percent: up to 20, 50 or 30.
        this.count = (u - [0, 0.2, 0.7][this.phase]) * 100;
        // Each turn is a session. A new one starts: its tag shows once (two tags take turns, so
        // that it plays again).
        if (lastLap !== undefined && lap > lastLap) this.data.lap = String(lap % 2);
        lastLap = lap;
        done.geometry.setDrawRange(0, lap * steps + 1);
        lit.geometry.setDrawRange(lap * steps, Math.max(2, Math.round(u * steps) + 1));
        runner.position.copy(at(climb));
        wake(runner.position, time < turns);
        // At the top, everything fades out before the climb starts again.
        const fade = 1 - Math.min(1, Math.max(0, (time - turns) / 0.12));
        fading.forEach(([material, opacity]) => { material.opacity = opacity * fade; });
        marks.forEach(([mark, place]) => { mark.material.opacity = (climb >= place ? 0.8 : 0.35) * fade; });
        group.rotation.y = Math.sin(t * 0.25) * 0.15;
      } };
    },
    // ── The modules of the offer list ──

    // Algorithmique: a flowchart, where a token goes through a test, to one side then the other.
    flowchart() {
      const scene = new THREE.Scene();
      const chart = new THREE.Group();
      scene.add(chart);
      const start = block(new THREE.BoxGeometry(1.2, 0.42, 0.12));
      start.position.set(0, 1.2, 0);
      const test = block(new THREE.BoxGeometry(0.6, 0.6, 0.12));
      test.rotation.z = Math.PI / 4;
      test.position.set(0, 0.15, 0);
      const ends = [-1.3, 1.3].map(x => {
        const end = block(new THREE.BoxGeometry(1.0, 0.42, 0.12));
        end.position.set(x, -1.0, 0);
        return end;
      });
      chart.add(start, test, ...ends);
      chart.add(polyline([v(0, 0.99), v(0, 0.57)], 0.6));
      [-1, 1].forEach(side => chart.add(polyline([v(side * 0.43, 0.15), v(side * 1.3, 0.15), v(side * 1.3, -0.79)], 0.6)));
      const paths = [-1, 1].map(side => [v(0, 1.2, 0.1), v(0, 0.15, 0.1), v(side * 1.3, 0.15, 0.1), v(side * 1.3, -1.0, 0.1)]);
      const token = accent(dot(0.08));
      chart.add(token);
      const wake = trail(chart, 7, 0.06, 2);
      const flash = (node, center) => {
        const near = Math.max(0, 1 - token.position.distanceTo(center) * 3);
        node.scale.setScalar(1 + near * 0.2);
        glow(node, near * 1.5);
      };
      return { scene, camera: view(0, 0.2, 6.2, [0, 0.05, 0]), update(t) {
        const p = t * 0.45;
        token.position.copy(along(paths[Math.floor(p) % 2], ease(Math.min(1, (p % 1) * 1.25))));
        wake(token.position);
        flash(start, v(0, 1.2, 0.1));
        flash(test, v(0, 0.15, 0.1));
        ends.forEach(end => flash(end, v(end.position.x, -1.0, 0.1)));
        chart.rotation.set(0.05, Math.sin(t * 0.4) * 0.3, 0);
      } };
    },
    // HTML: the blocks of a page (header, aside, main, article, footer) come in one by one.
    markup() {
      const scene = new THREE.Scene();
      const page = new THREE.Group();
      scene.add(page);
      page.add(outline(new THREE.PlaneGeometry(3.4, 2.3), 0.45));
      const parts = [[0, 0.86, 3.1, 0.3], [-1.12, -0.1, 0.86, 1.36], [0.45, 0.24, 2.1, 0.68], [0.45, -0.44, 2.1, 0.44], [0, -0.92, 3.1, 0.2]].map(([x, y, w, h]) => {
        const part = block(new THREE.BoxGeometry(w, h, 0.06));
        part.position.set(x, y, 0);
        page.add(part);
        return part;
      });
      return { scene, camera: view(0, 0, 6.6), update(t) {
        const p = (t * 0.6) % (parts.length + 3);
        const out = ease(clamp(p - parts.length - 1.5));
        parts.forEach((part, k) => {
          const f = ease(clamp(p - k)) * (1 - out);
          part.scale.setScalar(Math.max(0.001, f));
          part.position.z = f * 0.3;
          glow(part, Math.sin(clamp(p - k) * Math.PI) * 1.2);
        });
        page.rotation.set(-0.12, -0.45 + Math.sin(t * 0.4) * 0.15, 0);
      } };
    },
    // CSS: four boxes go from a row (Flexbox) to a grid (Grid), and back.
    layout() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const frame = outline(new THREE.PlaneGeometry(1, 1), 0.45);
      group.add(frame);
      const boxes = [0, 1, 2, 3].map(() => {
        const box = block(new THREE.BoxGeometry(0.8, 0.8, 0.14));
        group.add(box);
        return box;
      });
      const row = k => v((k - 1.5) * 1.0, 0, 0.07);
      const grid = k => v((k % 2 - 0.5) * 1.0, (0.5 - Math.floor(k / 2)) * 1.0, 0.07);
      return { scene, camera: view(0, 0.4, 6.4), update(t) {
        const f = ease(clamp(0.5 + Math.sin(t * 0.8) * 0.9));
        boxes.forEach((box, k) => {
          box.position.lerpVectors(row(k), grid(k), f);
          box.rotation.z = Math.sin(f * Math.PI) * 0.25 * (k % 2 ? 1 : -1);
          glow(box, Math.sin(f * Math.PI) * (k >= 2 ? 1.1 : 0.4));
        });
        frame.scale.set(4.3 - 2.0 * f, 1.2 + 1.1 * f, 1);
        group.rotation.set(-0.15, Math.sin(t * 0.4) * 0.35, 0);
      } };
    },
    // JavaScript: the pointer clicks a button, and the event spreads in waves.
    event() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const button = block(new THREE.BoxGeometry(1.7, 0.56, 0.24));
      group.add(button);
      const waves = [0, 1].map(() => {
        const wave = accent(circle(0.5));
        group.add(wave);
        return wave;
      });
      const pointer = polyline([v(0, 0), v(0, -0.5), v(0.13, -0.38), v(0.24, -0.6), v(0.33, -0.56), v(0.22, -0.34), v(0.38, -0.34), v(0, 0)]);
      group.add(pointer);
      return { scene, camera: view(0, 0.2, 5.6), update(t) {
        const p = (t * 0.55) % 3;
        const move = ease(clamp(p * 1.4));
        const press = Math.max(0, 1 - Math.abs(p - 0.9) * 8);
        pointer.position.set(1.9 - 1.65 * move, -1.3 + 1.35 * move, 0.3 - press * 0.1);
        button.position.z = -press * 0.12;
        glow(button, p > 0.82 ? 1 - (p - 0.9) * 1.1 : 0);
        waves.forEach((wave, k) => {
          const age = clamp((p - 0.9 - k * 0.25) / 1.4);
          wave.scale.set(1.9 + age * 2, 0.6 + age * 1.6, 1);
          wave.material.opacity = age > 0 && age < 1 ? (1 - age) * 0.8 : 0;
        });
        group.rotation.set(-0.1, Math.sin(t * 0.4) * 0.3, 0);
      } };
    },
    // PHP: a page sends a request to the server, which answers; its lights blink.
    server() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const lights = [];
      [-0.55, 0, 0.55].forEach((y, k) => {
        const unit = block(new THREE.BoxGeometry(1.8, 0.42, 1.2));
        unit.position.set(0.7, y, 0);
        group.add(unit, polyline([v(0.8, y, 0.61), v(1.45, y, 0.61)], 0.4));
        [0, 1].forEach(j => {
          const light = j === 1 ? accent(dot(0.045)) : dot(0.045);
          light.position.set(0.05 + j * 0.16, y, 0.61);
          group.add(light);
          lights.push([light, k * 2 + j]);
        });
      });
      const page = outline(new THREE.PlaneGeometry(0.9, 1.2), 0.7);
      page.position.set(-1.8, 0, 0.3);
      group.add(page);
      [0.3, 0.1, -0.1].forEach(y => group.add(polyline([v(-2.1, y, 0.3), v(-1.5, y, 0.3)], 0.5)));
      const go = new THREE.CatmullRomCurve3([v(-1.3, 0.25, 0.3), v(-0.6, 0.6, 0.5), v(0.1, 0.3, 0.62)]);
      const back = new THREE.CatmullRomCurve3([v(0.1, -0.3, 0.62), v(-0.6, -0.6, 0.5), v(-1.3, -0.25, 0.3)]);
      group.add(polyline(go.getPoints(24), 0.25), polyline(back.getPoints(24), 0.25));
      const request = accent(dot(0.065)), answer = accent(dot(0.065));
      group.add(request, answer);
      const wake = trail(group, 7, 0.05, 2);
      return { scene, camera: view(1.6, 1.2, 6.2, [-0.2, 0, 0]), update(t) {
        const p = (t * 0.5) % 2;
        request.position.copy(go.getPoint(clamp(p)));
        request.visible = p < 1;
        answer.position.copy(back.getPoint(clamp(p - 1)));
        answer.visible = p >= 1;
        wake(p < 1 ? request.position : answer.position);
        lights.forEach(([light, k]) => { light.material.opacity = Math.sin(t * 6 + k * 2.1) > 0.2 ? 1 : 0.3; });
        group.rotation.y = Math.sin(t * 0.35) * 0.2;
      } };
    },
    // Vue: a tree of components; a change runs from the root down to the leaves.
    tree() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const nodes = [[0], [-1.1, 1.1], [-1.65, -0.55, 0.55, 1.65]].map((xs, level) => xs.map(x => {
        const node = block(new THREE.BoxGeometry(0.62, 0.34, 0.12));
        node.position.set(x, 1.05 - level * 1.05, 0);
        group.add(node);
        return node;
      }));
      const links = [];
      nodes.slice(1).forEach((level, l) => level.forEach((child, k) => {
        const a = nodes[l][Math.floor(k / 2)].position.clone().add(v(0, -0.17)), b = child.position.clone().add(v(0, 0.17));
        const signal = accent(dot(0.06));
        group.add(polyline([a, b], 0.4), signal);
        links.push({ a, b, l, signal });
      }));
      return { scene, camera: view(0, 0, 6.2), update(t) {
        const p = (t * 0.6) % 2.6;
        links.forEach(({ a, b, l, signal }) => {
          const f = clamp(p - l);
          signal.position.lerpVectors(a, b, ease(f));
          signal.visible = f > 0 && f < 1;
        });
        nodes.forEach((level, l) => level.forEach(node => {
          const reached = Math.max(0, 1 - Math.abs(p - l) * 5);
          node.scale.setScalar(1 + reached * 0.22);
          glow(node, reached * 1.4);
        }));
        group.rotation.set(0.1, Math.sin(t * 0.4) * 0.4, 0);
      } };
    },
    // Alpine: a range of mountains in lines; a climber goes up the highest peak, under a sun.
    peaks() {
      const scene = new THREE.Scene();
      const terrain = new THREE.Group();
      scene.add(terrain);
      const height = (x, z) => 1.5 * Math.exp(-((x + 0.7) ** 2 + (z + 0.2) ** 2) / 0.7) + Math.exp(-((x - 1.1) ** 2 + (z - 0.3) ** 2) / 0.5) + 0.5 * Math.exp(-((x - 0.3) ** 2 + (z + 0.9) ** 2) / 0.4);
      for (let z = -1.4; z <= 1.41; z += 0.28) terrain.add(polyline(Array.from({ length: 41 }, (_, k) => { const x = -2 + k * 0.1; return v(x, height(x, z), z); }), 0.4));
      for (let x = -2; x <= 2.01; x += 0.4) terrain.add(polyline(Array.from({ length: 29 }, (_, k) => { const z = -1.4 + k * 0.1; return v(x, height(x, z), z); }), 0.2));
      const climber = dot(0.07);
      terrain.add(climber);
      const summit = v(-0.7, height(-0.7, -0.2), -0.2);
      const flag = new THREE.Group();
      flag.add(polyline([v(0, 0), v(0, 0.45)], 0.9), accent(polyline([v(0, 0.45), v(0.24, 0.36), v(0, 0.27)])));
      flag.position.copy(summit);
      terrain.add(flag);
      const sun = accent(dot(0.13));
      scene.add(sun);
      return { scene, camera: view(0, 2.8, 6.2, [0, 0.4, 0]), update(t) {
        const f = ease(clamp(((t * 0.3) % 1.3) / 1.1));
        const x = -1.95 + f * 1.25;
        climber.position.set(x, height(x, -0.2) + 0.07, -0.2);
        const planted = ease(clamp((f - 0.96) * 25));
        flag.scale.set(1, Math.max(0.001, planted), 1);
        glow(climber, planted);
        terrain.rotation.y = Math.sin(t * 0.3) * 0.5;
        sun.position.set(Math.cos(t * 0.5) * 2, 1.8 + Math.sin(t * 0.5) * 0.35, -1.5);
      } };
    },
    // Laravel: a request goes from the route to the controller, the model, then the view.
    mvc() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const route = block(new THREE.BoxGeometry(0.55, 0.55, 0.55));
      route.position.set(-1.9, 0, 0);
      const controller = block(new THREE.BoxGeometry(0.8, 0.8, 0.8));
      const model = block(new THREE.CylinderGeometry(0.38, 0.38, 0.6, 40));
      model.position.set(1.6, 0.85, 0);
      const page = block(new THREE.BoxGeometry(0.95, 0.7, 0.06));
      page.position.set(1.6, -0.85, 0);
      group.add(route, controller, model, page);
      [[route, controller], [controller, model], [controller, page]].forEach(([a, b]) => group.add(polyline([a.position, b.position], 0.3)));
      const stops = [route, controller, model, controller, page].map(node => node.position);
      const request = accent(dot(0.08));
      group.add(request);
      const wake = trail(group, 7, 0.06, 2);
      return { scene, camera: view(0.4, 1.2, 6.4), update(t) {
        request.position.copy(along(stops, ease((t * 0.35) % 1)));
        wake(request.position);
        [route, controller, model, page].forEach(node => {
          const near = Math.max(0, 1 - request.position.distanceTo(node.position) * 2.5);
          node.scale.setScalar(1 + near * 0.15);
          glow(node, near * 1.6);
        });
        group.rotation.y = Math.sin(t * 0.4) * 0.35;
      } };
    },
    // Python: a snake of dots slides along a figure of eight on a grid.
    snake() {
      const scene = new THREE.Scene();
      scene.add(new THREE.GridHelper(6, 6, 0x4a4a4a, 0x262626));
      const body = Array.from({ length: 22 }, (_, k) => {
        const part = dot(0.13 - k * 0.004, 1 - k * 0.03);
        scene.add(part);
        return part;
      });
      const at = s => v(Math.sin(s) * 2, 0.13, Math.sin(s * 2) * 0.9);
      const apple = accent(dot(0.11));
      scene.add(apple);
      let next = null, eaten = -10, meals = 0;
      return { scene, camera: view(0, 4.6, 5.2, [0, 0, 0.2]), update(t) {
        body.forEach((part, k) => part.position.copy(at(t * 0.7 - k * 0.09)));
        const head = t * 0.7;
        if (next === null || head < next - 4) next = head + 1.2;
        if (head >= next) { eaten = t; meals++; next = head + 1.4 + random(meals) * 1.6; }
        apple.position.copy(at(next));
        apple.scale.setScalar(Math.max(0.001, ease(clamp((t - eaten) * 2))));
        glow(body[0], 1 - (t - eaten) * 1.5);
      } };
    },
    // Django: a form fills itself in, field after field, then it is sent and checked.
    form() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      group.add(outline(new THREE.PlaneGeometry(2.6, 2.6), 0.45));
      const lengths = [1.1, 1.5, 0.8];
      const fields = [];
      const texts = [0.7, 0.15, -0.4].map(y => {
        const field = outline(new THREE.PlaneGeometry(2.0, 0.36), 0.7);
        field.position.set(0, y, 0.02);
        fields.push(field);
        const text = polyline([v(0, 0), v(1, 0)]);
        text.position.set(-0.85, y, 0.03);
        group.add(field, text);
        return text;
      });
      const button = block(new THREE.BoxGeometry(0.9, 0.32, 0.14));
      button.position.set(-0.55, -0.95, 0.07);
      const check = accent(polyline([v(-0.18, 0), v(-0.05, -0.13), v(0.2, 0.16)]));
      check.position.set(0.55, -0.95, 0.1);
      group.add(button, check);
      return { scene, camera: view(0, 0, 6.2), update(t) {
        const p = (t * 0.7) % 6;
        const out = 1 - clamp(p - 5.2);
        texts.forEach((text, k) => { text.scale.x = Math.max(0.001, ease(clamp(p - k)) * lengths[k] * out); });
        const press = Math.max(0, 1 - Math.abs(p - 3.4) * 6);
        button.position.z = 0.07 - press * 0.1;
        glow(button, press * 1.5);
        fields.forEach((field, k) => glow(field, Math.sin(clamp(p - k) * Math.PI) * 1.3));
        check.material.opacity = clamp((p - 3.6) * 3) * out;
        group.rotation.set(-0.1, -0.3 + Math.sin(t * 0.4) * 0.2, 0);
      } };
    },
    // Machine learning: a cloud of points, and a line that learns their trend.
    fit() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      group.add(polyline([v(-2, -1.6), v(2, -1.6)], 0.5), polyline([v(-2, -1.6), v(-2, 1.5)], 0.5));
      const slope = 0.55;
      const points = Array.from({ length: 26 }, (_, k) => {
        const x = -1.8 + random(k) * 3.6;
        const point = dot(0.05, 0.9);
        point.position.set(x, x * slope + (random(k + 40) - 0.5) * 0.9, (random(k + 80) - 0.5) * 0.6);
        group.add(point);
        return [point, Math.abs(point.position.y - x * slope) < 0.14];
      });
      const model = accent(polyline([v(-2.1, 0), v(2.1, 0)]));
      group.add(model);
      return { scene, camera: view(0, 0, 6.8), update(t) {
        const p = (t * 0.45) % 3;
        const learned = 1 - Math.exp(-p * 1.8) * Math.cos(p * 5);
        const reset = ease(clamp((p - 2.5) * 2));
        model.rotation.z = Math.atan(slope) * learned * (1 - reset);
        const fitted = clamp((p - 1.1) * 2) * (1 - reset);
        points.forEach(([point, close]) => glow(point, close ? fitted : 0));
        group.rotation.y = Math.sin(t * 0.35) * 0.4;
      } };
    },
    // Merise: two entities and the association between them.
    entities() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      [-1.7, 1.7].forEach(x => {
        group.add(polyline([v(x - 0.55, 0.25, 0.06), v(x + 0.55, 0.25, 0.06)], 0.7));
        [-0.02, -0.25].forEach(y => group.add(polyline([v(x - 0.38, y, 0.06), v(x + 0.22, y, 0.06)], 0.4)));
        const entity = block(new THREE.BoxGeometry(1.1, 1.0, 0.1));
        entity.position.set(x, 0, 0);
        group.add(entity);
      });
      const association = circle(0.5, 0.9);
      group.add(association, polyline([v(-1.15, 0), v(-0.5, 0)], 0.6), polyline([v(0.5, 0), v(1.15, 0)], 0.6));
      const tokens = [accent(dot(0.065)), accent(dot(0.065))];
      group.add(...tokens);
      return { scene, camera: view(0, 0.6, 6.3), update(t) {
        const p = (t * 0.6) % 2;
        const f = ease(p < 1 ? p : 2 - p);
        tokens[0].position.set(-1.15 + f * 0.65, 0, 0.05);
        tokens[1].position.set(1.15 - f * 0.65, 0, 0.05);
        const pulse = 1 + Math.max(0, 1 - Math.abs(f - 1) * 5) * 0.12;
        association.scale.set(pulse, 0.6 * pulse, 1);
        glow(association, (f - 0.8) * 5);
        group.rotation.set(0.1, Math.sin(t * 0.4) * 0.4, 0);
      } };
    },
    // UML: a class diagram, two classes that inherit from a third one.
    classes() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const umlClass = (x, y) => {
        const box = new THREE.Group();
        box.add(block(new THREE.BoxGeometry(1.2, 0.95, 0.08)));
        box.add(polyline([v(-0.6, 0.2, 0.05), v(0.6, 0.2, 0.05)], 0.7), polyline([v(-0.6, -0.15, 0.05), v(0.6, -0.15, 0.05)], 0.7));
        box.add(polyline([v(-0.3, 0.34, 0.05), v(0.3, 0.34, 0.05)], 0.9));
        [0.04, -0.3].forEach(line => box.add(polyline([v(-0.45, line, 0.05), v(0.2, line, 0.05)], 0.35)));
        box.position.set(x, y, 0);
        group.add(box);
        return box;
      };
      const parent = umlClass(0, 0.85);
      umlClass(-1.4, -0.85);
      umlClass(1.4, -0.85);
      // Inheritance: the lines of the children meet under a hollow triangle.
      group.add(polyline([v(0, 0.375), v(-0.13, 0.17), v(0.13, 0.17), v(0, 0.375)]));
      group.add(polyline([v(-1.4, -0.375), v(-1.4, -0.05), v(1.4, -0.05), v(1.4, -0.375)], 0.6), polyline([v(0, -0.05), v(0, 0.17)], 0.6));
      const paths = [-1.4, 1.4].map(x => [v(x, -0.375, 0.05), v(x, -0.05, 0.05), v(0, -0.05, 0.05), v(0, 0.17, 0.05)]);
      const tokens = paths.map(() => { const token = accent(dot(0.06)); group.add(token); return token; });
      return { scene, camera: view(0, 0.3, 6.0), update(t) {
        const f = ease((t * 0.45) % 1);
        tokens.forEach((token, k) => token.position.copy(along(paths[k], f)));
        glow(parent.children[0], (f - 0.82) / 0.18);
        group.rotation.set(0.05, Math.sin(t * 0.4) * 0.4, 0);
      } };
    },
    // Programmation orientée objet: a class, the mold, from which objects come one after another;
    // the newest one still carries the color of its creation.
    instances() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const source = v(0, 0.9);
      const mold = outline(new THREE.BoxGeometry(1.1, 0.7, 0.5), 0.9);
      mold.position.copy(source);
      group.add(mold);
      const objects = [-1.4, 0, 1.4].map((x, k) => {
        const object = block(new THREE.BoxGeometry(0.7, 0.45, 0.32));
        // Each object has its own state: a different number of dots on its front.
        for (let d = 0; d <= k; d++) {
          const state = dot(0.04, 0.8);
          state.position.set(-0.18 + d * 0.18, 0, 0.17);
          object.add(state);
        }
        const link = polyline([v(0, 0.55), v(x, -0.375)], 0);
        group.add(object, link);
        return [object, v(x, -0.6), link];
      });
      return { scene, camera: view(0, 0.4, 6.0, [0, 0.1, 0]), update(t) {
        const cycle = (t * 0.25) % 1;
        const out = 1 - ease(clamp((cycle - 0.9) / 0.1));
        let pulse = 0;
        const starts = objects.map((_, k) => 0.08 + k * 0.24);
        const newest = starts.filter(start => cycle > start).length - 1;
        objects.forEach(([object, target, link], k) => {
          const start = starts[k];
          const f = ease(clamp((cycle - start) / 0.2));
          pulse = Math.max(pulse, 1 - Math.abs(cycle - start) / 0.06);
          object.visible = cycle > start;
          object.position.copy(source).lerp(target, f);
          object.scale.setScalar(Math.max(0.001, (0.6 + 0.4 * f) * out));
          glow(object, k === newest ? 1 - f * 0.5 : 0);
          link.material.opacity = object.visible ? 0.25 * f * out : 0;
        });
        glow(mold, pulse);
        group.rotation.set(0.15, Math.sin(t * 0.4) * 0.45, 0);
      } };
    },
    // Principes SOLID: one large class splits into small classes, one responsibility each, which
    // all depend on the same interface.
    solid() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const size = 0.5, gap = 0.85;
      const pieces = Array.from({ length: 5 }, () => { const piece = block(new THREE.BoxGeometry(size, size, size), 0.9); group.add(piece); return piece; });
      const contract = outline(new THREE.BoxGeometry(4.0, 0.28, 0.28), 0.6);
      contract.position.y = 1.0;
      group.add(contract);
      const links = pieces.map(() => { const link = polyline([v(0, 0.86), v(0, size / 2)], 0); group.add(link); return link; });
      const token = accent(dot(0.06));
      group.add(token);
      return { scene, camera: view(0, 0.9, 6.0, [0, 0.4, 0]), update(t) {
        const cycle = (t * 0.3) % 1;
        const split = ease(clamp(cycle / 0.25)) * (1 - ease(clamp((cycle - 0.88) / 0.12)));
        token.visible = cycle > 0.3 && cycle < 0.8;
        token.position.set(-1.8 + 3.6 * clamp((cycle - 0.3) / 0.5), 1.0, 0.15);
        pieces.forEach((piece, k) => {
          piece.position.x = (k - 2) * (size + (gap - size) * split);
          links[k].position.x = piece.position.x;
          glow(piece, token.visible ? 1 - Math.abs(token.position.x - piece.position.x) / 0.35 : 0);
        });
        links.forEach(link => { link.material.opacity = 0.5 * split; });
        group.rotation.set(0.2, Math.sin(t * 0.4) * 0.45, 0);
      } };
    },
    // Design patterns: the observer, a subject that notifies the objects that listen to it.
    observer() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const subject = block(new THREE.BoxGeometry(0.8, 0.8, 0.8));
      group.add(subject);
      const places = [v(-1.7, 0.75), v(1.7, 0.75), v(-1.7, -0.75), v(1.7, -0.75)];
      const listeners = places.map(place => {
        const listener = block(new THREE.BoxGeometry(0.5, 0.5, 0.5), 0.8);
        listener.position.copy(place);
        group.add(listener, polyline([v(0, 0), place], 0.3));
        return listener;
      });
      const pulses = places.map(() => { const pulse = accent(dot(0.06)); group.add(pulse); return pulse; });
      return { scene, camera: view(0, 0.5, 6.4), update(t) {
        const cycle = (t * 0.5) % 1;
        const f = ease(clamp((cycle - 0.1) / 0.5));
        glow(subject, 1 - cycle / 0.2);
        pulses.forEach((pulse, k) => {
          pulse.visible = cycle > 0.1 && cycle < 0.6;
          pulse.position.copy(places[k]).multiplyScalar(f);
        });
        listeners.forEach(listener => glow(listener, cycle < 0.6 ? 0 : 1 - (cycle - 0.6) / 0.4));
        group.rotation.set(0.15, Math.sin(t * 0.4) * 0.5, 0);
      } };
    },
    // MySQL: a query scans a table row by row and marks the rows it keeps.
    table() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const columns = 4, rows = 6, w = 3.2, h = 2.4, rowHeight = h / rows;
      for (let r = 0; r <= rows; r++) group.add(polyline([v(-w / 2, h / 2 - r * rowHeight), v(w / 2, h / 2 - r * rowHeight)], r <= 1 || r === rows ? 0.7 : 0.25));
      for (let c = 0; c <= columns; c++) group.add(polyline([v(-w / 2 + c * w / columns, h / 2), v(-w / 2 + c * w / columns, -h / 2)], c === 0 || c === columns ? 0.7 : 0.25));
      const rowY = index => h / 2 - (index + 1.5) * rowHeight;
      const cursor = outline(new THREE.PlaneGeometry(w + 0.12, rowHeight + 0.06));
      group.add(cursor);
      const marks = [1, 3, 4].map(index => {
        const mark = accent(dot(0.065));
        mark.position.set(-w / 2 - 0.25, rowY(index), 0);
        group.add(mark);
        return [mark, index];
      });
      return { scene, camera: view(0, 0.3, 6.0), update(t) {
        const q = (t * 1.1) % 7;
        const index = Math.min(4, Math.floor(q));
        const place = Math.min(4, index + ease(clamp((q - index - 0.6) * 2.5)));
        cursor.position.set(0, h / 2 - (place + 1.5) * rowHeight, 0.02);
        cursor.visible = q < 5.2;
        const row = Math.round(place);
        glow(cursor, [1, 3, 4].includes(row) ? 1 - Math.abs(place - row) * 4 : 0);
        marks.forEach(([mark, row]) => { mark.visible = q > row + 0.3 && q < 6.6; });
        group.rotation.set(-0.1, Math.sin(t * 0.4) * 0.35, 0);
      } };
    },
    // PostgreSQL: a join links the rows of two tables, pair after pair.
    join() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const rowsAt = x => [0, 1, 2, 3, 4].map(k => {
        const row = block(new THREE.BoxGeometry(1.0, 0.3, 0.08));
        row.position.set(x, 0.9 - k * 0.45, 0);
        group.add(row);
        return row;
      });
      const left = rowsAt(-1.4), right = rowsAt(1.4);
      const pairs = [[0, 2], [1, 0], [2, 4], [3, 1], [4, 3]];
      const links = pairs.map(([a, b]) => {
        const ya = left[a].position.y, yb = right[b].position.y;
        const link = accent(polyline(new THREE.CatmullRomCurve3([v(-0.9, ya, 0.05), v(0, (ya + yb) / 2, 0.45), v(0.9, yb, 0.05)]).getPoints(32), 0));
        group.add(link);
        return link;
      });
      return { scene, camera: view(0, 0.3, 6.0), update(t) {
        const p = (t * 0.8) % (pairs.length + 2);
        links.forEach((link, k) => { link.material.opacity = clamp(p - k) * (1 - clamp((p - pairs.length - 1) * 2)) * 0.8; });
        pairs.forEach(([a, b], k) => {
          const on = Math.max(0, 1 - Math.abs(p - k - 0.5) * 3);
          left[a].position.z = right[b].position.z = on * 0.15;
          glow(left[a], on * 1.4);
          glow(right[b], on * 1.4);
        });
        group.rotation.set(0.05, Math.sin(t * 0.4) * 0.35, 0);
      } };
    },
    // Cypress: the tests of a suite run one after the other and pass.
    checks() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const rows = [0, 1, 2, 3, 4].map(k => {
        const y = 0.9 - k * 0.45;
        const frame = outline(new THREE.PlaneGeometry(2.8, 0.34), 0.3);
        frame.position.y = y;
        const ring = circle(0.11, 0.3);
        ring.position.set(-1.15, y, 0.01);
        const check = polyline([v(-0.1, 0), v(-0.03, -0.07), v(0.12, 0.09)], 0);
        check.position.set(-1.15, y, 0.02);
        group.add(frame, polyline([v(-0.8, y), v(-0.2 + random(k) * 1.2, y)], 0.45), ring, check);
        return { ring, check };
      });
      const spinner = accent(polyline(Array.from({ length: 17 }, (_, k) => v(Math.cos(k / 16 * Math.PI * 1.4) * 0.11, Math.sin(k / 16 * Math.PI * 1.4) * 0.11))));
      group.add(spinner);
      return { scene, camera: view(0, 0.2, 5.4), update(t) {
        const p = (t * 0.9) % (rows.length + 2);
        rows.forEach(({ ring, check }, k) => {
          const done = p > k + 1 && p < rows.length + 1.6;
          check.material.opacity = done ? 1 : 0;
          ring.material.opacity = done ? 0.9 : 0.3;
          glow(check, 1 - (p - k - 1) * 1.5);
          glow(ring, 1 - Math.abs(p - rows.length - 0.4) * 2.5);
        });
        const current = Math.floor(p);
        spinner.visible = current < rows.length;
        spinner.position.set(-1.15, 0.9 - Math.min(current, rows.length - 1) * 0.45, 0.02);
        spinner.rotation.z = -t * 6;
        group.rotation.set(-0.08, -0.3 + Math.sin(t * 0.4) * 0.2, 0);
      } };
    },
    // Continuous integration: a change goes through the stages of the pipeline, then passes.
    pipeline() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      group.add(polyline([v(-2.4, 0), v(2.4, 0)], 0.25));
      const stages = [-1.8, -0.6, 0.6, 1.8].map(x => {
        const stage = block(new THREE.BoxGeometry(0.7, 0.7, 0.7), 0.35);
        stage.position.x = x;
        group.add(stage);
        return stage;
      });
      const token = accent(dot(0.075));
      const wake = trail(group, 7, 0.055, 2);
      const check = accent(polyline([v(-0.2, 0), v(-0.06, -0.15), v(0.24, 0.2)], 0));
      check.position.set(1.8, 0.75, 0);
      group.add(token, check);
      return { scene, camera: view(1.2, 1.6, 6.2), update(t) {
        const p = (t * 0.4) % 1.4;
        const x = -2.4 + clamp(p) * 4.8;
        token.position.x = x;
        token.visible = p < 1;
        wake(token.position, p < 1);
        stages.forEach(stage => {
          edges(stage).opacity = x > stage.position.x - 0.35 ? 1 : 0.35;
          const inside = Math.max(0, 1 - Math.abs(x - stage.position.x) * 3);
          stage.scale.setScalar(1 + inside * 0.12);
          glow(stage, p < 1 ? inside * 1.5 : 0);
        });
        check.material.opacity = p > 1 ? 1 : 0;
        group.rotation.y = Math.sin(t * 0.35) * 0.25;
      } };
    },
    // Continuous deployment: a package rises from its base and docks in production.
    deploy() {
      const scene = new THREE.Scene();
      const base = outline(new THREE.CylinderGeometry(1.0, 1.0, 0.08, 48), 0.6);
      base.position.y = -1.1;
      const target = outline(new THREE.BoxGeometry(1.0, 1.0, 1.0), 0.5);
      target.position.y = 1.0;
      const box = block(new THREE.BoxGeometry(0.62, 0.62, 0.62));
      const wave = accent(circle(0.8, 0));
      wave.rotation.x = -Math.PI / 2;
      wave.position.y = 1.0;
      const flame = [0, 1, 2, 3].map(k => accent(dot(0.05 - k * 0.009, 0.9 - k * 0.2)));
      scene.add(base, target, box, wave, ...flame);
      return { scene, camera: view(2.9, 1.5, 6.3), update(t) {
        const p = (t * 0.5) % 2;
        const rise = ease(clamp(p * 1.2));
        box.position.y = -0.75 + rise * 1.75;
        box.rotation.y = rise * Math.PI / 2;
        box.scale.setScalar(Math.max(0.001, ease(clamp(p * 4)) * (1 - ease(clamp((p - 1.7) / 0.3)))));
        const docked = clamp((p - 0.85) * 2);
        wave.scale.setScalar(1 + docked * 1.2);
        wave.material.opacity = docked > 0 && docked < 1 ? 1 - docked : 0;
        flame.forEach((spark, k) => {
          spark.position.set(Math.sin(t * 23 + k * 2) * 0.03, box.position.y - 0.42 - k * (0.16 + Math.sin(t * 17 + k) * 0.03), Math.cos(t * 19 + k) * 0.03);
          spark.visible = rise > 0.05 && rise < 0.98;
        });
        glow(target, Math.sin(docked * Math.PI) * 1.2);
        target.rotation.y = t * 0.3;
      } };
    },
    // Claude Code: a terminal, where the lines of a session appear after the prompt.
    terminal() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      group.add(block(new THREE.BoxGeometry(3.4, 2.3, 0.06), 0.8), polyline([v(-1.7, 0.85, 0.04), v(1.7, 0.85, 0.04)], 0.5));
      [0, 1, 2].forEach(k => {
        const light = dot(0.045, 0.8);
        light.position.set(-1.5 + k * 0.15, 1.0, 0.04);
        group.add(light);
      });
      const lines = [1.6, 2.4, 1.1, 2.0, 1.4].map((length, k) => {
        const y = 0.55 - k * 0.32;
        const prompt = accent(polyline([v(-1.45, y + 0.06, 0.04), v(-1.37, y, 0.04), v(-1.45, y - 0.06, 0.04)], 0.9));
        const text = polyline([v(0, 0, 0.04), v(1, 0, 0.04)], 0.75);
        text.position.set(-1.25, y, 0);
        group.add(prompt, text);
        return { prompt, text, length, y };
      });
      const caret = accent(new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.18), new THREE.MeshBasicMaterial({ color: WHITE })));
      group.add(caret);
      return { scene, camera: view(0, 0, 5.4), update(t) {
        const p = (t * 0.8) % (lines.length + 2);
        const shown = p < lines.length + 1.5;
        lines.forEach(({ prompt, text, length }, k) => {
          const f = clamp(p - k);
          text.scale.x = Math.max(0.001, f * length);
          text.visible = prompt.visible = f > 0 && shown;
        });
        const k = Math.min(lines.length - 1, Math.floor(p));
        const f = clamp(p - k);
        caret.position.set(-1.25 + f * lines[k].length + 0.08, lines[k].y, 0.05);
        caret.visible = shown && (f < 1 || Math.sin(t * 8) > 0);
        group.rotation.set(-0.08, -0.25 + Math.sin(t * 0.4) * 0.15, 0);
      } };
    },
    // Prompt engineering: a conversation, bubble after bubble, each one typed first.
    chat() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const bubbles = [[-0.5, 0.95, 2.0, 0.42], [0.55, 0.38, 1.6, 0.42], [-0.35, -0.24, 2.3, 0.62], [0.65, -0.88, 1.4, 0.42]].map(([x, y, w, h], k) => {
        const bubble = new THREE.Group();
        bubble.add(block(new THREE.BoxGeometry(w, h, 0.08), k % 2 ? 1 : 0.6));
        (h > 0.5 ? [0.1, -0.1] : [0]).forEach((line, j) => bubble.add(polyline([v(-w / 2 + 0.18, line, 0.05), v(w / 2 - 0.18 - j * 0.5, line, 0.05)], 0.6)));
        bubble.position.set(x, y, 0);
        group.add(bubble);
        return bubble;
      });
      const typing = [0, 1, 2].map(() => { const point = accent(dot(0.05)); group.add(point); return point; });
      return { scene, camera: view(0, 0, 5.6), update(t) {
        const p = (t * 0.7) % (bubbles.length + 2);
        const out = ease(clamp(p - bubbles.length - 1));
        bubbles.forEach((bubble, k) => {
          bubble.scale.setScalar(Math.max(0.001, ease(clamp((p - k - 0.5) * 3)) * (1 - out)));
          glow(bubble.children[0], p > k + 0.5 ? 1 - (p - k - 0.5) * 1.2 : 0);
        });
        const next = Math.floor(p);
        const isTyping = next < bubbles.length && p - next < 0.5;
        typing.forEach((point, j) => {
          point.visible = isTyping;
          if (isTyping) point.position.set(bubbles[next].position.x - 0.16 + j * 0.16, bubbles[next].position.y + Math.max(0, Math.sin(t * 10 - j)) * 0.06, 0.05);
        });
        group.rotation.set(-0.05, Math.sin(t * 0.4) * 0.3, 0);
      } };
    },
    // Integrating AI with method: a core, with the tools that orbit around it, each on its track.
    orbit() {
      const scene = new THREE.Scene();
      const core = outline(new THREE.IcosahedronGeometry(0.62, 0), 0.9);
      scene.add(core);
      const orbits = [[1.0, 0.3, 0], [1.3, -0.5, 0.6], [1.6, 0.9, -0.4]].map(([radius, tiltX, tiltZ], k) => {
        const track = new THREE.Group();
        track.rotation.set(Math.PI / 2 + tiltX, 0, tiltZ);
        const satellite = k === 1 ? accent(dot(0.085)) : dot(0.07);
        track.add(circle(radius, 0.3), satellite);
        scene.add(track);
        return { radius, satellite, speed: 0.9 - k * 0.2, phase: k * 2, wake: k === 1 ? trail(track, 9, 0.06, 2) : null };
      });
      return { scene, camera: view(0, 0.8, 7.4), update(t) {
        core.rotation.set(t * 0.3, t * 0.45, 0);
        orbits.forEach(({ radius, satellite, speed, phase, wake }) => {
          satellite.position.set(Math.cos(t * speed + phase) * radius, Math.sin(t * speed + phase) * radius, 0);
          if (wake) wake(satellite.position);
        });
        glow(core, 0.2 + 0.25 * Math.sin(t * 1.6));
      } };
    },
    // Scrum: each sprint goes once around the loop and adds an increment to the product.
    sprint() {
      const scene = new THREE.Scene();
      const group = new THREE.Group();
      scene.add(group);
      const radius = 1.6;
      const loop = circle(radius, 0.35);
      loop.rotation.x = -Math.PI / 2;
      loop.position.y = -0.5;
      const runner = accent(dot(0.085));
      group.add(loop, runner);
      const wake = trail(group, 9, 0.06, 2);
      const layers = [0, 1, 2, 3].map(() => {
        const layer = block(new THREE.BoxGeometry(0.9, 0.18, 0.9));
        group.add(layer);
        return layer;
      });
      return { scene, camera: view(0, 2.6, 6.4, [0, -0.1, 0]), update(t) {
        const laps = (t * 0.45) % 5;
        const built = Math.floor(laps), lap = laps - built;
        const a = lap * Math.PI * 2;
        runner.position.set(Math.cos(a) * radius, -0.5, -Math.sin(a) * radius);
        wake(runner.position);
        const out = built === 4 ? ease(clamp((lap - 0.7) / 0.3)) : 0;
        layers.forEach((layer, k) => {
          const drop = k === built - 1 ? ease(clamp(lap * 3)) : 1;
          layer.visible = k < built;
          layer.position.y = -0.41 + k * 0.24 + (1 - drop) * 0.6;
          layer.scale.setScalar(Math.max(0.001, 1 - out));
          glow(layer, k === built - 1 ? 1 - lap * 1.4 : 0);
        });
        group.rotation.y = t * 0.15;
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
    // A scene may report what it shows (the phase of the cycle of a lesson), for the text beside it.
    if (item.phase !== undefined && item.cover.dataset.phase !== String(item.phase)) item.cover.dataset.phase = item.phase;
    if (item.count !== undefined) item.cover.style.setProperty("--count", String(Math.min(99, Math.floor(item.count + 1))));
    Object.entries(item.data || {}).forEach(([name, value]) => { if (item.cover.dataset[name] !== value) item.cover.dataset[name] = value; });
    coverRenderer.setViewport(0, 0, width, height);
    coverRenderer.setScissor(0, 0, width, height);
    coverRenderer.setScissorTest(true);
    coverRenderer.setClearColor(0x000000, 0);
    coverRenderer.clear();
    coverRenderer.render(item.scene, item.camera);
    // A scene may also name the object that its text follows (the runner of the cycle of a
    // lesson): its place in the cover, in percent.
    if (item.anchor) {
      const point = item.anchor.getWorldPosition(new THREE.Vector3()).project(item.camera);
      item.cover.style.setProperty("--anchor-x", `${(point.x + 1) * 50}%`);
      item.cover.style.setProperty("--anchor-y", `${(1 - point.y) * 50}%`);
    }
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
        item.time += delta * (item.card && item.card.matches(":hover") ? 2.2 : 1);
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
