// The scenes of the covers of the modules (from docs/mockups/shared/covers.js), and of the card
// of a custom request, drawn by src/scripts/covers.ts. Each one shows the idea of its module in
// a few moving shapes, with the orange on what moves, is aimed at or succeeds (docs/branding.md,
// Animated covers).
import * as THREE from "three";
import type { SceneName } from "../lib/scenes";
import {
  WHITE,
  accent,
  along,
  block,
  circle,
  clamp,
  dot,
  ease,
  glow,
  gray,
  outline,
  polyline,
  random,
  tinted,
  trail,
  v,
  view,
  type Scene,
} from "./cover-kit";

export const MODULE_SCENES = {
  // A custom request: a cube in eight pieces that open and close, the one in the front corner
  // in the signal color, as a module built for the request.
  custom() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    const piece = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const parts: [THREE.Mesh, THREE.Vector3, boolean][] = [];
    for (const x of [-1, 1])
      for (const y of [-1, 1])
        for (const z of [-1, 1]) {
          const part = block(piece, 0.9);
          group.add(part);
          parts.push([part, v(x, y, z), x > 0 && y > 0 && z > 0]);
        }
    return {
      scene,
      camera: view(2.9, 2.3, 4.7),
      update(t) {
        const gap = 0.36 + 0.32 * (0.5 + 0.5 * Math.sin(t * 1.2));
        parts.forEach(([part, direction, key]) => {
          part.position.copy(direction).multiplyScalar(gap);
          glow(part, key ? 1 : ((0.43 - gap) / 0.07) * 0.6);
        });
        group.rotation.set(0.3, t * 0.4, 0);
      },
    };
  },
  // Algorithmique: a token runs through a flowchart, and takes one branch or the other.
  flowchart() {
    const scene = new THREE.Scene();
    const chart = new THREE.Group();
    scene.add(chart);
    const start = block(new THREE.BoxGeometry(1.2, 0.42, 0.12));
    start.position.set(0, 1.2, 0);
    const test = block(new THREE.BoxGeometry(0.6, 0.6, 0.12));
    test.rotation.z = Math.PI / 4;
    test.position.set(0, 0.15, 0);
    const ends = [-1.3, 1.3].map((x) => {
      const end = block(new THREE.BoxGeometry(1.0, 0.42, 0.12));
      end.position.set(x, -1.0, 0);
      return end;
    });
    chart.add(start, test, ...ends);
    chart.add(polyline([v(0, 0.99), v(0, 0.57)], 0.6));
    [-1, 1].forEach((side) =>
      chart.add(
        polyline(
          [v(side * 0.43, 0.15), v(side * 1.3, 0.15), v(side * 1.3, -0.79)],
          0.6,
        ),
      ),
    );
    const paths = [-1, 1].map((side) => [
      v(0, 1.2, 0.1),
      v(0, 0.15, 0.1),
      v(side * 1.3, 0.15, 0.1),
      v(side * 1.3, -1.0, 0.1),
    ]);
    const token = accent(dot(0.08));
    chart.add(token);
    const wake = trail(chart, 7, 0.06, 2);
    const flash = (node: THREE.Object3D, center: THREE.Vector3) => {
      const near = Math.max(0, 1 - token.position.distanceTo(center) * 3);
      node.scale.setScalar(1 + near * 0.2);
      glow(node, near * 1.5);
    };
    return {
      scene,
      camera: view(0, 0.2, 6.2, [0, 0.05, 0]),
      update(t) {
        const p = t * 0.45;
        token.position.copy(
          along(paths[Math.floor(p) % 2], ease(Math.min(1, (p % 1) * 1.25))),
        );
        wake(token.position);
        flash(start, v(0, 1.2, 0.1));
        flash(test, v(0, 0.15, 0.1));
        ends.forEach((end) => flash(end, v(end.position.x, -1.0, 0.1)));
        chart.rotation.set(0.05, Math.sin(t * 0.4) * 0.3, 0);
      },
    };
  },
  // HTML: the blocks of a page (header, aside, main, article, footer) come in one by one.
  markup() {
    const scene = new THREE.Scene();
    const page = new THREE.Group();
    scene.add(page);
    page.add(outline(new THREE.PlaneGeometry(3.4, 2.3), 0.45));
    const parts = [
      [0, 0.86, 3.1, 0.3],
      [-1.12, -0.1, 0.86, 1.36],
      [0.45, 0.24, 2.1, 0.68],
      [0.45, -0.44, 2.1, 0.44],
      [0, -0.92, 3.1, 0.2],
    ].map(([x, y, w, h]) => {
      const part = block(new THREE.BoxGeometry(w, h, 0.06));
      part.position.set(x, y, 0);
      page.add(part);
      return part;
    });
    return {
      scene,
      camera: view(0, 0, 6.6),
      update(t) {
        const p = (t * 0.6) % (parts.length + 3);
        const out = ease(clamp(p - parts.length - 1.5));
        parts.forEach((part, k) => {
          const f = ease(clamp(p - k)) * (1 - out);
          part.scale.setScalar(Math.max(0.001, f));
          part.position.z = f * 0.3;
          glow(part, Math.sin(clamp(p - k) * Math.PI) * 1.2);
        });
        page.rotation.set(-0.12, -0.45 + Math.sin(t * 0.4) * 0.15, 0);
      },
    };
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
    const row = (k: number) => v((k - 1.5) * 1.0, 0, 0.07);
    const grid = (k: number) =>
      v(((k % 2) - 0.5) * 1.0, (0.5 - Math.floor(k / 2)) * 1.0, 0.07);
    return {
      scene,
      camera: view(0, 0.4, 6.4),
      update(t) {
        const f = ease(clamp(0.5 + Math.sin(t * 0.8) * 0.9));
        boxes.forEach((box, k) => {
          box.position.lerpVectors(row(k), grid(k), f);
          box.rotation.z = Math.sin(f * Math.PI) * 0.25 * (k % 2 ? 1 : -1);
          glow(box, Math.sin(f * Math.PI) * (k >= 2 ? 1.1 : 0.4));
        });
        frame.scale.set(4.3 - 2.0 * f, 1.2 + 1.1 * f, 1);
        group.rotation.set(-0.15, Math.sin(t * 0.4) * 0.35, 0);
      },
    };
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
    const pointer = polyline([
      v(0, 0),
      v(0, -0.5),
      v(0.13, -0.38),
      v(0.24, -0.6),
      v(0.33, -0.56),
      v(0.22, -0.34),
      v(0.38, -0.34),
      v(0, 0),
    ]);
    group.add(pointer);
    return {
      scene,
      camera: view(0, 0.2, 5.6),
      update(t) {
        const p = (t * 0.55) % 3;
        const move = ease(clamp(p * 1.4));
        const press = Math.max(0, 1 - Math.abs(p - 0.9) * 8);
        pointer.position.set(
          1.9 - 1.65 * move,
          -1.3 + 1.35 * move,
          0.3 - press * 0.1,
        );
        button.position.z = -press * 0.12;
        glow(button, p > 0.82 ? 1 - (p - 0.9) * 1.1 : 0);
        waves.forEach((wave, k) => {
          const age = clamp((p - 0.9 - k * 0.25) / 1.4);
          wave.scale.set(1.9 + age * 2, 0.6 + age * 1.6, 1);
          tinted(wave).opacity = age > 0 && age < 1 ? (1 - age) * 0.8 : 0;
        });
        group.rotation.set(-0.1, Math.sin(t * 0.4) * 0.3, 0);
      },
    };
  },
  // PHP: a page sends a request to the server, which answers; its lights blink.
  server() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    const lights: [THREE.Mesh, number][] = [];
    [-0.55, 0, 0.55].forEach((y, k) => {
      const unit = block(new THREE.BoxGeometry(1.8, 0.42, 1.2));
      unit.position.set(0.7, y, 0);
      group.add(unit, polyline([v(0.8, y, 0.61), v(1.45, y, 0.61)], 0.4));
      [0, 1].forEach((j) => {
        const light = j === 1 ? accent(dot(0.045)) : dot(0.045);
        light.position.set(0.05 + j * 0.16, y, 0.61);
        group.add(light);
        lights.push([light, k * 2 + j]);
      });
    });
    const page = outline(new THREE.PlaneGeometry(0.9, 1.2), 0.7);
    page.position.set(-1.8, 0, 0.3);
    group.add(page);
    [0.3, 0.1, -0.1].forEach((y) =>
      group.add(polyline([v(-2.1, y, 0.3), v(-1.5, y, 0.3)], 0.5)),
    );
    const go = new THREE.CatmullRomCurve3([
      v(-1.3, 0.25, 0.3),
      v(-0.6, 0.6, 0.5),
      v(0.1, 0.3, 0.62),
    ]);
    const back = new THREE.CatmullRomCurve3([
      v(0.1, -0.3, 0.62),
      v(-0.6, -0.6, 0.5),
      v(-1.3, -0.25, 0.3),
    ]);
    group.add(
      polyline(go.getPoints(24), 0.25),
      polyline(back.getPoints(24), 0.25),
    );
    const request = accent(dot(0.065));
    const answer = accent(dot(0.065));
    group.add(request, answer);
    const wake = trail(group, 7, 0.05, 2);
    return {
      scene,
      camera: view(1.6, 1.2, 6.2, [-0.2, 0, 0]),
      update(t) {
        const p = (t * 0.5) % 2;
        request.position.copy(go.getPoint(clamp(p)));
        request.visible = p < 1;
        answer.position.copy(back.getPoint(clamp(p - 1)));
        answer.visible = p >= 1;
        wake(p < 1 ? request.position : answer.position);
        lights.forEach(([light, k]) => {
          tinted(light).opacity = Math.sin(t * 6 + k * 2.1) > 0.2 ? 1 : 0.3;
        });
        group.rotation.y = Math.sin(t * 0.35) * 0.2;
      },
    };
  },
  // Vue: a tree of components; a change runs from the root down to the leaves.
  tree() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    const nodes = [[0], [-1.1, 1.1], [-1.65, -0.55, 0.55, 1.65]].map(
      (xs, level) =>
        xs.map((x) => {
          const node = block(new THREE.BoxGeometry(0.62, 0.34, 0.12));
          node.position.set(x, 1.05 - level * 1.05, 0);
          group.add(node);
          return node;
        }),
    );
    const links: {
      a: THREE.Vector3;
      b: THREE.Vector3;
      l: number;
      signal: THREE.Mesh;
    }[] = [];
    nodes.slice(1).forEach((level, l) =>
      level.forEach((child, k) => {
        const a = nodes[l][Math.floor(k / 2)].position.clone().add(v(0, -0.17));
        const b = child.position.clone().add(v(0, 0.17));
        const signal = accent(dot(0.06));
        group.add(polyline([a, b], 0.4), signal);
        links.push({ a, b, l, signal });
      }),
    );
    return {
      scene,
      camera: view(0, 0, 6.2),
      update(t) {
        const p = (t * 0.6) % 2.6;
        links.forEach(({ a, b, l, signal }) => {
          const f = clamp(p - l);
          signal.position.lerpVectors(a, b, ease(f));
          signal.visible = f > 0 && f < 1;
        });
        nodes.forEach((level, l) =>
          level.forEach((node) => {
            const reached = Math.max(0, 1 - Math.abs(p - l) * 5);
            node.scale.setScalar(1 + reached * 0.22);
            glow(node, reached * 1.4);
          }),
        );
        group.rotation.set(0.1, Math.sin(t * 0.4) * 0.4, 0);
      },
    };
  },
  // Alpine: a range of mountains in lines; a climber goes up the highest peak, under a sun.
  peaks() {
    const scene = new THREE.Scene();
    const terrain = new THREE.Group();
    scene.add(terrain);
    const height = (x: number, z: number) =>
      1.5 * Math.exp(-((x + 0.7) ** 2 + (z + 0.2) ** 2) / 0.7) +
      Math.exp(-((x - 1.1) ** 2 + (z - 0.3) ** 2) / 0.5) +
      0.5 * Math.exp(-((x - 0.3) ** 2 + (z + 0.9) ** 2) / 0.4);
    for (let z = -1.4; z <= 1.41; z += 0.28)
      terrain.add(
        polyline(
          Array.from({ length: 41 }, (_, k) => {
            const x = -2 + k * 0.1;
            return v(x, height(x, z), z);
          }),
          0.4,
        ),
      );
    for (let x = -2; x <= 2.01; x += 0.4)
      terrain.add(
        polyline(
          Array.from({ length: 29 }, (_, k) => {
            const z = -1.4 + k * 0.1;
            return v(x, height(x, z), z);
          }),
          0.2,
        ),
      );
    const climber = dot(0.07);
    terrain.add(climber);
    const summit = v(-0.7, height(-0.7, -0.2), -0.2);
    const flag = new THREE.Group();
    flag.add(
      polyline([v(0, 0), v(0, 0.45)], 0.9),
      accent(polyline([v(0, 0.45), v(0.24, 0.36), v(0, 0.27)])),
    );
    flag.position.copy(summit);
    terrain.add(flag);
    const sun = accent(dot(0.13));
    scene.add(sun);
    return {
      scene,
      camera: view(0, 2.8, 6.2, [0, 0.4, 0]),
      update(t) {
        const f = ease(clamp(((t * 0.3) % 1.3) / 1.1));
        const x = -1.95 + f * 1.25;
        climber.position.set(x, height(x, -0.2) + 0.07, -0.2);
        const planted = ease(clamp((f - 0.96) * 25));
        flag.scale.set(1, Math.max(0.001, planted), 1);
        glow(climber, planted);
        terrain.rotation.y = Math.sin(t * 0.3) * 0.5;
        sun.position.set(
          Math.cos(t * 0.5) * 2,
          1.8 + Math.sin(t * 0.5) * 0.35,
          -1.5,
        );
      },
    };
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
    [
      [route, controller],
      [controller, model],
      [controller, page],
    ].forEach(([a, b]) => group.add(polyline([a.position, b.position], 0.3)));
    const stops = [route, controller, model, controller, page].map(
      (node) => node.position,
    );
    const request = accent(dot(0.08));
    group.add(request);
    const wake = trail(group, 7, 0.06, 2);
    return {
      scene,
      camera: view(0.4, 1.2, 6.4),
      update(t) {
        request.position.copy(along(stops, ease((t * 0.35) % 1)));
        wake(request.position);
        [route, controller, model, page].forEach((node) => {
          const near = Math.max(
            0,
            1 - request.position.distanceTo(node.position) * 2.5,
          );
          node.scale.setScalar(1 + near * 0.15);
          glow(node, near * 1.6);
        });
        group.rotation.y = Math.sin(t * 0.4) * 0.35;
      },
    };
  },
  // Python: a snake of dots slides along a figure of eight on a grid, and eats what it finds.
  snake() {
    const scene = new THREE.Scene();
    scene.add(new THREE.GridHelper(6, 6, gray(0.24), gray(0.09)));
    const body = Array.from({ length: 22 }, (_, k) => {
      const part = dot(0.13 - k * 0.004, 1 - k * 0.03);
      scene.add(part);
      return part;
    });
    const at = (s: number) => v(Math.sin(s) * 2, 0.13, Math.sin(s * 2) * 0.9);
    const apple = accent(dot(0.11));
    scene.add(apple);
    let next: number | null = null;
    let eaten = -10;
    let meals = 0;
    return {
      scene,
      camera: view(0, 4.6, 5.2, [0, 0, 0.2]),
      update(t) {
        body.forEach((part, k) => part.position.copy(at(t * 0.7 - k * 0.09)));
        const head = t * 0.7;
        if (next === null || head < next - 4) next = head + 1.2;
        if (head >= next) {
          eaten = t;
          meals++;
          next = head + 1.4 + random(meals) * 1.6;
        }
        apple.position.copy(at(next));
        apple.scale.setScalar(Math.max(0.001, ease(clamp((t - eaten) * 2))));
        glow(body[0], 1 - (t - eaten) * 1.5);
      },
    };
  },
  // Django: a form fills itself in, field after field, then it is sent and checked.
  form() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    group.add(outline(new THREE.PlaneGeometry(2.6, 2.6), 0.45));
    const lengths = [1.1, 1.5, 0.8];
    const fields: THREE.LineSegments[] = [];
    const texts = [0.7, 0.15, -0.4].map((y) => {
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
    const check = accent(
      polyline([v(-0.18, 0), v(-0.05, -0.13), v(0.2, 0.16)]),
    );
    check.position.set(0.55, -0.95, 0.1);
    group.add(button, check);
    return {
      scene,
      camera: view(0, 0, 6.2),
      update(t) {
        const p = (t * 0.7) % 6;
        const out = 1 - clamp(p - 5.2);
        texts.forEach((text, k) => {
          text.scale.x = Math.max(0.001, ease(clamp(p - k)) * lengths[k] * out);
        });
        const press = Math.max(0, 1 - Math.abs(p - 3.4) * 6);
        button.position.z = 0.07 - press * 0.1;
        glow(button, press * 1.5);
        fields.forEach((field, k) =>
          glow(field, Math.sin(clamp(p - k) * Math.PI) * 1.3),
        );
        tinted(check).opacity = clamp((p - 3.6) * 3) * out;
        group.rotation.set(-0.1, -0.3 + Math.sin(t * 0.4) * 0.2, 0);
      },
    };
  },
  // Machine learning: a cloud of points, and a line that learns their trend.
  fit() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    group.add(
      polyline([v(-2, -1.6), v(2, -1.6)], 0.5),
      polyline([v(-2, -1.6), v(-2, 1.5)], 0.5),
    );
    const slope = 0.55;
    const points = Array.from({ length: 26 }, (_, k) => {
      const x = -1.8 + random(k) * 3.6;
      const point = dot(0.05, 0.9);
      point.position.set(
        x,
        x * slope + (random(k + 40) - 0.5) * 0.9,
        (random(k + 80) - 0.5) * 0.6,
      );
      group.add(point);
      return [point, Math.abs(point.position.y - x * slope) < 0.14] as const;
    });
    const model = accent(polyline([v(-2.1, 0), v(2.1, 0)]));
    group.add(model);
    return {
      scene,
      camera: view(0, 0, 6.8),
      update(t) {
        const p = (t * 0.45) % 3;
        const learned = 1 - Math.exp(-p * 1.8) * Math.cos(p * 5);
        const reset = ease(clamp((p - 2.5) * 2));
        model.rotation.z = Math.atan(slope) * learned * (1 - reset);
        const fitted = clamp((p - 1.1) * 2) * (1 - reset);
        points.forEach(([point, close]) => glow(point, close ? fitted : 0));
        group.rotation.y = Math.sin(t * 0.35) * 0.4;
      },
    };
  },
  // Merise: two entities and the association between them.
  entities() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    [-1.7, 1.7].forEach((x) => {
      group.add(
        polyline([v(x - 0.55, 0.25, 0.06), v(x + 0.55, 0.25, 0.06)], 0.7),
      );
      [-0.02, -0.25].forEach((y) =>
        group.add(polyline([v(x - 0.38, y, 0.06), v(x + 0.22, y, 0.06)], 0.4)),
      );
      const entity = block(new THREE.BoxGeometry(1.1, 1.0, 0.1));
      entity.position.set(x, 0, 0);
      group.add(entity);
    });
    const association = circle(0.5, 0.9);
    group.add(
      association,
      polyline([v(-1.15, 0), v(-0.5, 0)], 0.6),
      polyline([v(0.5, 0), v(1.15, 0)], 0.6),
    );
    const tokens = [accent(dot(0.065)), accent(dot(0.065))];
    group.add(...tokens);
    return {
      scene,
      camera: view(0, 0.6, 6.3),
      update(t) {
        const p = (t * 0.6) % 2;
        const f = ease(p < 1 ? p : 2 - p);
        tokens[0].position.set(-1.15 + f * 0.65, 0, 0.05);
        tokens[1].position.set(1.15 - f * 0.65, 0, 0.05);
        const pulse = 1 + Math.max(0, 1 - Math.abs(f - 1) * 5) * 0.12;
        association.scale.set(pulse, 0.6 * pulse, 1);
        glow(association, (f - 0.8) * 5);
        group.rotation.set(0.1, Math.sin(t * 0.4) * 0.4, 0);
      },
    };
  },
  // UML: a class diagram, two classes that inherit from a third one.
  classes() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    const umlClass = (x: number, y: number) => {
      const box = new THREE.Group();
      box.add(block(new THREE.BoxGeometry(1.2, 0.95, 0.08)));
      box.add(
        polyline([v(-0.6, 0.2, 0.05), v(0.6, 0.2, 0.05)], 0.7),
        polyline([v(-0.6, -0.15, 0.05), v(0.6, -0.15, 0.05)], 0.7),
      );
      box.add(polyline([v(-0.3, 0.34, 0.05), v(0.3, 0.34, 0.05)], 0.9));
      [0.04, -0.3].forEach((line) =>
        box.add(polyline([v(-0.45, line, 0.05), v(0.2, line, 0.05)], 0.35)),
      );
      box.position.set(x, y, 0);
      group.add(box);
      return box;
    };
    const parent = umlClass(0, 0.85);
    umlClass(-1.4, -0.85);
    umlClass(1.4, -0.85);
    // Inheritance: the lines of the children meet under a hollow triangle.
    group.add(
      polyline([v(0, 0.375), v(-0.13, 0.17), v(0.13, 0.17), v(0, 0.375)]),
    );
    group.add(
      polyline(
        [v(-1.4, -0.375), v(-1.4, -0.05), v(1.4, -0.05), v(1.4, -0.375)],
        0.6,
      ),
      polyline([v(0, -0.05), v(0, 0.17)], 0.6),
    );
    const paths = [-1.4, 1.4].map((x) => [
      v(x, -0.375, 0.05),
      v(x, -0.05, 0.05),
      v(0, -0.05, 0.05),
      v(0, 0.17, 0.05),
    ]);
    const tokens = paths.map(() => {
      const token = accent(dot(0.06));
      group.add(token);
      return token;
    });
    return {
      scene,
      camera: view(0, 0.3, 6.0),
      update(t) {
        const f = ease((t * 0.45) % 1);
        tokens.forEach((token, k) => token.position.copy(along(paths[k], f)));
        glow(parent.children[0], (f - 0.82) / 0.18);
        group.rotation.set(0.05, Math.sin(t * 0.4) * 0.4, 0);
      },
    };
  },
  // Programmation orientée objet: a class, the mold, from which objects come one after
  // another; the newest one still carries the color of its creation.
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
      return [object, v(x, -0.6), link] as const;
    });
    return {
      scene,
      camera: view(0, 0.4, 6.0, [0, 0.1, 0]),
      update(t) {
        const cycle = (t * 0.25) % 1;
        const out = 1 - ease(clamp((cycle - 0.9) / 0.1));
        let pulse = 0;
        const starts = objects.map((_, k) => 0.08 + k * 0.24);
        const newest = starts.filter((start) => cycle > start).length - 1;
        objects.forEach(([object, target, link], k) => {
          const start = starts[k];
          const f = ease(clamp((cycle - start) / 0.2));
          pulse = Math.max(pulse, 1 - Math.abs(cycle - start) / 0.06);
          object.visible = cycle > start;
          object.position.copy(source).lerp(target, f);
          object.scale.setScalar(Math.max(0.001, (0.6 + 0.4 * f) * out));
          glow(object, k === newest ? 1 - f * 0.5 : 0);
          tinted(link).opacity = object.visible ? 0.25 * f * out : 0;
        });
        glow(mold, pulse);
        group.rotation.set(0.15, Math.sin(t * 0.4) * 0.45, 0);
      },
    };
  },
  // Principes SOLID: one large class splits into small classes, one responsibility each, which
  // all depend on the same interface.
  solid() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    const size = 0.5;
    const gap = 0.85;
    const pieces = Array.from({ length: 5 }, () => {
      const piece = block(new THREE.BoxGeometry(size, size, size), 0.9);
      group.add(piece);
      return piece;
    });
    const contract = outline(new THREE.BoxGeometry(4.0, 0.28, 0.28), 0.6);
    contract.position.y = 1.0;
    group.add(contract);
    const links = pieces.map(() => {
      const link = polyline([v(0, 0.86), v(0, size / 2)], 0);
      group.add(link);
      return link;
    });
    const token = accent(dot(0.06));
    group.add(token);
    return {
      scene,
      camera: view(0, 0.9, 6.0, [0, 0.4, 0]),
      update(t) {
        const cycle = (t * 0.3) % 1;
        const split =
          ease(clamp(cycle / 0.25)) * (1 - ease(clamp((cycle - 0.88) / 0.12)));
        token.visible = cycle > 0.3 && cycle < 0.8;
        token.position.set(-1.8 + 3.6 * clamp((cycle - 0.3) / 0.5), 1.0, 0.15);
        pieces.forEach((piece, k) => {
          piece.position.x = (k - 2) * (size + (gap - size) * split);
          links[k].position.x = piece.position.x;
          glow(
            piece,
            token.visible
              ? 1 - Math.abs(token.position.x - piece.position.x) / 0.35
              : 0,
          );
        });
        links.forEach((link) => {
          tinted(link).opacity = 0.5 * split;
        });
        group.rotation.set(0.2, Math.sin(t * 0.4) * 0.45, 0);
      },
    };
  },
  // Design patterns: the observer, a subject that notifies the objects that listen to it.
  observer() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    const subject = block(new THREE.BoxGeometry(0.8, 0.8, 0.8));
    group.add(subject);
    const places = [v(-1.7, 0.75), v(1.7, 0.75), v(-1.7, -0.75), v(1.7, -0.75)];
    const listeners = places.map((place) => {
      const listener = block(new THREE.BoxGeometry(0.5, 0.5, 0.5), 0.8);
      listener.position.copy(place);
      group.add(listener, polyline([v(0, 0), place], 0.3));
      return listener;
    });
    const pulses = places.map(() => {
      const pulse = accent(dot(0.06));
      group.add(pulse);
      return pulse;
    });
    return {
      scene,
      camera: view(0, 0.5, 6.4),
      update(t) {
        const cycle = (t * 0.5) % 1;
        const f = ease(clamp((cycle - 0.1) / 0.5));
        glow(subject, 1 - cycle / 0.2);
        pulses.forEach((pulse, k) => {
          pulse.visible = cycle > 0.1 && cycle < 0.6;
          pulse.position.copy(places[k]).multiplyScalar(f);
        });
        listeners.forEach((listener) =>
          glow(listener, cycle < 0.6 ? 0 : 1 - (cycle - 0.6) / 0.4),
        );
        group.rotation.set(0.15, Math.sin(t * 0.4) * 0.5, 0);
      },
    };
  },
  // MySQL: a query scans a table row by row and marks the rows it keeps.
  table() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    const columns = 4;
    const rows = 6;
    const w = 3.2;
    const h = 2.4;
    const rowHeight = h / rows;
    for (let r = 0; r <= rows; r++)
      group.add(
        polyline(
          [v(-w / 2, h / 2 - r * rowHeight), v(w / 2, h / 2 - r * rowHeight)],
          r <= 1 || r === rows ? 0.7 : 0.25,
        ),
      );
    for (let c = 0; c <= columns; c++)
      group.add(
        polyline(
          [
            v(-w / 2 + (c * w) / columns, h / 2),
            v(-w / 2 + (c * w) / columns, -h / 2),
          ],
          c === 0 || c === columns ? 0.7 : 0.25,
        ),
      );
    const rowY = (index: number) => h / 2 - (index + 1.5) * rowHeight;
    const kept = [1, 3, 4];
    const cursor = outline(new THREE.PlaneGeometry(w + 0.12, rowHeight + 0.06));
    group.add(cursor);
    const marks = kept.map((index) => {
      const mark = accent(dot(0.065));
      mark.position.set(-w / 2 - 0.25, rowY(index), 0);
      group.add(mark);
      return [mark, index] as const;
    });
    return {
      scene,
      camera: view(0, 0.3, 6.0),
      update(t) {
        const q = (t * 1.1) % 7;
        const index = Math.min(4, Math.floor(q));
        const place = Math.min(4, index + ease(clamp((q - index - 0.6) * 2.5)));
        cursor.position.set(0, h / 2 - (place + 1.5) * rowHeight, 0.02);
        cursor.visible = q < 5.2;
        const row = Math.round(place);
        glow(cursor, kept.includes(row) ? 1 - Math.abs(place - row) * 4 : 0);
        marks.forEach(([mark, markRow]) => {
          mark.visible = q > markRow + 0.3 && q < 6.6;
        });
        group.rotation.set(-0.1, Math.sin(t * 0.4) * 0.35, 0);
      },
    };
  },
  // PostgreSQL: a join links the rows of two tables, pair after pair.
  join() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    const rowsAt = (x: number) =>
      [0, 1, 2, 3, 4].map((k) => {
        const row = block(new THREE.BoxGeometry(1.0, 0.3, 0.08));
        row.position.set(x, 0.9 - k * 0.45, 0);
        group.add(row);
        return row;
      });
    const left = rowsAt(-1.4);
    const right = rowsAt(1.4);
    const pairs = [
      [0, 2],
      [1, 0],
      [2, 4],
      [3, 1],
      [4, 3],
    ];
    const links = pairs.map(([a, b]) => {
      const ya = left[a].position.y;
      const yb = right[b].position.y;
      const link = accent(
        polyline(
          new THREE.CatmullRomCurve3([
            v(-0.9, ya, 0.05),
            v(0, (ya + yb) / 2, 0.45),
            v(0.9, yb, 0.05),
          ]).getPoints(32),
          0,
        ),
      );
      group.add(link);
      return link;
    });
    return {
      scene,
      camera: view(0, 0.3, 6.0),
      update(t) {
        const p = (t * 0.8) % (pairs.length + 2);
        links.forEach((link, k) => {
          tinted(link).opacity =
            clamp(p - k) * (1 - clamp((p - pairs.length - 1) * 2)) * 0.8;
        });
        pairs.forEach(([a, b], k) => {
          const on = Math.max(0, 1 - Math.abs(p - k - 0.5) * 3);
          left[a].position.z = right[b].position.z = on * 0.15;
          glow(left[a], on * 1.4);
          glow(right[b], on * 1.4);
        });
        group.rotation.set(0.05, Math.sin(t * 0.4) * 0.35, 0);
      },
    };
  },
  // Cypress: the tests of a suite run one after the other and pass.
  checks() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    const rows = [0, 1, 2, 3, 4].map((k) => {
      const y = 0.9 - k * 0.45;
      const frame = outline(new THREE.PlaneGeometry(2.8, 0.34), 0.3);
      frame.position.y = y;
      const ring = circle(0.11, 0.3);
      ring.position.set(-1.15, y, 0.01);
      const check = polyline([v(-0.1, 0), v(-0.03, -0.07), v(0.12, 0.09)], 0);
      check.position.set(-1.15, y, 0.02);
      group.add(
        frame,
        polyline([v(-0.8, y), v(-0.2 + random(k) * 1.2, y)], 0.45),
        ring,
        check,
      );
      return { ring, check };
    });
    const spinner = accent(
      polyline(
        Array.from({ length: 17 }, (_, k) =>
          v(
            Math.cos((k / 16) * Math.PI * 1.4) * 0.11,
            Math.sin((k / 16) * Math.PI * 1.4) * 0.11,
          ),
        ),
      ),
    );
    group.add(spinner);
    return {
      scene,
      camera: view(0, 0.2, 5.4),
      update(t) {
        const p = (t * 0.9) % (rows.length + 2);
        rows.forEach(({ ring, check }, k) => {
          const done = p > k + 1 && p < rows.length + 1.6;
          tinted(check).opacity = done ? 1 : 0;
          tinted(ring).opacity = done ? 0.9 : 0.3;
          glow(check, 1 - (p - k - 1) * 1.5);
          glow(ring, 1 - Math.abs(p - rows.length - 0.4) * 2.5);
        });
        const current = Math.floor(p);
        spinner.visible = current < rows.length;
        spinner.position.set(
          -1.15,
          0.9 - Math.min(current, rows.length - 1) * 0.45,
          0.02,
        );
        spinner.rotation.z = -t * 6;
        group.rotation.set(-0.08, -0.3 + Math.sin(t * 0.4) * 0.2, 0);
      },
    };
  },
  // CI / CD: a change goes through the stages of the pipeline, then passes.
  pipeline() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    group.add(polyline([v(-2.4, 0), v(2.4, 0)], 0.25));
    const stages = [-1.8, -0.6, 0.6, 1.8].map((x) => {
      const stage = block(new THREE.BoxGeometry(0.7, 0.7, 0.7), 0.35);
      stage.position.x = x;
      group.add(stage);
      return stage;
    });
    const token = accent(dot(0.075));
    const wake = trail(group, 7, 0.055, 2);
    const check = accent(
      polyline([v(-0.2, 0), v(-0.06, -0.15), v(0.24, 0.2)], 0),
    );
    check.position.set(1.8, 0.75, 0);
    group.add(token, check);
    return {
      scene,
      camera: view(1.2, 1.6, 6.2),
      update(t) {
        const p = (t * 0.4) % 1.4;
        const x = -2.4 + clamp(p) * 4.8;
        token.position.x = x;
        token.visible = p < 1;
        wake(token.position, p < 1);
        stages.forEach((stage) => {
          tinted(stage).opacity = x > stage.position.x - 0.35 ? 1 : 0.35;
          const inside = Math.max(0, 1 - Math.abs(x - stage.position.x) * 3);
          stage.scale.setScalar(1 + inside * 0.12);
          glow(stage, p < 1 ? inside * 1.5 : 0);
        });
        tinted(check).opacity = p > 1 ? 1 : 0;
        group.rotation.y = Math.sin(t * 0.35) * 0.25;
      },
    };
  },
  // Claude Code: a terminal, where the lines of a session appear after the prompt.
  terminal() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    group.add(
      block(new THREE.BoxGeometry(3.4, 2.3, 0.06), 0.8),
      polyline([v(-1.7, 0.85, 0.04), v(1.7, 0.85, 0.04)], 0.5),
    );
    [0, 1, 2].forEach((k) => {
      const light = dot(0.045, 0.8);
      light.position.set(-1.5 + k * 0.15, 1.0, 0.04);
      group.add(light);
    });
    const lines = [1.6, 2.4, 1.1, 2.0, 1.4].map((length, k) => {
      const y = 0.55 - k * 0.32;
      const prompt = accent(
        polyline(
          [
            v(-1.45, y + 0.06, 0.04),
            v(-1.37, y, 0.04),
            v(-1.45, y - 0.06, 0.04),
          ],
          0.9,
        ),
      );
      const text = polyline([v(0, 0, 0.04), v(1, 0, 0.04)], 0.75);
      text.position.set(-1.25, y, 0);
      group.add(prompt, text);
      return { prompt, text, length, y };
    });
    const caret = accent(
      new THREE.Mesh(
        new THREE.PlaneGeometry(0.1, 0.18),
        new THREE.MeshBasicMaterial({ color: WHITE }),
      ),
    );
    group.add(caret);
    return {
      scene,
      camera: view(0, 0, 5.4),
      update(t) {
        const p = (t * 0.8) % (lines.length + 2);
        const shown = p < lines.length + 1.5;
        lines.forEach(({ prompt, text, length }, k) => {
          const f = clamp(p - k);
          text.scale.x = Math.max(0.001, f * length);
          text.visible = prompt.visible = f > 0 && shown;
        });
        const k = Math.min(lines.length - 1, Math.floor(p));
        const f = clamp(p - k);
        caret.position.set(
          -1.25 + f * lines[k].length + 0.08,
          lines[k].y,
          0.05,
        );
        caret.visible = shown && (f < 1 || Math.sin(t * 8) > 0);
        group.rotation.set(-0.08, -0.25 + Math.sin(t * 0.4) * 0.15, 0);
      },
    };
  },
  // Prompt engineering: a conversation, bubble after bubble, each one typed first.
  chat() {
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    scene.add(group);
    const bubbles = [
      [-0.5, 0.95, 2.0, 0.42],
      [0.55, 0.38, 1.6, 0.42],
      [-0.35, -0.24, 2.3, 0.62],
      [0.65, -0.88, 1.4, 0.42],
    ].map(([x, y, w, h], k) => {
      const bubble = new THREE.Group();
      bubble.add(block(new THREE.BoxGeometry(w, h, 0.08), k % 2 ? 1 : 0.6));
      (h > 0.5 ? [0.1, -0.1] : [0]).forEach((line, j) =>
        bubble.add(
          polyline(
            [
              v(-w / 2 + 0.18, line, 0.05),
              v(w / 2 - 0.18 - j * 0.5, line, 0.05),
            ],
            0.6,
          ),
        ),
      );
      bubble.position.set(x, y, 0);
      group.add(bubble);
      return bubble;
    });
    const typing = [0, 1, 2].map(() => {
      const point = accent(dot(0.05));
      group.add(point);
      return point;
    });
    return {
      scene,
      camera: view(0, 0, 5.6),
      update(t) {
        const p = (t * 0.7) % (bubbles.length + 2);
        const out = ease(clamp(p - bubbles.length - 1));
        bubbles.forEach((bubble, k) => {
          bubble.scale.setScalar(
            Math.max(0.001, ease(clamp((p - k - 0.5) * 3)) * (1 - out)),
          );
          glow(bubble.children[0], p > k + 0.5 ? 1 - (p - k - 0.5) * 1.2 : 0);
        });
        const next = Math.floor(p);
        const isTyping = next < bubbles.length && p - next < 0.5;
        typing.forEach((point, j) => {
          point.visible = isTyping;
          if (isTyping)
            point.position.set(
              bubbles[next].position.x - 0.16 + j * 0.16,
              bubbles[next].position.y +
                Math.max(0, Math.sin(t * 10 - j)) * 0.06,
              0.05,
            );
        });
        group.rotation.set(-0.05, Math.sin(t * 0.4) * 0.3, 0);
      },
    };
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
    return {
      scene,
      camera: view(0, 2.6, 6.4, [0, -0.1, 0]),
      update(t) {
        const laps = (t * 0.45) % 5;
        const built = Math.floor(laps);
        const lap = laps - built;
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
      },
    };
  },
} satisfies Partial<Record<SceneName, () => Scene>>;
