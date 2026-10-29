// The offers, read from the domains and modules collections (src/content.config.ts) for the
// home page, the domains page, the domain pages and the module pages. The checks that span several files run here,
// so that a content error fails the build (docs/technical-choices.md, Content).
import { getCollection, type CollectionEntry } from "astro:content";
import courses from "../content/courses.json";

export type Domain = CollectionEntry<"domains">;
export type Module = CollectionEntry<"modules">;
export interface Offer {
  domain: Domain;
  /** The modules of the domain, in their order. */
  modules: Module[];
}

/** The values used more than once, to name them in the error. */
const twice = <T>(values: T[]) =>
  values.filter((value, index) => values.indexOf(value) !== index);

/**
 * The domains in their order, each with its published modules in theirs; a domain whose modules
 * are all drafts is left out. Fails the build on an order used twice, a domain without modules,
 * a module of an unknown domain, a former id used twice, or a module slug that is a number,
 * drafts included. A slug is unique within its domain only (the module python of the domain
 * python), and the file names keep the module slugs unique across the site.
 */
export async function getOffers(): Promise<Offer[]> {
  const domains = (await getCollection("domains")).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const modules = (await getCollection("modules")).sort(
    (a, b) => a.data.order - b.data.order,
  );
  const errors: string[] = [];
  const ids = domains.map(({ id }) => id);

  for (const order of twice(domains.map(({ data }) => data.order))) {
    errors.push(`two domains have the order ${order}`);
  }
  for (const module of modules) {
    if (!ids.includes(module.data.domain.id)) {
      errors.push(`${module.id}: unknown domain ${module.data.domain.id}`);
    }
    if (/^\d+$/.test(module.id)) {
      errors.push(`${module.id}: a module slug can't be a number`);
    }
  }
  for (const formerId of twice(
    modules.flatMap(({ data }) => data.formerId ?? []),
  )) {
    errors.push(`two modules have the former id ${formerId}`);
  }

  const offers = domains.map((domain) => ({
    domain,
    modules: modules.filter(({ data }) => data.domain.id === domain.id),
  }));
  for (const { domain, modules } of offers) {
    if (modules.length === 0) errors.push(`${domain.id}: no modules`);
    for (const order of twice(modules.map(({ data }) => data.order))) {
      errors.push(`${domain.id}: two modules have the order ${order}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid offers:\n- ${errors.join("\n- ")}`);
  }
  return offers
    .map(({ domain, modules }) => ({
      domain,
      modules: modules.filter(({ data }) => !data.draft),
    }))
    .filter(({ modules }) => modules.length > 0);
}

/** The path of the page of a domain, without the base: `/domaines/<domain>/`. */
export const domainPath = (id: string) => `/domaines/${id}/`;

/** The path of the page of a module, without the base: `/domaines/<domain>/modules/<module>/`. */
export const modulePath = ({ id, data }: Module) =>
  `/domaines/${data.domain.id}/modules/${id}/`;

/** The draft modules, kept out of the site. */
export const getDrafts = async (): Promise<Module[]> =>
  getCollection("modules", ({ data }) => data.draft);

/** The indicative duration of a module: « 3 jours, adaptable ». */
export const durationOf = (days: number) =>
  courses.module.days[
    new Intl.PluralRules("fr").select(days) === "one" ? "one" : "other"
  ].replace("{days}", days.toLocaleString("fr"));
