# DESAINS INGENIEROS — WEB CORPORATIVA

Sitio web corporativo de **DESAINS INGENIEROS SRL**: ingeniería estructural, investigación sísmica, BIM y construcción.
La experiencia principal es un hero 3D en el que el scroll recorre un edificio desde la **arquitectura** hasta la **estructura** y la **capa BIM**.

Todo el contenido (proyectos, profesionales, servicios, publicaciones y clientes) proviene del *Brochure institucional 2026* y vive en archivos de datos, no dentro de los componentes.

## Stack

| Área | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, generación estática), React 19.2, TypeScript |
| Estilos | Tailwind CSS 4 con tokens en variables CSS |
| 3D | Three.js 0.186, React Three Fiber 9.7, Drei 10.7 |
| Animación de interfaz | Anime.js 4 (textos, líneas SVG, menú, revelados) |
| Íconos | Phosphor Icons |
| Pruebas | Playwright |
| Deploy | Vercel |

> React se mantiene en 19.2 porque React Three Fiber 9.7 todavía no declara compatibilidad con React 19.3.

## Instalación y desarrollo local

Requisitos: Node.js 20.9 o superior.

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (74 páginas estáticas) |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Verificación de tipos |
| `npm run test:e2e` | Pruebas Playwright en escritorio y móvil |
| `npm run check` | Lint + tipos + build |

Las pruebas usan Microsoft Edge en Windows (`PW_CHANNEL=msedge`). En otros sistemas instale Chromium con `npx playwright install chromium`.
Para probar el sitio publicado: `PLAYWRIGHT_BASE_URL=https://su-dominio npm run test:e2e`.

## Estructura del proyecto

```text
src/
  app/                      Rutas (home, proyectos, servicios, innovación, profesionales, nosotros, contacto)
  components/
    home/                   Secciones del home (HeroExperience, slider, servicios, innovación…)
    projects/               Explorador con filtros, ficha, galería y video
    three/building/         Edificio procedural del hero (model.ts = geometría, BuildingScene.tsx = escena)
    three/logo/             Logo 3D de 6 piezas
    three/model/            Visor de modelos .glb para proyectos
    layout/ brand/ ui/ …    Cabecera, pie, logo y componentes base
  config/
    company.ts              Datos de contacto (único lugar para editarlos)
    navigation.ts           Menú y textos de botones
    social.ts               Redes sociales
    site.ts                 URL pública y metadatos
  data/
    projects/               Proyectos por grupo + taxonomía de servicios y sectores
    professionals/          Plantel técnico
    services/               Servicios y estudios especiales
    publications/           Artículos Q1, ponencias, revisiones, software SOFIPS y disipador
    clients/                Clientes
    about/                  Historia, misión, visión, valores y cifras
    home/hero.ts            Textos del hero 3D
    generated/images.ts     Manifiesto de imágenes (generado)
public/
  images/                   Imágenes optimizadas en WebP
  models/                   Modelos 3D descargables (.glb)
  fonts/                    Fuente para las etiquetas 3D
scripts/                    Exportación de modelos y capturas de revisión
tests/e2e/                  Pruebas Playwright
```

## Configuración de contacto y WhatsApp

Edite solo `src/config/company.ts`:

```ts
phone: "+51998487401",          // enlaces tel:
phoneDisplay: "+51 998 487 401",
whatsapp: "51998487401",        // código de país + número, solo dígitos
email: "arnold.r.mendo@gmail.com",
messages: {
  general: "Hola, quisiera información sobre un proyecto de ingeniería.",
  quote: "Hola, quisiera solicitar una cotización para un proyecto.",
  project: "Hola, quiero iniciar un proyecto con DESAINS Ingenieros.",
}
```

Todos los botones (flotante, contacto, pie de página y formulario) generan sus enlaces `https://wa.me/…`, `mailto:` y `tel:` a partir de ese archivo.
El formulario **no envía datos a ningún servidor**: arma el mensaje y lo abre en WhatsApp o en el correo del visitante.

## Dónde editar el contenido

| Contenido | Archivo |
|---|---|
| Proyectos | `src/data/projects/*.ts` (edificaciones, infraestructura, construcción, especiales) |
| Filtros (servicios y tipos de proyecto) | `src/data/projects/taxonomy.ts` |
| Profesionales | `src/data/professionals/index.ts` |
| Servicios y estudios especiales | `src/data/services/index.ts` |
| Publicaciones, software y disipador | `src/data/publications/index.ts` |
| Clientes | `src/data/clients/index.ts` |
| Historia, misión, visión y cifras | `src/data/about/index.ts` |
| Textos del hero 3D | `src/data/home/hero.ts` |

Un proyecto admite: `location`, `region`, `year`, `client`, `status`, `role`, `description`, `challenge`, `solution`, `engineering`, `keyFacts`, `participants`, `video`, `model3d`.
Las secciones de la ficha se muestran **solo si el campo tiene datos**. No agregue cifras que no estén respaldadas.

### Imágenes de proyectos

1. Guarde la imagen en `public/images/projects/<slug>/NN.webp` (máx. 1600 px de ancho, calidad ≈80).
2. Agregue la entrada en `src/data/generated/images.ts` con `src`, `width` y `height`.

La primera imagen es la portada. Si su ancho es de 1000 px o más, se muestra a pantalla completa.

## Colores

Los tokens están en `src/app/globals.css`, dentro del bloque `@theme static`:

| Token | Uso |
|---|---|
| `--color-canvas`, `--color-surface`, `--color-surface-2` | Fondos |
| `--color-fg`, `--color-fg-2`, `--color-fg-3` | Texto (contraste 16,1:1 · 9,1:1 · 6,3:1) |
| `--color-steel`, `--color-navy` | Primario (azul acero) y secundario (azul profundo) |
| `--color-gold`, `--color-gold-hover`, `--color-focus` | Acento único, hover y foco |
| `--color-3d-architecture`, `--color-3d-structure`, `--color-3d-bim` … | Colores de la escena 3D |

La escena 3D lee estas mismas variables en tiempo de ejecución, así que no hay que duplicar colores.

## Cómo añadir videos

En el proyecto correspondiente:

```ts
video: { src: "/videos/mi-proyecto.mp4", poster: "/videos/mi-proyecto.webp", title: "Recorrido de obra" }
```

Use MP4 H.264 comprimido (idealmente menos de 15 MB). El video no se precarga (`preload="none"`), muestra el póster y se pausa al salir de pantalla.

## Cómo añadir modelos 3D

1. Exporte el modelo BIM o 3D a `.glb` (Revit → glTF, Blender, etc.) y comprímalo con Draco o Meshopt:
   `npx @gltf-transform/cli optimize entrada.glb public/models/mi-proyecto.glb --compress meshopt`
2. En el proyecto: `model3d: "/models/mi-proyecto.glb"`.

La ficha mostrará el botón **Ver modelo 3D**. Three.js se descarga solo cuando el visitante lo pulsa.

### Modelos incluidos (`public/models`)

| Archivo | Contenido |
|---|---|
| `edificio-desains.glb` | Edificio del hero, organizado por capas (`Arquitectura` / `Estructura`), niveles (`Nivel_XX_…`) y elementos (vidrio, montantes, columnas, vigas, losa, núcleo, arriostres, disipadores) |
| `logo-desains.glb` | Logo con las 6 piezas del ícono y cada letra de *DESAINS* e *INGENIEROS* como objeto independiente, con el pivote en su centro |

Para regenerarlos:

```bash
node scripts/export-models.mjs <carpeta-fuentes-typeface> public/models
```

## Variables de entorno

Copie `.env.example` a `.env.local` si necesita cambiarlas. Ninguna es secreta.

| Variable | Uso |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canónica (sitemap, Open Graph). En Vercel se usa automáticamente el dominio de producción si no se define |

## Deploy en Vercel

1. Importe el repositorio de GitHub en <https://vercel.com/new>. El framework se detecta automáticamente y no hace falta configurar el build.
2. Opcional: defina `NEXT_PUBLIC_SITE_URL` con el dominio final.
3. Cada push a `main` genera un deploy de producción.

Con la CLI: `npx vercel --prod`

### Dominio propio

En Vercel → *Project → Settings → Domains*, agregue por ejemplo `desainsingenieros.com` y configure los DNS que Vercel indique. Luego actualice `NEXT_PUBLIC_SITE_URL`. No se requieren cambios de código.

## Accesibilidad y rendimiento

- HTML semántico, enlace para saltar al contenido, foco visible, menú móvil con trampa de foco y cierre con Escape.
- `prefers-reduced-motion`: el hero pasa a una versión estática y se desactivan las animaciones.
- El 3D se carga en diferido, pausa el render fuera de pantalla y usa *instancing* (~12 llamadas de dibujo). En móvil usa menos niveles.
- Imágenes en WebP/AVIF con `next/image`, fuentes con `next/font` y páginas pre-renderizadas.
