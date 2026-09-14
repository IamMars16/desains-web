import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ContactActions } from "@/components/contact/ContactActions";
import { LogoStage } from "@/components/three/logo/LogoStage";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ctaLabels } from "@/config/navigation";

export function ContactCta() {
  return (
    <section aria-labelledby="contacto-titulo" className="relative overflow-hidden py-24 md:py-32">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2">
        <div className="relative order-2 aspect-square max-h-[560px] w-full lg:order-1">
          <LogoStage />
        </div>
        <div className="order-1 lg:order-2">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-gold">Contacto</p>
          <h2 id="contacto-titulo" className="font-semi-expanded mt-4 text-4xl font-bold leading-[1.05] text-fg md:text-5xl">
            Iniciemos su proyecto.
          </h2>
          <p className="mt-5 max-w-[46ch] text-lg text-fg-2">
            Cuéntenos qué necesita construir, evaluar o reforzar. Respondemos directamente desde el equipo técnico.
          </p>
          <div className="mt-9 max-w-md">
            <ContactActions />
          </div>
          <ButtonLink href="/contacto" variant="text" className="mt-6" icon={<ArrowRight size={16} weight="bold" />}>
            {ctaLabels.quote}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
