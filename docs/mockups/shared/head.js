// Loaded in the <head> of every page, before the first paint, so that nothing flashes.
// ?motion=off shows a page without animations, as for a visitor who asked their system to reduce
// motion; ?debug=1 shows the script errors in a red band at the top of the page; ?signal=d63c1c
// tries another signal color, set by the bar of home.html.
const query = new URLSearchParams(location.search);
if (/^[0-9a-f]{6}$/i.test(query.get("signal") || "")) document.documentElement.style.setProperty("--signal", `#${query.get("signal")}`);
const reduced = query.get("motion") === "off" || matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.dataset.motion = reduced ? "off" : "on";
if (query.has("debug")) {
  const show = text => document.body.insertAdjacentHTML("afterbegin", `<pre style="position:fixed;z-index:999;top:0;left:0;right:0;white-space:pre-wrap;background:#c00;color:#fff;font:14px monospace">${text}</pre>`);
  addEventListener("error", event => show(`${event.message} ${event.filename}:${event.lineno}`));
  addEventListener("unhandledrejection", event => show(`rejection ${event.reason && event.reason.stack || event.reason}`));
}
