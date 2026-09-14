// Captura el hero 3D en varios puntos del scroll para revisar las fases.
// Uso: node scripts/capture-hero.mjs [url] [carpeta] [ancho] [alto]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3000";
const out = process.argv[3] ?? "captures";
const width = Number(process.argv[4] ?? 1440);
const height = Number(process.argv[5] ?? 900);
const points = (process.env.POINTS ?? "0,0.3,0.5,0.7,0.95").split(",").map(Number);
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "msedge", args: ["--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(url, { waitUntil: "load" });
await page.waitForSelector("canvas", { timeout: 20000 });
await page.waitForTimeout(3500);

for (const p of points) {
  await page.evaluate((p) => {
    const s = document.querySelector("section");
    window.scrollTo(0, (s.offsetHeight - innerHeight) * p);
  }, p);
  await page.waitForTimeout(3200);
  await page.screenshot({ path: `${out}/hero-${width}-${String(p).replace(".", "_")}.png` });
}
console.log(JSON.stringify({ captured: points.length, errors }));
await browser.close();
