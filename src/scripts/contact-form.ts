// The behavior of the contact form (from docs/mockups/contact-site.html), imported by
// src/components/contact-form.astro: the checks next to each field, the sending to Formspree
// with fetch, and its outcome. The texts it shows come from the component (data attributes and
// a template), so that they stay in src/i18n/fr.json.
import "./thick-caret";

const byId = (id: string) => document.getElementById(id) as HTMLElement;

const form = byId("contact-form") as HTMLFormElement;
const alertBox = byId("form-alert");
const sendButton = byId("send");
const sendLabel = sendButton.textContent ?? "";
const failed = byId("form-failed") as HTMLTemplateElement;
const sent = byId("form-sent");
const trap = byId("gotcha") as HTMLInputElement;
const fields = ["email", "message"].map(
  (id) => byId(id) as HTMLInputElement | HTMLTextAreaElement,
);
// The script shows its own messages, next to each field, instead of the browser's.
form.noValidate = true;

// ── The checks next to each field ──────────────────────────────────────────────────────
const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function check(field: HTMLInputElement | HTMLTextAreaElement) {
  const value = field.value.trim();
  let message = value ? "" : (field.dataset.missing ?? "");
  if (field.id === "email" && value && !emailFormat.test(value)) {
    message = field.dataset.invalid ?? "";
  }
  field.setAttribute("aria-invalid", String(Boolean(message)));
  byId(`${field.id}-error`).textContent = message;
  return !message;
}

// A field is checked when the visitor leaves it, then again as they correct it.
fields.forEach((field) => {
  field.addEventListener("blur", () => check(field));
  for (const type of ["input", "change"]) {
    field.addEventListener(type, () => {
      if (field.getAttribute("aria-invalid") === "true") check(field);
    });
  }
});

// ── The sending and its outcome ────────────────────────────────────────────────────────
// While it sends, the button stays focusable (aria-disabled rather than disabled), so that the
// focus isn't lost, and a second press does nothing.
let sending = false;

function showSending(on: boolean) {
  sending = on;
  sendButton.setAttribute("aria-disabled", String(on));
  sendButton.textContent = on ? (sendButton.dataset.sending ?? "") : sendLabel;
}

/** Sends the form to Formspree; true once it has received it. */
async function send() {
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(20_000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (sending) return;
  alertBox.replaceChildren();
  const invalid = fields.filter((field) => !check(field));
  if (invalid.length > 0) {
    invalid[0].focus();
    return;
  }
  if (trap.value) return; // a robot
  showSending(true);
  const received = await send();
  showSending(false);
  if (!received) {
    // The failure, with the email address; the text typed stays in the fields.
    alertBox.replaceChildren(failed.content.cloneNode(true));
    return;
  }
  form.reset();
  form.hidden = true;
  sent.hidden = false;
  sent.querySelector("h2")?.focus();
});

// Another message: the form again, empty, with the focus on its first field.
byId("send-again").addEventListener("click", () => {
  sent.hidden = true;
  form.hidden = false;
  fields[0].focus();
});
