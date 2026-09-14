import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { about } from "@/data/about";

export function AboutIntro() {
  return (
    <section aria-labelledby="nosotros-titulo" className="border-b border-line py-24 md:py-36">
      <div className="container-site grid gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
        <Reveal>
          <h2 id="nosotros-titulo" className="font-semi-expanded text-3xl font-bold leading-[1.12] text-fg md:text-[2.6rem]">
            {about.intro}
          </h2>
          <p className="mt-6 max-w-[58ch] text-lg text-fg-2">{about.differentiator}</p>
          <ButtonLink href="/nosotros" variant="text" className="mt-8" icon={<ArrowRight size={16} weight="bold" />}>
            Conocer la empresa
          </ButtonLink>
        </Reveal>

        <Reveal as="ul" group className="grid grid-cols-2 gap-x-8 gap-y-12 self-end">
          {about.facts.map((f) => (
            <li key={f.label} className="border-t border-line pt-5">
              <p className="font-mono tabular text-4xl font-medium text-fg md:text-5xl">{f.value}</p>
              <p className="mt-3 text-fg-2">{f.label}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
