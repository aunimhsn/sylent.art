// The content collections of the site, whose front matter is checked at build time: a missing
// field fails the build instead of publishing a broken page (docs/technical-choices.md, Content).
// The checks across files (an order or a former id used twice) are in src/lib/offers.ts.
import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { SCENE_NAMES } from "./lib/scenes";

// The domains of the offers (specs.md, Training offers), one file per domain named after its
// slug. They group the modules on the home page and the offer list; no domain pages yet.
const domains = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/domains" }),
  schema: z.object({
    title: z.string(),
    /** One short sentence that says what the domain is for, not a list of notions. */
    summary: z.string(),
    /** The place of the domain on the home page and the offer list. */
    order: z.number().int(),
    /** The 3D scene of its cover (src/scripts/covers.ts). */
    scene: z.enum(SCENE_NAMES),
    /** A new offer, marked « Nouveau » with its modules. */
    isNew: z.boolean().default(false),
    /** A short note on the page of each of its modules (a new offer says so honestly). */
    note: z.string().optional(),
  }),
});

// The modules, one file per module named after its slug, which is its URL (/courses/<slug>/):
// the front matter gives its domain and key facts, the text its presentation. The audience,
// level, prerequisites, objectives and program are written with the owner module by module
// (step 8b of roadmap.md); until then the page shows them as to be defined.
const modules = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/modules" }),
  schema: z.object({
    title: z.string(),
    /** A shorter name where the full one doesn't fit on a line (the back of a domain card). */
    shortTitle: z.string().optional(),
    domain: reference("domains"),
    /** The place of the module in its domain. */
    order: z.number().int(),
    /** Indicative duration in days, always adaptable. */
    days: z.number().positive(),
    /** One short sentence that says what the module is for, not a list of notions. */
    summary: z.string(),
    scene: z.enum(SCENE_NAMES),
    /** The id of the course of the former site, whose URL (/courses/<id>) redirects here. */
    formerId: z.number().int().positive().optional(),
    /** Who the module is for, e.g. « Étudiants, développeurs, chefs de projet technique ». */
    audience: z.string().optional(),
    level: z.string().optional(),
    prerequisites: z.string().optional(),
    objectives: z.array(z.string()).min(1).optional(),
    /** The parts of the program, without numbers: they are not an order. */
    program: z
      .array(z.object({ title: z.string(), text: z.string() }))
      .min(1)
      .optional(),
  }),
});

export const collections = { domains, modules };
