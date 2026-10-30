// The offers, read from the domains, collections and modules (src/content.config.ts) for the
// home page, the formations page, the domain, formation and module pages. A collection is shown
// to visitors as a « formation » (specs.md, Training offers): the code says Formation for a
// collection with its published modules. The checks that span several files run here, so that a
// content error fails the build (docs/technical-choices.md, Content).
import { getCollection, type CollectionEntry } from "astro:content";

export type Domain = CollectionEntry<"domains">;
export type Collection = CollectionEntry<"collections">;
export type Module = CollectionEntry<"modules">;

/** A collection with its published modules, in the advised order, and the domains it is in. */
export interface Formation {
  collection: Collection;
  modules: Module[];
  /** The domains where at least one of its published modules is filed, in their order. */
  domains: Domain[];
}

/** A formation in a domain, with only its modules filed under the domain. */
export interface Filed {
  formation: Formation;
  modules: Module[];
}

/** A domain with its formations, in the order of its file. */
export interface Offer {
  domain: Domain;
  formations: Filed[];
}

export interface Catalog {
  /** The domains in their order; a domain whose modules are all drafts is left out. */
  offers: Offer[];
  /** The collections with at least one published module. */
  formations: Formation[];
  /** The draft modules, kept out of the site. */
  drafts: Module[];
}

/** The values used more than once, to name them in the error. */
const twice = <T>(values: T[]) =>
  values.filter((value, index) => values.indexOf(value) !== index);

/** The slug of the collection of a module, the folder of its file: `php` for `php/poo`. */
export const collectionIdOf = ({ id }: Module) => id.split("/")[0];

const byOrder = <T extends { data: { order: number } }>(a: T, b: T) =>
  a.data.order - b.data.order;

/**
 * Reads the offers and fails the build on an order used twice (domains, or modules of one
 * collection), a former id used twice, a module slug that is a number, a module of an unknown
 * collection or domain, a collection without modules, a domain whose list of collections misses
 * one of its modules' or names one without any, or a collection of two published modules without
 * a summary; drafts are checked too. A module slug is unique within its collection only
 * (`fondamentaux` in several), the folders keep the paths unique.
 */
async function readCatalog(): Promise<Catalog> {
  const domains = (await getCollection("domains")).sort(byOrder);
  const collections = await getCollection("collections");
  const modules = (await getCollection("modules")).sort(byOrder);
  const errors: string[] = [];
  const domainIds = domains.map(({ id }) => id);
  const collectionIds = collections.map(({ id }) => id);

  for (const order of twice(domains.map(({ data }) => data.order))) {
    errors.push(`two domains have the order ${order}`);
  }
  for (const module of modules) {
    if (/^\d+$/.test(module.id.split("/")[1])) {
      errors.push(`${module.id}: a module slug can't be a number`);
    }
    if (!collectionIds.includes(collectionIdOf(module))) {
      errors.push(`${module.id}: unknown collection ${collectionIdOf(module)}`);
    }
    for (const { id } of module.data.domains) {
      if (!domainIds.includes(id)) {
        errors.push(`${module.id}: unknown domain ${id}`);
      }
    }
  }
  for (const formerId of twice(
    modules.flatMap(({ data }) => data.formerId ?? []),
  )) {
    errors.push(`two modules have the former id ${formerId}`);
  }

  const modulesOf = (collection: Collection) =>
    modules.filter((module) => collectionIdOf(module) === collection.id);
  for (const collection of collections) {
    const own = modulesOf(collection);
    if (own.length === 0) errors.push(`${collection.id}: no modules`);
    for (const order of twice(own.map(({ data }) => data.order))) {
      errors.push(`${collection.id}: two modules have the order ${order}`);
    }
    const published = own.filter(({ data }) => !data.draft);
    if (published.length > 1 && !collection.data.summary) {
      errors.push(`${collection.id}: a page without a summary`);
    }
  }
  for (const domain of domains) {
    const listed = domain.data.collections.map(({ id }) => id);
    const filed = new Set(
      modules
        .filter(({ data }) => data.domains.some(({ id }) => id === domain.id))
        .map(collectionIdOf),
    );
    for (const id of twice(listed)) {
      errors.push(`${domain.id}: the collection ${id} is listed twice`);
    }
    for (const id of filed) {
      if (!listed.includes(id)) {
        errors.push(`${domain.id}: a module of ${id}, which it doesn't list`);
      }
    }
    for (const id of listed) {
      if (!filed.has(id)) {
        errors.push(`${domain.id}: lists ${id}, which has no module there`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid offers:\n- ${errors.join("\n- ")}`);
  }

  const isFiled = (module: Module, domain: Domain) =>
    module.data.domains.some(({ id }) => id === domain.id);
  const formations = collections.flatMap((collection): Formation[] => {
    const published = modulesOf(collection).filter(({ data }) => !data.draft);
    if (published.length === 0) return [];
    const where = domains.filter((domain) =>
      published.some((module) => isFiled(module, domain)),
    );
    return [{ collection, modules: published, domains: where }];
  });
  const offers = domains.flatMap((domain): Offer[] => {
    const filed = domain.data.collections.flatMap(({ id }): Filed[] => {
      const formation = formations.find(
        ({ collection }) => collection.id === id,
      );
      const own = formation?.modules.filter((module) =>
        isFiled(module, domain),
      );
      return formation && own?.length ? [{ formation, modules: own }] : [];
    });
    return filed.length > 0 ? [{ domain, formations: filed }] : [];
  });
  return {
    offers,
    formations,
    drafts: modules.filter(({ data }) => data.draft),
  };
}

let catalog: Promise<Catalog> | undefined;

/** The offers, read and checked once per build. */
export const getCatalog = () => (catalog ??= readCatalog());

/** The domains in their order, each with its formations; see {@link Catalog}. */
export const getOffers = async () => (await getCatalog()).offers;

/** A formation of a single published module is shown by its name and leads to the module. */
export const isSingle = ({ modules }: Formation) => modules.length === 1;

/** The published domains of a module, in its order: the first one first. */
export const domainsOf = (catalog: Catalog, module: Module) =>
  module.data.domains.flatMap(
    ({ id }) => catalog.offers.find(({ domain }) => domain.id === id) ?? [],
  );

/** The new domain of a module, if any: the modules of a new domain are new too. */
export const newDomainOf = (catalog: Catalog, module: Module) =>
  domainsOf(catalog, module).find(({ domain }) => domain.data.isNew)?.domain;

/** The path of the page of a domain, without the base: `/domaines/<domain>/`. */
export const domainPath = (id: string) => `/domaines/${id}/`;

/** The path of the page of a module, without the base: `/formations/<collection>/<module>/`. */
export const modulePath = ({ id }: Module) => `/formations/${id}/`;

/**
 * Where a formation leads, without the base: its page, `/formations/<collection>/`, or its module
 * when it has only one.
 */
export const formationPath = (formation: Formation) =>
  isSingle(formation)
    ? modulePath(formation.modules[0])
    : `/formations/${formation.collection.id}/`;
