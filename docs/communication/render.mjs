// Renders the Instagram story (story.html) into an MP4 of 1080 × 1920 at 30 frames per second,
// in outputs/, frame by frame: the timeline is set to each frame's time, then captured, so that
// the video is smooth whatever the speed of the computer. From the repository root:
//
//   node docs/communication/render.mjs a           # variant A, the teaser
//   node docs/communication/render.mjs b --launch  # variant B, the launch version
//
// Needs ffmpeg with libx264.
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const FPS = 30;
const variant = process.argv[2] ?? "a";
const launch = process.argv.includes("--launch");
const date = new Date().toISOString().slice(0, 10);
const output = `outputs/${date}-story-${variant}${launch ? "-launch" : ""}.mp4`;

const server = await createServer({
  root: fileURLToPath(new URL(".", import.meta.url)),
  server: { port: 0 },
  logLevel: "error",
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
  });
  const query = new URLSearchParams({ variant, capture: "1" });
  if (launch) query.set("launch", "1");
  await page.goto(`${server.resolvedUrls.local[0]}story.html?${query}`);
  await page.waitForFunction(() => document.documentElement.dataset.ready);
  const duration = await page.evaluate(() => window.story.duration);

  const ffmpeg = spawn(
    "ffmpeg",
    [
      ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", FPS],
      ["-i", "-", "-c:v", "libx264", "-preset", "slow", "-crf", "16"],
      ["-pix_fmt", "yuv420p", "-movflags", "+faststart", output],
    ]
      .flat()
      .map(String),
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const frames = Math.round(duration * FPS);
  for (let frame = 0; frame < frames; frame++) {
    await page.evaluate((time) => window.story.seek(time), frame / FPS);
    const image = await page.screenshot({ type: "png" });
    if (!ffmpeg.stdin.write(image)) await once(ffmpeg.stdin, "drain");
    if (frame % FPS === 0) process.stdout.write(`\r${frame / FPS} s`);
  }
  ffmpeg.stdin.end();
  const [code] = await once(ffmpeg, "close");
  if (code !== 0) throw new Error(`ffmpeg exited with ${code}`);
  console.log(`\r${output}`);
} finally {
  await browser.close();
  await server.close();
}
