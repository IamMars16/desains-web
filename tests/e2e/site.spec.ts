import { expect, test, type Page } from "@playwright/test";

const pages = ["/", "/proyectos", "/servicios", "/innovacion", "/profesionales", "/nosotros", "/contacto"];
const isMobile = (page: Page) => (page.viewportSize()?.width ?? 1440) < 768;

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/Download the React DevTools/.test(m.text())) errors.push(m.text());
  });
  return errors;
}

test.describe("páginas principales", () => {
  for (const path of pages) {
    test(`${path} carga sin errores, con un h1 y sin scroll horizontal`, async ({ page }) => {
      const errors = collectErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await page.waitForTimeout(800);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
      const imgsSinAlt = await page.locator("img:not([alt])").count();
      expect(imgsSinAlt).toBe(0);
      expect(errors).toEqual([]);
    });
  }
});

test("el hero 3D carga el canvas WebGL y el scroll avanza por las fases", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("section canvas").first()).toBeVisible({ timeout: 15_000 });
  const hero = page.locator("section").first();
  const height = await hero.evaluate((el) => el.getBoundingClientRect().height);
  await page.evaluate((h) => window.scrollTo(0, (h - window.innerHeight) * 0.9), height);
  await expect(page.getByRole("heading", { name: "Ingeniería digital antes de construir." })).toBeVisible();
});

test("navegación: proyectos, ficha y siguiente proyecto", async ({ page }) => {
  await page.goto("/proyectos");
  const first = page.locator("main article h3 a").first();
  const title = (await first.textContent())?.trim() ?? "";
  await first.click();
  await expect(page).toHaveURL(/\/proyectos\/.+/);
  await expect(page.locator("h1")).toHaveText(title);
  const next = page.getByRole("link", { name: /Siguiente proyecto/ });
  await next.click();
  await expect(page).toHaveURL(/\/proyectos\/.+/);
  await expect(page.locator("h1")).not.toHaveText(title);
});

test("filtros de proyectos actualizan resultados y URL", async ({ page }) => {
  await page.goto("/proyectos");
  const counter = page.locator("[aria-live=polite]");
  const total = await counter.textContent();
  await page.getByRole("button", { name: /^BIM/ }).click();
  await expect(page).toHaveURL(/servicio=bim/);
  await expect(counter).not.toHaveText(total ?? "");
  await page.goto("/proyectos?servicio=supervision");
  await expect(page.getByRole("button", { name: /^Supervisión/ })).toHaveAttribute("aria-pressed", "true");
});

test("profesional abre su perfil", async ({ page }) => {
  await page.goto("/profesionales");
  await page.getByRole("link", { name: "Arnold Ramsey Mendo Rodríguez" }).click();
  await expect(page).toHaveURL(/\/profesionales\/arnold-mendo/);
  await expect(page.getByRole("heading", { name: "Formación" })).toBeVisible();
});

test("enlaces de WhatsApp, correo y teléfono salen de la configuración", async ({ page }) => {
  await page.goto("/contacto");
  const wa = page.locator('a[href^="https://wa.me/"]');
  expect(await wa.count()).toBeGreaterThan(1);
  await expect(wa.first()).toHaveAttribute("href", /^https:\/\/wa\.me\/51998487401\?text=.+/);
  await expect(page.locator('a[href^="mailto:arnold.r.mendo@gmail.com"]').first()).toBeAttached();
  await expect(page.locator('a[href="tel:+51998487401"]').first()).toBeAttached();
});

test("formulario de proyecto valida campos obligatorios", async ({ page }) => {
  await page.goto("/contacto");
  await page.getByRole("button", { name: "Enviar por WhatsApp" }).click();
  await expect(page.getByText("Escriba su nombre.")).toBeVisible();
  await expect(page.getByLabel(/^Nombre/)).toHaveAttribute("aria-invalid", "true");
});

test("menú móvil abre, navega y se cierra con Escape", async ({ page }) => {
  test.skip(!isMobile(page), "solo móvil");
  await page.goto("/servicios");
  await page.getByRole("button", { name: "Abrir menú" }).click();
  const menu = page.getByRole("dialog", { name: "Menú" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await page.getByRole("button", { name: "Abrir menú" }).click();
  await menu.getByRole("link", { name: "Innovación" }).click();
  await expect(page).toHaveURL(/\/innovacion/);
});

test("navegación de escritorio visible y enlazada", async ({ page }) => {
  test.skip(isMobile(page), "solo escritorio");
  await page.goto("/nosotros");
  const nav = page.getByRole("navigation", { name: "Principal" });
  for (const label of ["Proyectos", "Servicios", "Innovación", "Profesionales", "Nosotros"]) {
    await expect(nav.getByRole("link", { name: label })).toBeVisible();
  }
  await nav.getByRole("link", { name: "Servicios" }).click();
  await expect(page).toHaveURL(/\/servicios/);
});

test("404, sitemap y robots", async ({ page, request }) => {
  const res = await page.goto("/ruta-que-no-existe");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Esta página no existe." })).toBeVisible();
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("/proyectos/puente-billinghurst");
  expect((await request.get("/robots.txt")).ok()).toBeTruthy();
  expect((await request.get("/opengraph-image")).ok()).toBeTruthy();
});

test("enlaces internos del home responden 200", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.$$eval("a[href^='/']", (as) => [...new Set(as.map((a) => a.getAttribute("href")!.split("#")[0]))]);
  for (const href of hrefs) {
    const r = await request.get(href);
    expect(r.status(), href).toBe(200);
  }
});
