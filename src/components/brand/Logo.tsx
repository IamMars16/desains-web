import { LOGO_VIEWBOX, logoPieces, toSvgPath } from "@/lib/logo-geometry";

const shade: Record<string, number> = {
  columna: 1,
  "brazo-superior": 0.82,
  "brazo-inferior": 0.82,
  triangulo: 0.68,
  escuadra: 0.68,
  soporte: 0.58,
};

export function LogoMark({ className = "h-8 w-auto" }: { className?: string }) {
  const { x, y, width, height } = LOGO_VIEWBOX;
  return (
    <svg viewBox={`${x} ${y} ${width} ${height}`} className={className} aria-hidden="true" focusable="false">
      {logoPieces.map((p) => (
        <path key={p.id} d={toSvgPath(p)} fill="var(--color-steel)" fillOpacity={shade[p.id]} fillRule="evenodd" />
      ))}
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3" translate="no">
      <LogoMark className="h-9 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-expanded text-[1.05rem] font-extrabold tracking-[0.04em] text-fg">DESAINS</span>
        {!compact && (
          <span className="font-expanded mt-1 text-[0.58rem] font-medium tracking-[0.34em] text-fg-2">INGENIEROS</span>
        )}
      </span>
    </span>
  );
}
