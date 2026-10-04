// Renderiza index.html a MP4 vertical 1080x1920 @30fps.
// Uso: node render.mjs   (requiere playwright y ffmpeg)
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright"); // npm i playwright, o NODE_PATH=$(npm root -g)
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const frames = path.join(dir, ".frames");
rmSync(frames, { recursive: true, force: true });
mkdirSync(frames);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto("file://" + path.join(dir, "index.html") + "?render");
await page.evaluate(() => document.fonts.ready);
const { DURATION, FPS } = await page.evaluate(() => ({ DURATION: window.DURATION, FPS: window.FPS }));
const total = Math.round(DURATION * FPS);
const stage = page.locator("#stage");
for (let f = 0; f < total; f++) {
  await page.evaluate(t => window.seek(t), f / FPS);
  await stage.screenshot({ path: path.join(frames, `f${String(f).padStart(4, "0")}.png`) });
}
await browser.close();

execFileSync("node", [path.join(dir, "music.mjs")], { stdio: "inherit" });
execFileSync("ffmpeg", ["-y", "-v", "error", "-framerate", String(FPS), "-i", path.join(frames, "f%04d.png"),
  "-i", path.join(dir, ".music.wav"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium",
  "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", path.join(dir, "loxita-promo.mp4")], { stdio: "inherit" });
rmSync(frames, { recursive: true, force: true });
rmSync(path.join(dir, ".music.wav"), { force: true });
console.log("Listo: loxita-promo.mp4");
