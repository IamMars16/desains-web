import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SofipsGraphic } from "@/components/innovation/SofipsGraphic";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { about } from "@/data/about";
import { conferences, dissipatorResearch, peerReviews, publications, software } from "@/data/publications";

export const metadata: Metadata = {
  title: "Innovación e I+D",
  description: "Artículos en revistas Q1, ponencias internacionales, revisiones como pares, software propio SOFIPS y un disipador sísmico híbrido en desarrollo.",
  alternates: { canonical: "/innovacion" },
};

export default function InnovationPage() {
  const pillars = [
    { value: String(publications.length), label: "Artículos en revistas Q1 internacionales" },
    { value: String(conferences.length), label: "Ponencias en congresos internacionales" },
    { value: String(peerReviews.items.reduce((a, b) => a + b.reviews, 0)), label: "Revisiones como pares verificadas en Web of Science" },
    { value: String(software.length), label: "Programas propios de ingeniería sísmica" },
  ];

  return (
    <>
      <PageHeader title="Ingeniería e investigación y desarrollo" intro={about.differentiator}>
        <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.label} className="flex flex-col-reverse justify-end border-t border-line pt-5">
              <dt className="mt-2 text-fg-2">{p.label}</dt>
              <dd className="font-mono tabular text-5xl text-fg">{p.value}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <section aria-labelledby="software-t" className="border-b border-line py-24 md:py-32">
        <div className="container-site">
          <h2 id="software-t" className="font-semi-expanded text-3xl font-bold text-fg md:text-4xl">
            Software propio SOFIPS
          </h2>
          <div className="mt-14 grid gap-20">
            {software.map((s, i) => (
              <Reveal key={s.id} className={`grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div>
                  <h3 className="font-mono text-lg tracking-[0.06em] text-gold">{s.name}</h3>
                  <p className="font-semi-expanded mt-3 text-2xl font-semibold text-fg md:text-3xl">{s.summary}</p>
                  <ul className="mt-6 grid gap-3">
                    {s.capabilities.map((c) => (
                      <li key={c} className="flex gap-3 text-fg-2">
                        <span className="mt-3 h-px w-5 shrink-0 bg-gold" aria-hidden="true" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 max-w-sm rounded-xs border border-line bg-surface p-5">
                    <SofipsGraphic kind={s.id} />
                  </div>
                </div>
                <figure>
                  <div className="relative overflow-hidden rounded-xs border border-line bg-fg" style={{ aspectRatio: `${s.screenshot.width} / ${s.screenshot.height}` }}>
                    <Image src={s.screenshot.src} alt={s.screenshot.alt ?? s.name} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-contain" />
                  </div>
                  <figcaption className="mt-3 text-sm text-fg-3">{s.screenshot.alt}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="pub-t" className="border-b border-line py-24 md:py-32">
        <div className="container-site grid gap-16 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 id="pub-t" className="font-semi-expanded text-3xl font-bold text-fg md:text-4xl">
              Publicaciones científicas
            </h2>
            <p className="mt-4 text-fg-2">Artículos publicados en revistas de alto nivel académico del cuartil Q1.</p>
          </div>
          <ul className="grid gap-6">
            {publications.map((p) => (
              <li key={p.id} className="rounded-xs border border-line bg-surface p-7">
                <p className="font-mono text-xs text-gold">
                  {p.journal} · {p.quartile}
                </p>
                <h3 className="mt-3 text-xl font-semibold leading-snug text-fg">{p.title}</h3>
                <p className="mt-2 text-fg-2">{p.authors}</p>
                <p className="mt-1 text-sm text-fg-3">{p.details}</p>
                <a
                  href={`https://doi.org/${p.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center gap-2 font-medium text-gold underline-offset-4 hover:underline"
                >
                  DOI {p.doi} <ArrowUpRight size={16} aria-hidden="true" />
                  <span className="sr-only">(abre en una pestaña nueva)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="comunidad-t" className="border-b border-line py-24">
        <div className="container-site grid gap-12 md:grid-cols-2">
          <div>
            <h2 id="comunidad-t" className="font-semi-expanded text-2xl font-bold text-fg md:text-3xl">
              Ponencias internacionales
            </h2>
            <ul className="mt-8 grid gap-5">
              {conferences.map((c) => (
                <li key={c.name} className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-line pt-5">
                  <span className="font-mono text-fg-3">{c.year}</span>
                  <span className="text-lg text-fg">{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semi-expanded text-2xl font-bold text-fg md:text-3xl">Revisiones como pares</h2>
            <p className="mt-4 text-fg-2">
              Revisiones formales registradas en Web of Science para el journal internacional {peerReviews.journal} ({peerReviews.period}).
            </p>
            <ul className="mt-6 grid gap-5">
              {peerReviews.items.map((r) => (
                <li key={r.title} className="border-t border-line pt-5">
                  <p className="text-fg">{r.title}</p>
                  <p className="mt-1 font-mono text-sm text-fg-3">
                    {r.reviews} {r.reviews === 1 ? "revisión" : "revisiones"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="disipador-t" className="py-24 md:py-32">
        <div className="container-site">
          <div className="max-w-3xl">
            <h2 id="disipador-t" className="font-semi-expanded text-3xl font-bold text-fg md:text-4xl">
              {dissipatorResearch.title}
            </h2>
            <p className="mt-5 text-lg text-fg-2">{dissipatorResearch.summary}</p>
            <p className="mt-3 text-lg text-fg-2">{dissipatorResearch.detail}</p>
          </div>
          <Reveal as="ul" group className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dissipatorResearch.images.map((img) => (
              <li key={img.src}>
                <figure>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xs border border-line bg-surface">
                    <Image src={img.src} alt={img.alt ?? ""} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                  </div>
                  <figcaption className="mt-3 text-sm text-fg-2">{img.alt}</figcaption>
                </figure>
              </li>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
