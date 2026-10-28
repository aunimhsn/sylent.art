// The texts of the content files that hold a link or a stressed sentence (the legal notice, the
// privacy policy): a short Markdown-like syntax, `[text](url)` and `**text**`, read by
// src/components/rich-text.astro, so that the content stays plain text and Astro escapes it.
// `{email}` and the other keys of src/data/contact.json are replaced by their value, so that
// each contact detail is written once.
import contact from "../data/contact.json";

export type Part =
  | { kind: "text"; text: string }
  | { kind: "strong"; text: string }
  | { kind: "link"; text: string; url: string };

const token = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

/** A text with the contact details filled in: « {email} » becomes the address. */
export const fill = (text: string) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => {
    if (!(key in contact)) throw new Error(`Unknown contact detail ${match}`);
    return contact[key as keyof typeof contact];
  });

/** The parts of a text: plain text, links and stressed text, in order. */
export const partsOf = (text: string): Part[] => {
  const filled = fill(text);
  const parts: Part[] = [];
  let last = 0;
  for (const match of filled.matchAll(token)) {
    if (match.index > last) {
      parts.push({ kind: "text", text: filled.slice(last, match.index) });
    }
    const [, label, url, strong] = match;
    parts.push(
      strong === undefined
        ? { kind: "link", text: label, url }
        : { kind: "strong", text: strong },
    );
    last = match.index + match[0].length;
  }
  if (last < filled.length) {
    parts.push({ kind: "text", text: filled.slice(last) });
  }
  return parts;
};
