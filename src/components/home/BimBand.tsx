import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { projectImages } from "@/data/generated/images";

export function BimBand() {
  const img = projectImages["colegio-emblematico-trujillo"][0];
  return (
    <section aria-labelledby="bim-titulo" className="relative overflow-hidden border-b border-line">
      <div className="relative min-h-[70vh] md:min-h-[78vh]">
        <Image
          src={img.src}
          alt="Modelo BIM de un colegio emblemático en Trujillo desarrollado por DESAINS"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/70 to-canvas/10" />
        <div className="container-site relative flex min-h-[70vh] items-end pb-16 md:min-h-[78vh] md:pb-24">
          <Reveal className="max-w-2xl">
            <h2 id="bim-titulo" className="font-semi-expanded text-3xl font-bold leading-tight text-fg md:text-5xl">
              Modelamos cada proyecto antes de construirlo.
            </h2>
            <p className="mt-5 max-w-[52ch] text-lg text-fg-2">
              Con metodología BIM resolvemos interferencias, optimizamos recursos y modelamos el comportamiento de la estructura en un entorno virtual.
            </p>
            <ButtonLink href="/servicios#bim" variant="secondary" className="mt-8 bg-canvas/40 backdrop-blur" icon={<ArrowRight size={16} weight="bold" />}>
              Conocer el modelamiento BIM
            </ButtonLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
