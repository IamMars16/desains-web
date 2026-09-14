import { clients } from "@/data/clients";

/** Marquesina lenta de nombres (la unica del sitio). Se pausa con hover o foco y se detiene con movimiento reducido. */
export function ClientsMarquee() {
  const half = Math.ceil(clients.length / 2);
  return (
    <section aria-labelledby="clientes-titulo" className="border-b border-line py-20 md:py-28">
      <div className="container-site">
        <h2 id="clientes-titulo" className="font-semi-expanded text-2xl font-bold text-fg md:text-3xl">
          Han confiado en nosotros
        </h2>
      </div>
      <ul className="sr-only">
        {clients.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <div className="marquee mt-12 grid gap-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]" aria-hidden="true">
        {[clients.slice(0, half), clients.slice(half)].map((row, r) => (
          <div key={r} className="marquee-track flex w-max gap-14" style={r ? { animationDirection: "reverse", animationDuration: "110s" } : undefined}>
            {[...row, ...row].map((c, i) => (
              <span key={`${c}-${i}`} className="font-semi-expanded whitespace-nowrap text-2xl font-semibold text-fg-3 md:text-3xl">
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
