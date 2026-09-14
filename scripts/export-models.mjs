// Exporta los modelos 3D del sitio a .glb con piezas separadas y nombradas para animacion.
// Uso: node scripts/export-models.mjs <carpeta-fuentes-ttf> [carpeta-salida]
//   Fuentes esperadas: ArchivoExpanded-ExtraBold.typeface.json y ArchivoExpanded-Medium.typeface.json
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import { Font } from "three/examples/jsm/loaders/FontLoader.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { buildModel, levelElevation } from "../src/components/three/building/model.ts";
import { LOGO_VIEWBOX, logoPieces } from "../src/lib/logo-geometry.ts";

const fontsDir = process.argv[2];
const outDir = process.argv[3] ?? "public/models";
mkdirSync(outDir, { recursive: true });

// GLTFExporter usa FileReader para generar el binario; Node no lo trae.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((r) => {
      this.result = r;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((r) => {
      this.result = `data:${blob.type || "application/octet-stream"};base64,${Buffer.from(r).toString("base64")}`;
      this.onloadend?.();
    });
  }
};

const mat = (name, color, extra = {}) => new THREE.MeshPhysicalMaterial({ name, color, roughness: 0.5, metalness: 0.1, ...extra });

async function save(scene, file) {
  const data = await new GLTFExporter().parseAsync(scene, { binary: true });
  writeFileSync(`${outDir}/${file}`, Buffer.from(data));
  console.log(file, `${(data.byteLength / 1024).toFixed(0)} KB`);
}

/** Une cajas en una geometria con el pivote en `origin`. */
function mergeBoxes(boxes, origin) {
  const geos = boxes.map((b) => {
    const g = new THREE.BoxGeometry(b.s[0], b.s[1], b.s[2]);
    const m = new THREE.Matrix4().compose(
      new THREE.Vector3(b.p[0] - origin.x, b.p[1] - origin.y, b.p[2] - origin.z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(0, b.ry ?? 0, b.rz ?? 0)),
      new THREE.Vector3(1, 1, 1),
    );
    g.applyMatrix4(m);
    return g;
  });
  return mergeGeometries(geos);
}

// ---------------- Edificio ----------------
async function exportBuilding() {
  const floors = 12;
  const model = buildModel({ floors, fins: true });
  const materials = {
    glass: mat("Vidrio", "#6f8ba8", { metalness: 0.6, roughness: 0.1, transmission: 0.35, transparent: true, opacity: 0.85 }),
    mullion: mat("Montantes", "#2b3441", { metalness: 0.8, roughness: 0.35 }),
    frame: mat("Fachada", "#d9d4ca"),
    column: mat("Columnas", "#7fa6d4", { metalness: 0.2 }),
    beam: mat("Vigas", "#9fbde0", { metalness: 0.2 }),
    slab: mat("Losas", "#8c949e"),
    core: mat("Nucleo", "#1b3a5c"),
    brace: mat("Arriostres", "#7fa6d4", { metalness: 0.6, roughness: 0.4 }),
    damper: mat("Disipadores", "#c9a35b", { metalness: 0.7, roughness: 0.35 }),
    concrete: mat("Cimentacion", "#8c949e", { roughness: 0.9 }),
  };

  const root = new THREE.Group();
  root.name = "Edificio_DESAINS";
  const arch = new THREE.Group();
  arch.name = "Arquitectura";
  const struct = new THREE.Group();
  struct.name = "Estructura";
  root.add(arch, struct);

  const layer = (parent, name, boxes, material, level) => {
    if (!boxes.length) return;
    const origin = new THREE.Vector3(0, levelElevation(Math.min(level, floors)), 0);
    const mesh = new THREE.Mesh(mergeBoxes(boxes, origin), material);
    mesh.name = name;
    mesh.position.copy(origin);
    parent.add(mesh);
  };
  const byLevel = (items, lv) => items.filter((b) => b.level === lv);

  for (let lv = 0; lv <= floors; lv++) {
    const tag = `Nivel_${String(lv).padStart(2, "0")}`;
    const a = new THREE.Group();
    a.name = `${tag}_Arquitectura`;
    layer(a, `${tag}_Vidrio`, byLevel(model.facade.glass, lv), materials.glass, lv);
    layer(a, `${tag}_Montantes`, byLevel(model.facade.mullions, lv), materials.mullion, lv);
    layer(a, `${tag}_Bandas`, byLevel(model.facade.spandrels, lv), materials.frame, lv);
    if (a.children.length) arch.add(a);

    const s = new THREE.Group();
    s.name = `${tag}_Estructura`;
    const st = model.structure;
    layer(s, `${tag}_Columnas`, byLevel(st.columns, lv), materials.column, lv);
    layer(s, `${tag}_Vigas`, byLevel(st.beams, lv), materials.beam, lv);
    layer(s, `${tag}_Losa`, byLevel(st.slabs, lv), materials.slab, lv);
    layer(s, `${tag}_Nucleo`, byLevel(st.cores, lv), materials.core, lv);
    layer(s, `${tag}_Arriostres`, byLevel(st.braces, lv), materials.brace, lv);
    layer(s, `${tag}_Disipadores`, byLevel(st.dampers, lv), materials.damper, lv);
    if (s.children.length) struct.add(s);
  }
  layer(arch, "Parteluces", model.facade.fins, materials.frame, 0);
  const found = new THREE.Mesh(new THREE.BoxGeometry(...model.foundation.s), materials.concrete);
  found.name = "Cimentacion";
  found.position.set(...model.foundation.p);
  struct.add(found);

  await save(root, "edificio-desains.glb");
}

// ---------------- Logo ----------------
/** Fuentes en formato typeface JSON (generadas con desains-assets/tools/ttf_to_typeface.py). */
function loadFont(file) {
  return new Font(JSON.parse(readFileSync(file, "utf8")));
}

async function exportLogo() {
  const S = 1 / 110;
  const cx = LOGO_VIEWBOX.x + LOGO_VIEWBOX.width / 2;
  const cy = LOGO_VIEWBOX.y + LOGO_VIEWBOX.height / 2;
  const blue = mat("Icono_Vidrio_Azul", "#2f8cff", { metalness: 0.1, roughness: 0.05, transmission: 0.55, thickness: 0.4, clearcoat: 1, emissive: "#0a3d8f", emissiveIntensity: 0.35 });
  const black = mat("Texto_Negro_Brillante", "#0b0d10", { metalness: 0.9, roughness: 0.25, clearcoat: 1 });

  const root = new THREE.Group();
  root.name = "Logo_DESAINS";
  const icon = new THREE.Group();
  icon.name = "Icono";
  root.add(icon);

  for (const p of logoPieces) {
    const map = ([x, y]) => new THREE.Vector2((x - cx) * S, -(y - cy) * S);
    const shape = new THREE.Shape(p.outer.map(map));
    if (p.hole) shape.holes.push(new THREE.Path(p.hole.map(map)));
    const depth = 0.55 * p.depth;
    const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.035, bevelSegments: 2, curveSegments: 4 });
    geo.computeBoundingBox();
    const c = new THREE.Vector3();
    geo.boundingBox.getCenter(c);
    geo.translate(-c.x, -c.y, -c.z);
    const mesh = new THREE.Mesh(geo, blue);
    mesh.name = `Icono_${p.name.replace(/\s+/g, "_")}`;
    mesh.position.copy(c);
    icon.add(mesh);
  }

  const bold = loadFont(`${fontsDir}/ArchivoExpanded-ExtraBold.typeface.json`);
  const medium = loadFont(`${fontsDir}/ArchivoExpanded-Medium.typeface.json`);
  const word = (text, font, size, depth, x, y, name, tracking) => {
    const group = new THREE.Group();
    group.name = name;
    let cursor = 0;
    const scale = size / font.data.resolution;
    for (const [i, ch] of [...text].entries()) {
      const glyph = font.data.glyphs[ch];
      const shapes = font.generateShapes(ch, size);
      const geo = new THREE.ExtrudeGeometry(shapes, { depth, bevelEnabled: true, bevelThickness: depth * 0.18, bevelSize: size * 0.012, bevelSegments: 2, curveSegments: 5 });
      geo.computeBoundingBox();
      const c = new THREE.Vector3();
      geo.boundingBox.getCenter(c);
      geo.translate(-c.x, -c.y, -c.z);
      const mesh = new THREE.Mesh(geo, black);
      mesh.name = `${name}_${String(i + 1).padStart(2, "0")}_${ch}`;
      mesh.position.set(x + cursor + c.x, y + c.y, c.z);
      group.add(mesh);
      cursor += glyph.ha * scale + tracking;
    }
    root.add(group);
    return cursor;
  };
  word("DESAINS", bold, 1.55, 0.35, 3.6, 0.05, "Texto_DESAINS", 0.06);
  word("INGENIEROS", medium, 0.78, 0.2, 3.62, -1.35, "Texto_INGENIEROS", 0.16);

  await save(root, "logo-desains.glb");
}

await exportBuilding();
await exportLogo();
