import type { Metadata } from "next";
import { ProfessionalCard } from "@/components/team/ProfessionalCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { professionals } from "@/data/professionals";

export const metadata: Metadata = {
  title: "Profesionales",
  description: "Plantel técnico de DESAINS Ingenieros: ingenieros civiles con maestrías y doctorados en ingeniería estructural, geotecnia y gestión de la construcción.",
  alternates: { canonical: "/profesionales" },
};

export default function ProfessionalsPage() {
  return (
    <>
      <PageHeader
        title="Nuestros profesionales"
        intro="Ingenieros formados en la Pontificia Universidad Católica del Perú, la Universidad Nacional de Ingeniería y la Universidad Nacional de Cajamarca."
      />
      <div className="container-site py-16 md:py-24">
        <Reveal as="ul" group className="grid grid-cols-1 gap-x-6 gap-y-14 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {professionals.map((p) => (
            <li key={p.slug}>
              <ProfessionalCard person={p} sizes="(min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw" />
            </li>
          ))}
        </Reveal>
      </div>
    </>
  );
}
