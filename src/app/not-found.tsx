import { ButtonLink } from "@/components/ui/ButtonLink";
import { ctaLabels } from "@/config/navigation";

export default function NotFound() {
  return (
    <section className="container-site flex min-h-[80dvh] flex-col justify-center pt-28">
      <p className="font-mono text-sm text-gold">Error 404</p>
      <h1 className="font-semi-expanded mt-4 max-w-3xl text-4xl font-bold text-fg md:text-6xl">Esta página no existe.</h1>
      <p className="mt-5 max-w-[50ch] text-lg text-fg-2">Es posible que el enlace haya cambiado. Puede volver al inicio o revisar nuestros proyectos.</p>
      <div className="mt-9 flex flex-wrap gap-3">
        <ButtonLink href="/">Volver al inicio</ButtonLink>
        <ButtonLink href="/proyectos" variant="secondary">
          {ctaLabels.projects}
        </ButtonLink>
      </div>
    </section>
  );
}
