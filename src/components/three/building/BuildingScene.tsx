"use client";

import { Billboard, Environment, Grid, Lightformer, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { AXIS_X, AXIS_Z, GRID_X, GRID_Z, buildModel, levelElevation, type Box } from "./model";
import type { ScenePalette } from "./palette";

export interface BuildingSceneProps {
  palette: ScenePalette;
  mobile: boolean;
  /** Devuelve el progreso objetivo 0..1 (scroll). */
  getProgress: () => number;
  /** Recibe el progreso suavizado en cada frame. */
  onFrame?: (p: number) => void;
  /** Pose fija para movimiento reducido. */
  staticPose?: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();
const tmpP = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const tmpC = new THREE.Color();

function compose(b: Box, offset?: THREE.Vector3, scale?: THREE.Vector3) {
  tmpP.set(b.p[0], b.p[1], b.p[2]);
  if (offset) tmpP.add(offset);
  tmpE.set(0, b.ry ?? 0, b.rz ?? 0);
  tmpQ.setFromEuler(tmpE);
  tmpS.set(b.s[0], b.s[1], b.s[2]);
  if (scale) tmpS.multiply(scale);
  return tmpM.compose(tmpP, tmpQ, tmpS);
}

function useInstances(items: Box[], material: THREE.Material, shadeColor?: THREE.Color) {
  const mesh = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const m = new THREE.InstancedMesh(geo, material, items.length);
    items.forEach((b, i) => {
      m.setMatrixAt(i, compose(b));
      if (shadeColor) m.setColorAt(i, tmpC.copy(shadeColor).multiplyScalar(b.shade ?? 1));
    });
    m.frustumCulled = false;
    return m;
  }, [items, material, shadeColor]);
  useEffect(() => () => mesh.geometry.dispose(), [mesh]);
  return mesh;
}

function edgesOf(boxes: Box[]) {
  const pts: number[] = [];
  for (const b of boxes) {
    const [cx, cy, cz] = b.p;
    const [hx, hy, hz] = [b.s[0] / 2, b.s[1] / 2, b.s[2] / 2];
    const c = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ].map(([x, y, z]) => [cx + x * hx, cy + y * hy, cz + z * hz]);
    const e = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    for (const [a, z] of e) pts.push(...c[a], ...c[z]);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

export function BuildingScene({ palette, mobile, getProgress, onFrame, staticPose }: BuildingSceneProps) {
  const floors = mobile ? 9 : 12;
  const model = useMemo(() => buildModel({ floors, fins: !mobile }), [floors, mobile]);
  const { camera, size } = useThree();

  const colors = useMemo(
    () => ({
      canvas: new THREE.Color(palette.canvas),
      glass: new THREE.Color(palette.glass),
      arch: new THREE.Color(palette.architecture),
      concrete: new THREE.Color(palette.concrete),
      steel: new THREE.Color(palette.structure),
      bim: new THREE.Color(palette.bim),
      navy: new THREE.Color(palette.navy),
      warm: new THREE.Color("#f1d7a6"),
    }),
    [palette],
  );

  const mats = useMemo(() => {
    const glass = new THREE.MeshStandardMaterial({
      color: "#ffffff",
      metalness: 0.6,
      roughness: 0.1,
      transparent: true,
      opacity: 0.84,
      envMapIntensity: 2.2,
      depthWrite: false,
    });
    const frame = new THREE.MeshStandardMaterial({ color: colors.arch, roughness: 0.5, metalness: 0.2, transparent: true });
    const mullion = new THREE.MeshStandardMaterial({ color: "#2b3441", roughness: 0.35, metalness: 0.8, transparent: true });
    const light = new THREE.MeshBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const column = new THREE.MeshStandardMaterial({ color: colors.concrete, roughness: 0.75, metalness: 0.1, transparent: true });
    const beam = column.clone();
    const slab = new THREE.MeshStandardMaterial({ color: colors.concrete, roughness: 0.85, transparent: true });
    const core = new THREE.MeshStandardMaterial({ color: colors.concrete, roughness: 0.8, transparent: true });
    const brace = new THREE.MeshStandardMaterial({ color: colors.steel, roughness: 0.4, metalness: 0.6 });
    const damper = new THREE.MeshStandardMaterial({ color: colors.bim, emissive: colors.bim, emissiveIntensity: 0.2, roughness: 0.35, metalness: 0.7 });
    const edges = new THREE.LineBasicMaterial({ color: colors.steel, transparent: true, opacity: 0 });
    const axis = new THREE.LineBasicMaterial({ color: colors.bim, transparent: true, opacity: 0 });
    return { glass, frame, mullion, light, column, beam, slab, core, brace, damper, edges, axis };
  }, [colors]);

  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  const glassMesh = useInstances(model.facade.glass, mats.glass, colors.glass);
  const mullionMesh = useInstances(model.facade.mullions, mats.mullion);
  const spandrelMesh = useInstances(model.facade.spandrels, mats.frame);
  const finMesh = useInstances(model.facade.fins, mats.frame);
  const lightMesh = useInstances(model.facade.lights, mats.light, colors.warm);
  const columnMesh = useInstances(model.structure.columns, mats.column);
  const beamMesh = useInstances(model.structure.beams, mats.beam);
  const slabMesh = useInstances(model.structure.slabs, mats.slab);
  const coreMesh = useInstances(model.structure.cores, mats.core);
  const braceMesh = useInstances(model.structure.braces, mats.brace);
  const damperMesh = useInstances(model.structure.dampers, mats.damper);

  const edgeGeo = useMemo(() => edgesOf([...model.structure.columns, ...model.structure.beams]), [model]);
  const axisGeo = useMemo(() => {
    const pts: number[] = [];
    const ext = 7;
    GRID_X.forEach((x) => pts.push(x, 0.03, GRID_Z[0] - ext, x, 0.03, GRID_Z[GRID_Z.length - 1] + ext));
    GRID_Z.forEach((z) => pts.push(GRID_X[0] - ext, 0.03, z, GRID_X[GRID_X.length - 1] + ext, 0.03, z));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  useEffect(() => () => { edgeGeo.dispose(); axisGeo.dispose(); }, [edgeGeo, axisGeo]);

  const group = useRef<THREE.Group>(null);
  const labels = useRef<THREE.Group>(null);
  const current = useRef(staticPose ?? 0);
  const last = useRef(-1);
  const offset = useMemo(() => new THREE.Vector3(), []);
  const scale = useMemo(() => new THREE.Vector3(), []);

  const camFrom = useMemo(() => new THREE.Vector3(...(mobile ? [104, 40, 132] : [86, 33, 107])), [mobile]);
  const camTo = useMemo(() => new THREE.Vector3(...(mobile ? [118, 128, 118] : [94, 104, 94])), [mobile]);
  const lookFrom = useMemo(() => new THREE.Vector3(0, mobile ? 31 : 21, 0), [mobile]);
  const lookTo = useMemo(() => new THREE.Vector3(0, mobile ? 24 : 16, 0), [mobile]);
  const look = useMemo(() => new THREE.Vector3(), []);

  // Encuadre: en escritorio el edificio queda a la derecha del texto.
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (size.width >= 1024) cam.setViewOffset(size.width, size.height, -size.width * 0.17, 0, size.width, size.height);
    else if (size.width >= 768) cam.setViewOffset(size.width, size.height, -size.width * 0.1, 0, size.width, size.height);
    // En movil el edificio baja a la mitad inferior para dejar el texto arriba.
    else cam.setViewOffset(size.width, size.height, 0, -size.height * 0.26, size.width, size.height);
    cam.updateProjectionMatrix();
  }, [camera, size]);

  const apply = (p: number, t: number) => {
    const levels = floors;

    // ---- Fachada: se separa por niveles, de arriba hacia abajo ----
    const explodeAt = (level: number) => {
      const start = 0.36 + (1 - level / levels) * 0.14;
      return smooth(start, start + 0.12, p);
    };
    const move = (items: Box[], mesh: THREE.InstancedMesh, dist: number) => {
      items.forEach((b, i) => {
        const k = explodeAt(b.level);
        const n = b.n ?? [0, 0];
        offset.set(n[0] * dist * k, 1.2 * k, n[1] * dist * k);
        mesh.setMatrixAt(i, compose(b, offset));
      });
      mesh.instanceMatrix.needsUpdate = true;
    };
    move(model.facade.glass, glassMesh, 8);
    move(model.facade.mullions, mullionMesh, 6);
    move(model.facade.spandrels, spandrelMesh, 7);
    move(model.facade.fins, finMesh, 10);

    const facadeFade = 1 - smooth(0.42, 0.64, p);
    const mullionFade = 1 - smooth(0.36, 0.5, p);
    mats.glass.opacity = 0.84 * facadeFade;
    mats.frame.opacity = facadeFade;
    mats.mullion.opacity = mullionFade;
    mats.glass.visible = mats.frame.visible = facadeFade > 0.01;
    mats.mullion.visible = mullionFade > 0.01;
    mats.light.opacity = 0.3 * (1 - smooth(0.34, 0.52, p));

    // ---- Estructura: el concreto pasa a lectura estructural y luego a BIM ----
    const s = smooth(0.5, 0.7, p);
    const bim = smooth(0.8, 0.95, p);
    mats.column.color.lerpColors(colors.concrete, colors.steel, s);
    mats.beam.color.lerpColors(colors.concrete, colors.steel, s * 0.75);
    mats.slab.color.lerpColors(colors.concrete, colors.navy, bim * 0.6);
    mats.slab.opacity = 1 - bim * 0.62;
    mats.core.color.lerpColors(colors.concrete, colors.navy, bim * 0.8);
    mats.core.opacity = 1 - bim * 0.45;
    mats.column.opacity = mats.beam.opacity = 1 - bim * 0.25;
    mats.edges.opacity = bim * 0.85;
    mats.axis.opacity = bim;
    mats.damper.emissiveIntensity = 0.2 + bim * 1.4;

    const grow = smooth(0.6, 0.78, p);
    model.structure.braces.forEach((b, i) => {
      scale.set(Math.max(grow, 0.0001), 1, 1);
      braceMesh.setMatrixAt(i, compose(b, undefined, scale));
    });
    braceMesh.instanceMatrix.needsUpdate = true;
    braceMesh.visible = grow > 0.001;
    const pop = smooth(0.7, 0.82, p);
    model.structure.dampers.forEach((b, i) => {
      scale.setScalar(Math.max(pop, 0.0001));
      damperMesh.setMatrixAt(i, compose(b, undefined, scale));
    });
    damperMesh.instanceMatrix.needsUpdate = true;
    damperMesh.visible = pop > 0.001;

    if (labels.current) labels.current.visible = bim > 0.02;

    // ---- Giro sobre Y y camara ----
    if (group.current) {
      const turn = smooth(0.12, 0.42, p) * Math.PI * 0.72 + smooth(0.78, 1, p) * 0.35;
      const sway = staticPose === undefined ? Math.sin(t * 0.25) * 0.035 * (1 - smooth(0, 0.12, p)) : 0;
      group.current.rotation.y = -0.55 + turn + sway;
    }
    const c = smooth(0.76, 1, p);
    camera.position.lerpVectors(camFrom, camTo, c);
    look.lerpVectors(lookFrom, lookTo, c);
    camera.lookAt(look);
  };

  useFrame((state, delta) => {
    const target = staticPose ?? getProgress();
    const k = 1 - Math.exp(-delta * 5);
    current.current += (target - current.current) * k;
    if (Math.abs(target - current.current) < 0.0004) current.current = target;
    const p = current.current;
    if (Math.abs(p - last.current) > 0.0002 || p < 0.12) {
      apply(p, state.clock.elapsedTime);
      last.current = p;
    }
    onFrame?.(p);
  });

  const labelFont = "/fonts/IBMPlexMono-Medium.ttf";
  const xMax = GRID_X[GRID_X.length - 1];
  const zMax = GRID_Z[GRID_Z.length - 1];

  return (
    <>
      <fog attach="fog" args={[palette.canvas, 110, 260]} />
      <hemisphereLight args={[palette.structure, palette.navy, 0.55]} />
      <directionalLight position={[35, 60, 30]} intensity={1.7} color="#f4efe6" />
      <directionalLight position={[-40, 20, -30]} intensity={0.45} color={palette.structure} />

      <Environment resolution={mobile ? 64 : 128} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#e9eef5" scale={[60, 12, 1]} position={[0, 40, -30]} rotation-x={Math.PI / 5} />
        <Lightformer form="rect" intensity={1.6} color="#b7c8dc" scale={[90, 26, 1]} position={[60, 26, 80]} target={[0, 20, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#e8d2a8" scale={[40, 6, 1]} position={[-20, 8, 70]} target={[0, 10, 0]} />
        <Lightformer form="rect" intensity={1.3} color={palette.structure} scale={[24, 50, 1]} position={[-45, 15, 10]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={0.9} color={palette.bim} scale={[20, 40, 1]} position={[45, 12, -12]} rotation-y={-Math.PI / 2} />
        <Lightformer form="rect" intensity={0.5} color="#20324a" scale={[80, 80, 1]} position={[0, -20, 0]} rotation-x={-Math.PI / 2} />
      </Environment>

      <group ref={group}>
        <mesh position={model.foundation.p}>
          <boxGeometry args={model.foundation.s} />
          <meshStandardMaterial color={palette.concrete} roughness={0.9} />
        </mesh>
        <primitive object={columnMesh} />
        <primitive object={beamMesh} />
        <primitive object={slabMesh} />
        <primitive object={coreMesh} />
        <primitive object={braceMesh} />
        <primitive object={damperMesh} />
        <lineSegments geometry={edgeGeo} material={mats.edges} />
        <primitive object={lightMesh} />
        <primitive object={spandrelMesh} />
        <primitive object={mullionMesh} />
        <primitive object={finMesh} />
        <primitive object={glassMesh} />

        <group ref={labels} visible={false}>
          <lineSegments geometry={axisGeo} material={mats.axis} />
          {AXIS_X.map((a, i) => (
            <Billboard key={a} position={[GRID_X[i], 1.2, zMax + 9]}>
              <Text font={labelFont} fontSize={1.5} color={palette.bim} anchorX="center" anchorY="middle">
                {a}
              </Text>
            </Billboard>
          ))}
          {AXIS_Z.map((a, i) => (
            <Billboard key={a} position={[xMax + 9, 1.2, GRID_Z[i]]}>
              <Text font={labelFont} fontSize={1.5} color={palette.bim} anchorX="center" anchorY="middle">
                {a}
              </Text>
            </Billboard>
          ))}
          {Array.from({ length: Math.floor(floors / 3) + 1 }, (_, k) => k * 3).map((lv) => (
            <Billboard key={lv} position={[-(xMax + 6), levelElevation(lv) + 0.6, -zMax - 2]}>
              <Text font={labelFont} fontSize={0.85} color={palette.structure} anchorX="right" anchorY="middle">
                {`N+${levelElevation(lv).toFixed(2)}`}
              </Text>
            </Billboard>
          ))}
        </group>
      </group>

      <Grid
        position={[0, -1.19, 0]}
        args={[240, 240]}
        cellSize={1.5}
        cellThickness={0.5}
        cellColor={palette.gridCell}
        sectionSize={6}
        sectionThickness={0.9}
        sectionColor={palette.gridSection}
        fadeDistance={mobile ? 110 : 150}
        fadeStrength={1.6}
        infiniteGrid
      />
    </>
  );
}
