/**
 * A text without its accents: the large uppercase titles and faded words drop them, since the
 * mask of their animation would cut them (an exception accepted by the owner, CLAUDE.md).
 */
export const withoutAccents = (text: string) =>
  text.normalize("NFD").replace(/\p{M}/gu, "");
