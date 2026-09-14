import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SofipsGraphic } from "@/components/innovation/SofipsGraphic";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { publications, software } from "@/data/publications";

export function InnovationPreview() {
  const [main, ...rest] = software;
  return (
    <section aria-labelledby="innovacion-titulo" className="border-b border-line py-24 md:py-36">
      <div className="container-site">
        <SectionHeading id="innovacion-titulo" eyebrow="Investigación y desarrollo" title="Investigación que llega a la obra.">
          Software propio de ingeniería sísmica, artículos en revistas Q1 y un disipador sísmico en desarrollo.
        </SectionHeading>

        <Reveal group className="mt-14 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <article className="flex flex-col justify-between rounded-xs border border-line bg-surface p-7 md:p-10">
            <div>
              <h3 className="font-mono text-sm tracking-[0.08em] text-gold">{main.name}</h3>
              <p className="font-semi-expanded mt-3 text-2xl font-semibold text-fg md:text-3xl">{main.summary}</p>
              <p className="mt-3 max-w-[48ch] text-fg-2">{main.capabilities.slice(0, 2).join(". ")}.</p>
            </div>
            <div className="mt-10">
              <SofipsGraphic kind={main.id} />
            </div>
          </article>
          <div className="grid gap-5">
            {rest.map((s) => (
              <article key={s.id} className="grid gap-6 rounded-xs border border-line bg-surface-2 p-7 sm:grid-cols-[1fr_1.1fr] sm:items-center">
                <div>
                  <h3 className="font-mono text-sm tracking-[0.08em] text-gold">{s.name}</h3>
                  <p className="mt-3 text-lg font-semibold text-fg">{s.summary}</p>
                  <p className="mt-2 text-sm text-fg-2">{s.capabilities[0]}.</p>
                </div>
                <SofipsGraphic kind={s.id} />
              </article>
            ))}
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {publications.map((p) => (
            <article key={p.id} className="border-t border-line pt-6">
              <p className="font-mono text-xs text-fg-3">
                {p.journal} ({p.quartile}), {p.year}
              </p>
              <h3 className="mt-3 text-lg font-semibold leading-snug text-fg">
                <a
                  href={`https://doi.org/${p.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="decoration-gold/60 underline-offset-4 hover:underline"
                >
                  {p.title}
                  <ArrowUpRight size={16} className="ml-1.5 inline-block align-baseline text-gold" aria-hidden="true" />
                  <span className="sr-only"> (abre doi.org en una pestaña nueva)</span>
                </a>
              </h3>
              <p className="mt-2 text-sm text-fg-2">{p.authors}</p>
            </article>
          ))}
        </div>

        <ButtonLink href="/innovacion" variant="secondary" className="mt-14" icon={<ArrowRight size={16} weight="bold" />}>
          Ver innovación e I+D
        </ButtonLink>
      </div>
    </section>
  );
}
