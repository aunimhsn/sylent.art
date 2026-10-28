// Internal links go through this helper: until the launch, the site is also built under the
// /sylent.art base of its github.io preview (docs/technical-choices.md, Deployment), and a link
// written without the base would lead to a 404 there.

/** The path of a page of the site, with the base: `href("/about/")`, `href("/courses/#web")`. */
export const href = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;

/**
 * The `aria-current` value of a navigation link: `page` on the page itself, `true` on a page
 * inside its section (a module page marks « Formations »), nothing elsewhere.
 */
export const currentOf = (link: string, current: string) => {
  const target = href(link);
  if (current === target) return "page";
  if (link !== "/" && current.startsWith(target)) return "true";
  return undefined;
};
