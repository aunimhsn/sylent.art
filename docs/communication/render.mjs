// Renders a video of the launch (story.html) into an MP4 at 30 frames per second, in outputs/,
// frame by frame: the timeline is set to each frame's time, then captured, so that the video is
// smooth whatever the speed of the computer. A variant with a sound (D) gets it as AAC. From the
// repository root:
//
//   node docs/communication/render.mjs a                  # variant A, story, teaser
//   node docs/communication/render.mjs d --feed --launch  # variant D, feeds, launch version
//
// Needs ffmpeg with libx264.
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";
import { RATE } from "./sound.js";

const FPS = 30;
const variant = process.argv[2] ?? "a";
const launch = process.argv.includes("--launch");
const feed = process.argv.includes("--feed");
const date = new Date().toISOString().slice(0, 10);
const name = [date, feed ? "feed" : "story", variant, launch && "launch"]
  .filter(Boolean)
  .join("-");
const output = `outputs/${name}.mp4`;

/** Mono 16-bit PCM samples as a WAV file. */
function wav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((sample, index) =>
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, sample)) * 32767), index * 2),
  );
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

const server = await createServer({
  root: fileURLToPath(new URL(".", import.meta.url)),
  server: { port: 0 },
  logLevel: "error",
});
await server.listen();
const browser = await chromium.launch();
const scratch = await mkdtemp(join(tmpdir(), "story-"));
try {
  const page = await browser.newPage({
    viewport: { width: 1080, height: feed ? 1350 : 1920 },
  });
  const query = new URLSearchParams({ variant, controlled: "1" });
  if (feed) query.set("format", "feed");
  if (launch) query.set("launch", "1");
  await page.goto(`${server.resolvedUrls.local[0]}story.html?${query}`);
  await page.waitForFunction(() => document.documentElement.dataset.ready);
  const duration = await page.evaluate(() => window.story.duration);
  const samples = await page.evaluate(() => {
    const sound = window.story.sound();
    return sound && Array.from(sound);
  });
  const audio = samples && join(scratch, "sound.wav");
  if (audio) await writeFile(audio, wav(samples));

  const ffmpeg = spawn(
    "ffmpeg",
    [
      ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", FPS],
      ["-i", "-"],
      audio ? ["-i", audio, "-c:a", "aac", "-b:a", "192k", "-shortest"] : [],
      ["-c:v", "libx264", "-preset", "slow", "-crf", "16"],
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
  await rm(scratch, { recursive: true, force: true });
}
