"use client";

import dynamic from "next/dynamic";
import { LogoMark } from "@/components/brand/Logo";
import { hasWebGL, useHydrated } from "@/lib/use-client-env";

const LogoScene = dynamic(() => import("./LogoScene"), { ssr: false });

/** Carga el logo 3D solo en el cliente; sin WebGL muestra el logo vectorial. */
export function LogoStage() {
  const hydrated = useHydrated();
  const webgl = hydrated && hasWebGL();
  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#15233a_0%,transparent_65%)]">
      {webgl ? (
        <LogoScene />
      ) : (
        <div className="flex h-full items-center justify-center">
          <LogoMark className="h-1/2 w-auto" />
        </div>
      )}
    </div>
  );
}
