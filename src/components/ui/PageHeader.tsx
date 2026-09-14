import type { ReactNode } from "react";

interface Props {
  title: string;
  intro?: ReactNode;
  children?: ReactNode;
}

/** Cabecera de paginas internas: el titulo es el h1 de la pagina. */
export function PageHeader({ title, intro, children }: Props) {
  return (
    <header className="border-b border-line pb-14 pt-32 md:pb-20 md:pt-44">
      <div className="container-site">
        <h1 className="font-semi-expanded max-w-4xl text-4xl font-bold leading-[1.04] text-fg md:text-6xl">{title}</h1>
        {intro && <div className="mt-6 max-w-[62ch] text-lg text-fg-2 md:text-xl">{intro}</div>}
        {children}
      </div>
    </header>
  );
}
