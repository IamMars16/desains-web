import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ProfessionalCard } from "@/components/team/ProfessionalCard";
import { getProfessional, professionals } from "@/data/professionals";
import { publications } from "@/data/publications";

export const dynamicParams = false;

export function generateStaticParams() {
  return professionals.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/profesionales/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const person = getProfessional(slug);
  if (!person) return {};
  return {
    title: person.name,
    description: person.summary,
    alternates: { canonical: `/profesionales/${person.slug}` },
  };
}

export default async function ProfessionalPage({ params }: PageProps<"/profesionales/[slug]">) {
  const { slug } = await params;
  const person = getProfessional(slug);
  if (!person) notFound();

  const pubs = publications.filter((p) => person.publications?.includes(p.id));
  const others = professionals.filter((p) => p.slug !== person.slug);

  return (
    <article>
      <div className="container-site grid gap-12 pb-20 pt-32 md:pt-40 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-20">
        <div>
          <Link href="/profesionales" className="inline-flex min-h-11 items-center gap-2 text-sm text-fg-2 hover:text-fg">
            <ArrowLeft size={16} aria-hidden="true" /> Todos los profesionales
          </Link>
          <div className="relative mt-6 aspect-[4/5] max-w-[380px] overflow-hidden rounded-xs bg-surface">
            <Image src={person.photo.src} alt={person.photo.alt ?? person.name} fill priority sizes="380px" className="object-cover" />
          </div>
        </div>

        <div className="lg:pt-16">
          <h1 className="font-semi-expanded text-4xl font-bold leading-[1.05] text-fg md:text-5xl">{person.name}</h1>
          {person.role && <p className="mt-4 text-xl text-gold">{person.role}</p>}
          <p className="mt-2 text-lg text-fg-2">{person.specialty}</p>
          <p className="mt-8 max-w-[62ch] text-lg text-fg-2">{person.summary}</p>

          <section aria-labelledby="formacion" className="mt-12 border-t border-line pt-8">
            <h2 id="formacion" className="text-lg font-semibold text-fg">
              Formación
            </h2>
            <ul className="mt-5 grid gap-3">
              {person.education.map((e) => (
                <li key={e} className="flex gap-3 text-fg-2">
                  <span className="mt-3 h-px w-5 shrink-0 bg-gold" aria-hidden="true" />
                  {e}
                </li>
              ))}
            </ul>
          </section>

          {person.research && (
            <section aria-labelledby="investigacion" className="mt-10 border-t border-line pt-8">
              <h2 id="investigacion" className="text-lg font-semibold text-fg">
                Investigación
              </h2>
              <ul className="mt-5 grid gap-3">
                {person.research.map((r) => (
                  <li key={r} className="text-fg-2">
                    {r}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {pubs.length > 0 && (
            <section aria-labelledby="publicaciones" className="mt-10 border-t border-line pt-8">
              <h2 id="publicaciones" className="text-lg font-semibold text-fg">
                Publicaciones
              </h2>
              <ul className="mt-5 grid gap-6">
                {pubs.map((p) => (
                  <li key={p.id}>
                    <a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer" className="group text-fg">
                      <span className="underline-offset-4 group-hover:underline">{p.title}</span>
                      <ArrowUpRight size={15} className="ml-1 inline text-gold" aria-hidden="true" />
                      <span className="sr-only"> (abre en una pestaña nueva)</span>
                    </a>
                    <p className="mt-1 text-sm text-fg-3">
                      {p.journal}, {p.year}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <section aria-labelledby="equipo" className="border-t border-line py-20">
        <div className="container-site">
          <h2 id="equipo" className="font-semi-expanded text-2xl font-bold text-fg">
            Equipo
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {others.map((p) => (
              <li key={p.slug}>
                <ProfessionalCard person={p} sizes="(min-width: 768px) 25vw, 50vw" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
