import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { company } from "@/config/company";
import { ctaLabels } from "@/config/navigation";
import { about } from "@/data/about";
import { siteImages } from "@/data/generated/images";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "DESAINS Ingenieros SRL: empresa de desarrollo de ingeniería fundada en 2006 como SYGNUS S.A.C. en Cajamarca, Perú.",
  alternates: { canonical: "/nosotros" },
};

export default function AboutPage() {
  const cover = siteImages["site/portada-puente"];
  const data = [
    { label: "Razón social", value: company.companyName },
    { label: company.legalId.label, value: company.legalId.value },
    { label: "Dirección", value: `${company.address.street}, ${company.address.city}` },
    { label: "Gerente general", value: company.generalManager },
  ];

  return (
    <>
      <PageHeader title="Ingeniería peruana con investigación propia." intro={about.intro} />

      <div className="relative aspect-[16/7] min-h-72 w-full overflow-hidden border-b border-line">
        <Image src={cover.src} alt="Puente en zona andina, imagen de la portada del brochure institucional 2026" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas/80 to-transparent" />
      </div>

      <section aria-labelledby="historia-t" className="border-b border-line py-24 md:py-32">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <h2 id="historia-t" className="font-semi-expanded text-3xl font-bold text-fg md:text-4xl">
            Desde {company.foundedYear}, primero como {company.formerName}
          </h2>
          <Reveal className="grid gap-5 text-lg text-fg-2">
            {about.story.map((s) => (
              <p key={s}>{s}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-label="Visión y misión" className="border-b border-line py-24">
        <Reveal group className="container-site grid gap-6 md:grid-cols-2">
          <div className="rounded-xs border border-line bg-surface p-8 md:p-10">
            <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-gold">Visión</h2>
            <p className="font-semi-expanded mt-5 text-2xl font-semibold leading-snug text-fg">{about.vision}</p>
          </div>
          <div className="rounded-xs border border-line bg-surface-2 p-8 md:p-10">
            <h2 className="font-mono text-sm uppercase tracking-[0.14em] text-gold">Misión</h2>
            <p className="font-semi-expanded mt-5 text-2xl font-semibold leading-snug text-fg">{about.mission}</p>
          </div>
        </Reveal>
      </section>

      <section aria-labelledby="valores-t" className="border-b border-line py-24">
        <div className="container-site">
          <h2 id="valores-t" className="font-semi-expanded text-3xl font-bold text-fg">
            Nuestros valores
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xs border border-line bg-line md:grid-cols-4">
            {about.values.map((v) => (
              <li key={v} className="font-semi-expanded bg-canvas p-8 text-xl font-semibold text-fg md:text-2xl">
                {v}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="datos-t" className="py-24">
        <div className="container-site grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="datos-t" className="font-semi-expanded text-3xl font-bold text-fg">
              Datos de la empresa
            </h2>
            <ButtonLink href="/contacto" className="mt-8" icon={<ArrowRight size={16} weight="bold" />}>
              {ctaLabels.start}
            </ButtonLink>
          </div>
          <dl className="grid gap-6">
            {data.map((d) => (
              <div key={d.label} className="border-t border-line pt-4">
                <dt className="text-sm text-fg-3">{d.label}</dt>
                <dd className="mt-1 text-lg text-fg">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
