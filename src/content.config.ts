// The content collections of the site, whose front matter is checked at build time: a missing
// field fails the build instead of publishing a broken page (docs/technical-choices.md, Content).
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// The domains of the offers (specs.md, Training offers), one file per domain named after its
// slug, with its modules. Sample content of the mock-up until step 8 refines it with the owner.
const offers = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/offers" }),
  schema: z.object({
    title: z.string(),
    /** One short sentence that says what the domain is for, not a list of notions. */
    summary: z.string(),
    /** The place of the domain on the home page and the offer list. */
    order: z.number().int(),
    /** The 3D scene of its cover (src/scripts/covers.ts). */
    scene: z.string(),
    /** A new offer, marked « Nouveau » with its modules. */
    isNew: z.boolean().default(false),
    modules: z
      .array(
        z.object({
          title: z.string(),
          /** A shorter name where the full one doesn't fit on a line (the back of a domain card). */
          shortTitle: z.string().optional(),
          /** Indicative duration in days, always adaptable. */
          days: z.number().positive(),
          summary: z.string(),
          scene: z.string(),
        }),
      )
      .min(1),
  }),
});

export const collections = { offers };
