"use client";

import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { BuildingScene, type BuildingSceneProps } from "./BuildingScene";
import { readScenePalette } from "./palette";

interface Props extends Omit<BuildingSceneProps, "palette"> {
  active: boolean;
}

export default function BuildingCanvas({ active, mobile, ...scene }: Props) {
  const [palette] = useState(readScenePalette);
  return (
    <Canvas
      aria-hidden="true"
      frameloop={scene.staticPose !== undefined ? "demand" : active ? "always" : "never"}
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      camera={{ fov: mobile ? 34 : 28, near: 1, far: 420, position: [40, 22, 50] }}
      style={{
        position: "absolute",
        inset: 0,
        background: mobile
          ? "radial-gradient(ellipse at 50% 70%, #1a2a42 0%, #0a0f17 62%)"
          : "radial-gradient(ellipse at 66% 55%, #1a2a42 0%, #0e1622 32%, #0a0f17 64%)",
      }}
    >
      <BuildingScene palette={palette} mobile={mobile} {...scene} />
    </Canvas>
  );
}
