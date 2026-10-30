// The content collections of the site, whose front matter is checked at build time: a missing
// field fails the build instead of publishing a broken page (docs/technical-choices.md, Content).
// The checks across files (an order or a former id used twice, a domain that misses one of its
// collections) are in src/lib/offers.ts.
//
// The offers have three levels (specs.md, Training offers): the domains, the shelves where a
// school looks; the collections, one subject each, shown to visitors as « formations », which
// give the modules their address; the modules, the unit a client books.
import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { SCENE_NAMES } from "./lib/scenes";

// A text shown on a page: an empty one would leave an empty fact or bullet.
const text = z.string().trim().min(1);

// The domains, one file per domain named after its slug, which ends the URL of its page
// (/domaines/<slug>/). Entry points only: no address of a collection or module depends on them.
const domains = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/domains" }),
  schema: z.object({
    title: z.string(),
    /** One word, the large faded word behind a module alone in its collection (« Web »). */
    ghost: z.string().regex(/^\S+$/, "one word"),
    /** One short sentence that says what the domain is for, not a list of notions. */
    summary: z.string(),
    /** The place of the domain on the home page and the formations page. */
    order: z.number().int(),
    /** The 3D scene of its cover (src/scripts/covers.ts). */
    scene: z.enum(SCENE_NAMES),
    /** A new offer, marked « Nouveau » with its modules. */
    isNew: z.boolean().default(false),
    /** A short note on its page and on each of its modules' (a new offer says so honestly). */
    note: z.string().optional(),
    /**
     * Its collections, in the order of its page: every collection with a module filed under the
     * domain, drafts included, and no other (src/lib/offers.ts). A collection may be in several
     * domains, in another order in each.
     */
    collections: z.array(reference("collections")).min(1),
  }),
});

// The collections, the « formations » of the visitors, one file per collection named after its
// slug, which starts the URL of its modules (/formations/<slug>/). A collection of a single
// published module is shown by its own name and leads to the module; from two, it has its page.
const collectionsOfModules = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/collections" }),
  schema: z.object({
    title: z.string(),
    /** The summary of its page, required once it has two published modules (src/lib/offers.ts). */
    summary: z.string().optional(),
  }),
});

// The modules, one file per module in the folder of its collection, named after its slug, which
// ends its URL (/formations/<collection>/<slug>/): the front matter gives its domains, its key
// facts, its prerequisites, objectives and program, the text its presentation.
const modules = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/modules" }),
  schema: z.object({
    title: z.string(),
    /** The domains where it is filed, the first one first (its faded word when it is alone). */
    domains: z.array(reference("domains")).min(1),
    /** Its place in the advised order of its collection. */
    order: z.number().int(),
    /** Indicative duration in days, kept for the quotes: no page shows a duration. */
    days: z.number().positive(),
    /** One short sentence that says what the module is for, not a list of notions. */
    summary: z.string(),
    scene: z.enum(SCENE_NAMES),
    /** A framework of the language of its collection (Laravel in PHP), marked « Framework ». */
    framework: z.boolean().default(false),
    /**
     * A draft stays in the repository but out of the site, until the owner publishes it: no
     * page, no card. Its former URL, if any, leads to the page of its collection meanwhile, or of
     * its first domain when the collection has no page.
     */
    draft: z.boolean().default(false),
    /** The id of the course of the former site, whose URL (/courses/<id>) redirects here. */
    formerId: z.number().int().positive().optional(),
    /** Who the module is for, one audience per line, e.g. « Étudiants », « Développeurs ». */
    audience: z.array(text).min(1),
    level: text,
    prerequisites: text,
    objectives: z.array(text).min(1),
    /** The parts of the program, without numbers: they are not an order. */
    program: z.array(z.object({ title: text, text })).min(1),
  }),
});

export const collections = {
  domains,
  collections: collectionsOfModules,
  modules,
};
