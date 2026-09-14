"use client";

import { Bounds, Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

function Model({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene} />;
}

/** Visor de modelos .glb/.gltf de proyectos (BIM exportado). Se carga solo al pedirlo. */
export default function ModelViewer({ src, title }: { src: string; title: string }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xs border border-line bg-surface">
      <Canvas dpr={[1, 2]} camera={{ position: [60, 80, 90], fov: 35, near: 0.1, far: 2000 }} aria-label={`Modelo 3D: ${title}`}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2} scale={[10, 4, 1]} position={[0, 6, 6]} target={[0, 0, 0]} />
        </Environment>
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <Model src={src} />
          </Bounds>
        </Suspense>
        <OrbitControls makeDefault enableDamping />
      </Canvas>
      <p className="pointer-events-none absolute bottom-3 left-4 text-xs text-fg-3">Arrastre para girar, rueda para acercar</p>
    </div>
  );
}
