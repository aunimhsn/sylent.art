// The thick caret of the contact fields and the scrollbar of the message (from
// docs/mockups/contact-site.html), imported by src/scripts/contact-form.ts; their styles are in
// src/components/contact-form.astro.

// ── The thicker caret ─────────────────────────────────────────────────────────────────
// A hidden copy of the field, with the same font, size, padding and wrapping, holds the text up
// to the caret followed by a marker: the position of the marker is the position of the caret.
// It is placed again on every event that can move it, since browsers don't all report the moves
// of the caret inside a field (selectionchange is recent there).
// An email field doesn't give the position of its caret: the email field becomes a text field
// with an email keyboard (inputmode), and the address is checked by the form script.
const COPIED = [
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "font-style",
  "font-variant",
  "font-weight",
  "font-stretch",
  "font-size",
  "font-size-adjust",
  "line-height",
  "font-family",
  "font-kerning",
  "font-feature-settings",
  "text-align",
  "text-transform",
  "text-indent",
  "letter-spacing",
  "word-spacing",
  "tab-size",
];

type Field = HTMLInputElement | HTMLTextAreaElement;

function thickCaret(fields: Field[]) {
  const mirror = document.createElement("div");
  mirror.setAttribute("aria-hidden", "true");
  Object.assign(mirror.style, {
    position: "absolute",
    top: "0",
    left: "-9999px",
    visibility: "hidden",
    overflow: "hidden",
    boxSizing: "content-box",
    border: "0",
  });
  document.body.append(mirror);

  function caretPoint(field: Field) {
    const style = getComputedStyle(field);
    const single = field.nodeName === "INPUT";
    COPIED.forEach((property) => {
      mirror.style.setProperty(property, style.getPropertyValue(property));
    });
    // The copy wraps its text at the width of the text of the field, without its scrollbar,
    // which is thinner than the default one that the copy would show.
    const paddings =
      parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    mirror.style.width = `${field.clientWidth - paddings}px`;
    mirror.style.whiteSpace = single ? "pre" : "pre-wrap";
    mirror.style.overflowWrap = single ? "normal" : "break-word";
    const end = field.selectionEnd ?? field.value.length;
    mirror.textContent = field.value.slice(0, end);
    const marker = document.createElement("span");
    marker.textContent = field.value.slice(end) || ".";
    mirror.append(marker);
    const lineHeight =
      parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
    return { top: marker.offsetTop, left: marker.offsetLeft, lineHeight };
  }

  document.documentElement.classList.add("has-caret");
  fields.forEach((field) => {
    if (field instanceof HTMLInputElement) field.type = "text";
    const caret = document.createElement("span");
    caret.className = "caret";
    caret.hidden = true;
    caret.setAttribute("aria-hidden", "true");
    field.after(caret);
    let frame = 0;

    function place() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const collapsed = field.selectionStart === field.selectionEnd;
        if (
          document.activeElement !== field ||
          !collapsed ||
          field.classList.contains("is-composing")
        ) {
          caret.hidden = true;
          return;
        }
        const point = caretPoint(field);
        const height = point.lineHeight * 0.92;
        const top =
          point.top - field.scrollTop + (point.lineHeight - height) / 2;
        const left = point.left - field.scrollLeft;
        // Out of the visible part of the field (scrolled away): nothing to draw.
        caret.hidden =
          top < 0 ||
          top + height > field.clientHeight + 1 ||
          left > field.clientWidth;
        Object.assign(caret.style, {
          top: `${field.offsetTop + top}px`,
          left: `${field.offsetLeft + left - 1}px`,
          height: `${height}px`,
        });
        // Solid while it moves, then blinking, as a native caret.
        caret.classList.remove("is-blinking");
        void caret.offsetWidth;
        caret.classList.add("is-blinking");
      });
    }
    for (const type of [
      "focus",
      "blur",
      "input",
      "keydown",
      "keyup",
      "click",
      "mousedown",
      "mouseup",
      "select",
      "scroll",
      "selectionchange",
    ]) {
      field.addEventListener(type, place);
    }
    document.addEventListener("selectionchange", () => {
      if (document.activeElement === field) place();
    });
    addEventListener("resize", place);
    field.addEventListener("compositionstart", () => {
      field.classList.add("is-composing");
      place();
    });
    field.addEventListener("compositionend", () => {
      field.classList.remove("is-composing");
      place();
    });
  });
}

const fields = [...document.querySelectorAll<Field>("#contact-form .input")];
// Touch screens keep their native caret, which they move with a finger.
if (matchMedia("(pointer: fine)").matches) thickCaret(fields);

// ── The scrollbar of the message: shown while it scrolls, and a moment after ──────────────
const message = document.getElementById("message");
let scrollEnd: ReturnType<typeof setTimeout> | undefined;
message?.addEventListener(
  "scroll",
  () => {
    message.classList.add("is-scrolling");
    clearTimeout(scrollEnd);
    scrollEnd = setTimeout(() => message.classList.remove("is-scrolling"), 900);
  },
  { passive: true },
);
