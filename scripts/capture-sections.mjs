// Captura cada seccion de una pagina como imagen independiente.
// Uso: node scripts/capture-sections.mjs <url> <carpeta> [ancho] [prefijo]
// REDUCED=1 emula prefers-reduced-motion (muestra todo sin animaciones).
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const url = process.argv[2];
const out = process.argv[3] ?? "captures";
const width = Number(process.argv[4] ?? 1440);
const prefix = process.argv[5] ?? "sec";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({
  viewport: { width, height: 900 },
  reducedMotion: process.env.REDUCED ? "reduce" : "no-preference",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(url, { waitUntil: "load" });
await page.waitForTimeout(2500);

const sections = page.locator("main > section, main > div > section, main > article > section, footer");
const n = await sections.count();
for (let i = 0; i < n; i++) {
  const s = sections.nth(i);
  await s.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const box = await s.boundingBox();
  if (!box || box.height < 40) continue;
  await s.screenshot({ path: `${out}/${prefix}-${String(i).padStart(2, "0")}.png` });
}
console.log(JSON.stringify({ sections: n, errors }));
await browser.close();
