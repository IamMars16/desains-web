"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { LOGO_VIEWBOX, logoPieces, type LogoPiece } from "@/lib/logo-geometry";

const SCALE = 1 / 110;
const cx = LOGO_VIEWBOX.x + LOGO_VIEWBOX.width / 2;
const cy = LOGO_VIEWBOX.y + LOGO_VIEWBOX.height / 2;

function toShape(piece: LogoPiece) {
  const map = ([x, y]: readonly [number, number]) => new THREE.Vector2((x - cx) * SCALE, -(y - cy) * SCALE);
  const shape = new THREE.Shape(piece.outer.map(map));
  if (piece.hole) shape.holes.push(new THREE.Path(piece.hole.map(map)));
  return shape;
}

/** Direccion de ensamblaje de cada pieza (sale desde su centro). */
function centroid(piece: LogoPiece) {
  const n = piece.outer.length;
  const [sx, sy] = piece.outer.reduce(([a, b], [x, y]) => [a + x, b + y], [0, 0]);
  return new THREE.Vector3((sx / n - cx) * SCALE, -(sy / n - cy) * SCALE, 0);
}

function Pieces({ reduce, start }: { reduce: boolean; start: boolean }) {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const t0 = useRef<number | null>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const pieces = useMemo(
    () =>
      logoPieces.map((p, i) => {
        const depth = 0.55 * p.depth;
        const geo = new THREE.ExtrudeGeometry(toShape(p), {
          depth,
          bevelEnabled: true,
          bevelThickness: 0.05,
          bevelSize: 0.035,
          bevelSegments: 3,
        });
        geo.translate(0, 0, -depth / 2);
        const c = centroid(p);
        const dir = c.clone().setZ(0.6).normalize();
        return { id: p.id, geo, from: dir.multiplyScalar(3.2 + i * 0.35), spin: (i % 2 ? 1 : -1) * (0.9 + i * 0.15) };
      }),
    [],
  );
  useEffect(() => () => pieces.forEach((p) => p.geo.dispose()), [pieces]);

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#7fa6d4",
        metalness: 0.35,
        roughness: 0.18,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.6,
      }),
    [],
  );
  const accent = useMemo(() => {
    const m = material.clone();
    m.color.set("#c9a35b");
    m.metalness = 0.7;
    return m;
  }, [material]);
  useEffect(() => () => { material.dispose(); accent.dispose(); }, [material, accent]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX / window.innerWidth - 0.5, y: e.clientY / window.innerHeight - 0.5 };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    if (!start && !reduce) return;
    if (t0.current === null) t0.current = state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - t0.current;
    pieces.forEach((p, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const local = reduce ? 1 : Math.min(1, Math.max(0, (elapsed - i * 0.12) / 1.4));
      const k = 1 - Math.pow(1 - local, 4);
      mesh.position.copy(p.from).multiplyScalar(1 - k);
      mesh.rotation.set(0, p.spin * (1 - k), p.spin * 0.4 * (1 - k));
    });
    if (group.current && !reduce) {
      const g = group.current;
      g.rotation.y += (pointer.current.x * 0.5 - 0.25 + Math.sin(state.clock.elapsedTime * 0.3) * 0.08 - g.rotation.y) * 0.05;
      g.rotation.x += (pointer.current.y * 0.25 - g.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={group} rotation={[0, -0.25, 0]}>
      {pieces.map((p, i) => (
        <mesh
          key={p.id}
          ref={(m) => {
            refs.current[i] = m;
          }}
          geometry={p.geo}
          material={p.id === "triangulo" ? accent : material}
          position={reduce ? [0, 0, 0] : p.from}
          name={p.id}
        />
      ))}
    </group>
  );
}

/** Logo 3D de 6 piezas separadas que se ensamblan al entrar en pantalla. */
export default function LogoScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [reduce] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setVisible(e.isIntersecting);
      if (e.isIntersecting) setStarted(true);
    }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        aria-hidden="true"
        frameloop={reduce ? "demand" : visible ? "always" : "never"}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 11], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[4, 6, 8]} intensity={1.6} />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2} color="#dfe8f3" scale={[10, 3, 1]} position={[0, 5, 6]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={1.2} color="#8db3da" scale={[3, 10, 1]} position={[-7, 0, 3]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={0.9} color="#c9a35b" scale={[3, 10, 1]} position={[7, 0, 2]} target={[0, 0, 0]} />
        </Environment>
        <Pieces reduce={reduce} start={started} />
      </Canvas>
    </div>
  );
}
