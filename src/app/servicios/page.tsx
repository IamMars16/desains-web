import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { ctaLabels } from "@/config/navigation";
import { projects, sectorLabels } from "@/data/projects";
import { services, specialStudies } from "@/data/services";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Ingeniería estructural, evaluación y reforzamiento, supervisión, construcción, arquitectura, modelamiento BIM y estudios especiales.",
  alternates: { canonical: "/servicios" },
};

export default function ServicesPage() {
  const sectors = Object.entries(sectorLabels).filter(([id]) => projects.some((p) => p.sector === id));

  return (
    <>
      <PageHeader
        title="Servicios"
        intro="Soluciones integrales para la industria de la construcción: desde la concepción arquitectónica y el cálculo estructural hasta la supervisión y la obra."
      />

      <div className="container-site">
        {services.map((s, i) => {
          const count = projects.filter((p) => p.services.includes(s.id)).length;
          return (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-24 border-b border-line py-16 md:py-24">
              <Reveal className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-20 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-xs bg-surface">
                  <Image src={s.image.src} alt={s.image.alt ?? s.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                </div>
                <div>
                  <h2 id={`${s.id}-t`} className="font-semi-expanded text-3xl font-bold leading-tight text-fg md:text-4xl">
                    {s.name}
                  </h2>
                  <p className="mt-4 text-xl text-fg">{s.summary}</p>
                  {s.detail.map((d) => (
                    <p key={d} className="mt-4 max-w-[60ch] text-fg-2">
                      {d}
                    </p>
                  ))}
                  {count > 0 && (
                    <Link
                      href={`/proyectos?servicio=${s.id}`}
                      className="mt-7 inline-flex min-h-11 items-center gap-2 font-medium text-gold underline-offset-4 hover:underline"
                    >
                      Ver {count} {count === 1 ? "proyecto" : "proyectos"} <ArrowRight size={16} weight="bold" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </Reveal>
            </section>
          );
        })}
      </div>

      <section id="estudios-especiales-detalle" aria-labelledby="estudios-t" className="border-b border-line bg-canvas-deep py-24 md:py-32">
        <div className="container-site">
          <h2 id="estudios-t" className="font-semi-expanded max-w-3xl text-3xl font-bold text-fg md:text-4xl">
            Estudios especiales
          </h2>
          <p className="mt-4 max-w-[60ch] text-lg text-fg-2">Análisis de alta especialización que complementan el diseño y la evaluación de estructuras.</p>
          <Reveal as="ul" group className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {specialStudies.map((st) => (
              <li key={st.id} className="flex flex-col overflow-hidden rounded-xs border border-line bg-surface">
                <div className="relative aspect-[16/10] bg-fg/95">
                  <Image src={st.images[0].src} alt={st.images[0].alt ?? st.name} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-contain p-2" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-fg">{st.name}</h3>
                  <p className="mt-2 text-fg-2">{st.summary}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="sectores-t" className="py-24">
        <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 id="sectores-t" className="font-semi-expanded text-3xl font-bold text-fg">
              Sectores donde trabajamos
            </h2>
            <p className="mt-4 text-fg-2">El servicio describe qué hacemos; el sector describe el tipo de obra.</p>
          </div>
          <ul className="flex flex-wrap gap-3 self-center">
            {sectors.map(([id, label]) => (
              <li key={id}>
                <Link href={`/proyectos?tipo=${id}`} className="inline-flex min-h-11 items-center rounded-xs border border-line-strong px-4 text-fg-2 hover:bg-hover hover:text-fg">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="container-site mt-16">
          <ButtonLink href="/contacto" icon={<ArrowRight size={16} weight="bold" />}>
            {ctaLabels.start}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
