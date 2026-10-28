// Dates shown on the pages, in the language of src/i18n/fr.json.
import fr from "../i18n/fr.json";

/**
 * A date written YYYY-MM-DD, in full and on one line: « 28 octobre 2026 », « 1er novembre
 * 2026 ».
 */
export const longDate = (iso: string) =>
  new Intl.DateTimeFormat(fr.site.locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
    .formatToParts(new Date(`${iso}T00:00:00Z`))
    .map(({ type, value }) => {
      if (type === "day" && value === "1") return fr.dates.firstDay;
      return type === "literal" ? value.replaceAll(" ", "\u00a0") : value;
    })
    .join("");
