import type { Metadata } from "next";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ContactActions } from "@/components/contact/ContactActions";
import { ProjectRequestForm } from "@/components/contact/ProjectRequestForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { company } from "@/config/company";
import { ctaLabels } from "@/config/navigation";
import { whatsappUrl } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacte a DESAINS Ingenieros por WhatsApp, correo o teléfono, solicite una cotización o inicie un proyecto.",
  alternates: { canonical: "/contacto" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Iniciemos su proyecto." intro="Escríbanos por el canal que prefiera. Respondemos directamente desde el equipo técnico.">
        <div className="mt-10">
          <ContactActions layout="grid" />
        </div>
      </PageHeader>

      <section aria-labelledby="cotizacion-t" className="border-b border-line py-20">
        <div className="container-site grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 id="cotizacion-t" className="font-semi-expanded text-3xl font-bold text-fg">
              {ctaLabels.quote}
            </h2>
            <p className="mt-3 max-w-[56ch] text-fg-2">Envíenos los datos básicos por WhatsApp y le indicaremos la información necesaria para cotizar.</p>
          </div>
          <a
            href={whatsappUrl(company.messages.quote)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-xs border border-gold px-5 font-semibold text-gold hover:bg-gold hover:text-on-gold"
          >
            {ctaLabels.quote} por WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section aria-labelledby="proyecto-t" className="py-20 md:py-28">
        <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <h2 id="proyecto-t" className="font-semi-expanded text-3xl font-bold text-fg">
              {ctaLabels.start}
            </h2>
            <p className="mt-4 text-fg-2">Cuéntenos lo esencial. Con esa información preparamos la primera conversación técnica.</p>
            <dl className="mt-10 grid gap-5">
              <div className="border-t border-line pt-4">
                <dt className="text-sm text-fg-3">Dirección</dt>
                <dd className="mt-1 text-fg">
                  {company.address.street}, {company.address.city}, {company.address.country}
                </dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="text-sm text-fg-3">Correo alternativo</dt>
                <dd className="mt-1 text-fg">{company.secondaryEmail}</dd>
              </div>
              <div className="border-t border-line pt-4">
                <dt className="text-sm text-fg-3">{company.legalId.label}</dt>
                <dd className="mt-1 text-fg">{company.legalId.value}</dd>
              </div>
            </dl>
          </div>
          <ProjectRequestForm />
        </div>
      </section>
    </>
  );
}
