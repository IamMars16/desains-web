// Capturas de la primera pantalla (o de un desplazamiento) de varias rutas.
// Uso: node scripts/capture-views.mjs <baseUrl> <carpeta> <ancho>x<alto> ruta[@scrollY] ...
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const [base, out, size, ...routes] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
const context = await browser.newContext({
  viewport: { width, height },
  isMobile: width < 768,
  hasTouch: width < 768,
  reducedMotion: process.env.REDUCED ? "reduce" : "no-preference",
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()}: ${m.text()}`));

let i = 0;
for (const r of routes) {
  const [route, scroll] = r.split("@");
  await page.goto(base + route, { waitUntil: "load" });
  await page.waitForTimeout(1800);
  if (scroll) {
    await page.evaluate((y) => window.scrollTo(0, y), Number(scroll));
    await page.waitForTimeout(1500);
  }
  const name = `${String(i++).padStart(2, "0")}-${width}-${route.replace(/[^a-z0-9]+/gi, "_") || "home"}.png`;
  await page.screenshot({ path: `${out}/${name}` });
}
console.log(JSON.stringify({ captured: i, errors }));
await browser.close();
