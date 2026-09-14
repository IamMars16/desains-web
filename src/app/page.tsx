import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { AboutIntro } from "@/components/home/AboutIntro";
import { BimBand } from "@/components/home/BimBand";
import { ClientsMarquee } from "@/components/home/ClientsMarquee";
import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedSlider } from "@/components/home/FeaturedProjects";
import { HeroExperience } from "@/components/home/HeroExperience";
import { InnovationPreview } from "@/components/home/InnovationPreview";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProfessionalCard } from "@/components/team/ProfessionalCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ctaLabels } from "@/config/navigation";
import { professionals } from "@/data/professionals";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

export default function HomePage() {
  const featured = projects.filter((p) => p.featured);

  return (
    <>
      <HeroExperience />
      <AboutIntro />

      <section aria-labelledby="destacados-titulo" className="border-b border-line py-24 md:py-32">
        <div className="container-site flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="destacados-titulo" title="Proyectos destacados">
            Evaluación de puentes colgantes, edificaciones con disipación sísmica, infraestructura educativa y aeroportuaria.
          </SectionHeading>
          <ButtonLink href="/proyectos" variant="secondary" icon={<ArrowRight size={16} weight="bold" />}>
            {ctaLabels.projects}
          </ButtonLink>
        </div>
        <div className="mt-12">
          <FeaturedSlider count={featured.length}>
            {featured.map((p) => (
              <li key={p.slug} className="w-[82vw] shrink-0 snap-start sm:w-[58vw] lg:w-[40vw] xl:w-[520px]">
                <ProjectCard project={p} variant="large" sizes="(min-width: 1280px) 520px, (min-width: 1024px) 40vw, 82vw" />
              </li>
            ))}
          </FeaturedSlider>
        </div>
      </section>

      <section aria-labelledby="servicios-titulo" className="border-b border-line py-24 md:py-36">
        <div className="container-site">
          <SectionHeading id="servicios-titulo" title="Soluciones integrales para la construcción." className="mb-14">
            Desde la concepción arquitectónica y el cálculo estructural hasta la supervisión y construcción de la obra.
          </SectionHeading>
          <ServicesPreview services={services} />
        </div>
      </section>

      <InnovationPreview />
      <BimBand />

      <section aria-labelledby="equipo-titulo" className="border-b border-line py-24 md:py-36">
        <div className="container-site">
          <SectionHeading id="equipo-titulo" title="Nuestros profesionales">
            Ingenieros con maestrías y doctorados en ingeniería estructural, geotecnia y gestión de la construcción.
          </SectionHeading>
          <Reveal as="ul" group className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-5">
            {professionals.map((p) => (
              <li key={p.slug}>
                <ProfessionalCard person={p} />
              </li>
            ))}
          </Reveal>
          <ButtonLink href="/profesionales" variant="secondary" className="mt-14" icon={<ArrowRight size={16} weight="bold" />}>
            {ctaLabels.team}
          </ButtonLink>
        </div>
      </section>

      <ClientsMarquee />
      <ContactCta />
    </>
  );
}
