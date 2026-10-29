// The names of the 3D scenes of the covers (src/scripts/covers.ts), without the DOM: the schema
// of the content refuses an unknown name (src/content.config.ts), and the covers must draw every
// name, so that a typo fails the build instead of leaving a cover empty.

/** The scenes of the domains, of the cycle of a lesson (spiral) and of the custom request. */
const homeScenes = [
  "steps",
  "web",
  "chart",
  "database",
  "branch",
  "network",
  "board",
  "blueprint",
  "spiral",
  "custom",
] as const;

/** The scenes of the modules; a module may also take the scene of a domain. */
const moduleScenes = [
  "flowchart",
  "markup",
  "layout",
  "event",
  "server",
  "tree",
  "peaks",
  "mvc",
  "snake",
  "form",
  "fit",
  "entities",
  "classes",
  "instances",
  "solid",
  "observer",
  "table",
  "join",
  "checks",
  "pipeline",
  "deploy",
  "terminal",
  "chat",
  "sprint",
] as const;

export const SCENE_NAMES = [...homeScenes, ...moduleScenes] as const;

export type SceneName = (typeof SCENE_NAMES)[number];
