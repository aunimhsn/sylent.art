// Internal links go through this helper: until the launch, the site is also built under the
// /sylent.art base of its github.io preview (docs/technical-choices.md, Deployment), and a link
// written without the base would lead to a 404 there.

/** The path of a page of the site, with the base: `href("/a-propos/")`, `href("/domaines/programmation/")`. */
export const href = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;

/**
 * The `aria-current` value of a navigation link: `page` on the page itself, `true` on a page
 * inside its section or one of the other sections it stands for (a module page and a domain
 * page mark « Formations »), nothing elsewhere.
 */
export const currentOf = (
  link: string,
  current: string,
  also: string[] = [],
) => {
  if (current === href(link)) return "page";
  const sections = [link, ...also].filter((section) => section !== "/");
  if (sections.some((section) => current.startsWith(href(section)))) {
    return "true";
  }
  return undefined;
};
