import { ImageResponse } from "next/og";
import { LOGO_VIEWBOX, logoPieces, toSvgPath } from "@/lib/logo-geometry";

export const alt = "DESAINS Ingenieros: ingeniería estructural, investigación y construcción";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { x, y, width, height } = LOGO_VIEWBOX;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "radial-gradient(circle at 78% 40%, #1b2d47 0%, #0a0f17 60%)",
          padding: "0 90px",
          gap: 70,
        }}
      >
        <svg width={250} height={350} viewBox={`${x} ${y} ${width} ${height}`}>
          {logoPieces.map((p) => (
            <path key={p.id} d={toSvgPath(p)} fill={p.id === "triangulo" ? "#c9a35b" : "#8db3da"} fillRule="evenodd" />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, color: "#efebe3", letterSpacing: 4 }}>DESAINS</div>
          <div style={{ fontSize: 34, color: "#a9b3c1", letterSpacing: 18, marginTop: 4 }}>INGENIEROS</div>
          <div style={{ fontSize: 30, color: "#c9a35b", marginTop: 44, maxWidth: 700 }}>
            Ingeniería estructural, investigación sísmica y construcción
          </div>
        </div>
      </div>
    ),
    size,
  );
}
