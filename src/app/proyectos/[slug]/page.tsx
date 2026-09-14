import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { ProjectVideo } from "@/components/projects/ProjectVideo";
import { ProjectModel } from "@/components/three/model/ProjectModel";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { ctaLabels } from "@/config/navigation";
import {
  getAdjacentProject,
  getCover,
  getProject,
  getProjectImages,
  getRelatedProjects,
  projects,
  sectorLabels,
  serviceLabels,
} from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/proyectos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const cover = getCover(project);
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/proyectos/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, images: cover ? [{ url: cover.src, width: cover.width, height: cover.height }] : undefined },
  };
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal className="grid gap-4 border-t border-line py-10 md:grid-cols-[minmax(0,14rem)_1fr] md:gap-12">
      <h2 className="font-semi-expanded text-xl font-semibold text-fg">{title}</h2>
      <div className="max-w-[68ch] text-lg text-fg-2">{children}</div>
    </Reveal>
  );
}

export default async function ProjectPage({ params }: PageProps<"/proyectos/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const images = getProjectImages(project);
  const [cover, ...gallery] = images;
  const next = getAdjacentProject(project.slug);
  const nextCover = getCover(next);
  const related = getRelatedProjects(project);

  const meta = [
    { label: "Ubicación", value: project.location },
    { label: "Año", value: project.year ? String(project.year) : undefined },
    { label: "Cliente", value: project.client },
    { label: "Estado", value: project.status },
    { label: "Participación", value: project.role },
    { label: "Tipo de proyecto", value: sectorLabels[project.sector] },
    { label: "Servicios", value: project.services.map((s) => serviceLabels[s]).join(", ") },
  ].filter((m): m is { label: string; value: string } => Boolean(m.value));

  // Las imagenes del brochure de baja resolucion no se estiran a pantalla completa.
  const fullBleed = !!cover && cover.width >= 1000;

  return (
    <article>
      <header className={`relative flex items-end overflow-hidden ${fullBleed ? "min-h-[88dvh]" : ""}`}>
        {cover && fullBleed && (
          <>
            <Image src={cover.src} alt={cover.alt ?? project.title} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/75 to-canvas/20" />
          </>
        )}
        <div className={`container-site relative pb-14 md:pb-20 ${fullBleed ? "pt-40" : "pt-32 md:pt-40"}`}>
          <Link href="/proyectos" className="inline-flex min-h-11 items-center gap-2 text-sm text-fg-2 hover:text-fg">
            <ArrowLeft size={16} aria-hidden="true" /> Todos los proyectos
          </Link>
          <h1 className="font-semi-expanded mt-4 max-w-5xl text-4xl font-bold leading-[1.05] text-fg md:text-6xl">{project.title}</h1>
          <p className="mt-5 max-w-[60ch] text-lg text-fg-2 md:text-xl">{project.summary}</p>
          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6 md:grid-cols-4">
            {meta.map((m) => (
              <div key={m.label}>
                <dt className="font-mono text-xs uppercase tracking-[0.12em] text-fg-3">{m.label}</dt>
                <dd className="mt-1 text-fg">{m.value}</dd>
              </div>
            ))}
          </dl>
          {cover && !fullBleed && (
            <div
              className="relative mt-12 w-full overflow-hidden rounded-xs bg-surface"
              style={{ aspectRatio: `${cover.width} / ${cover.height}`, maxWidth: Math.min(cover.width * 1.6, 960) }}
            >
              <Image src={cover.src} alt={cover.alt ?? project.title} fill priority sizes="(min-width: 1024px) 960px, 100vw" className="object-cover" />
            </div>
          )}
        </div>
      </header>

      <div className="container-site py-10 md:py-16">
        {project.description && (
          <Block title="El proyecto">
            {project.description.map((d) => (
              <p key={d} className="mb-4 last:mb-0">
                {d}
              </p>
            ))}
          </Block>
        )}
        {project.challenge && (
          <Block title="El reto">
            <p>{project.challenge}</p>
          </Block>
        )}
        {project.solution && (
          <Block title="Nuestra solución">
            <p>{project.solution}</p>
          </Block>
        )}
        {project.engineering && (
          <Block title="Ingeniería">
            <ul className="grid gap-3">
              {project.engineering.map((e) => (
                <li key={e} className="flex gap-3">
                  <span className="mt-3 h-px w-5 shrink-0 bg-gold" aria-hidden="true" />
                  {e}
                </li>
              ))}
            </ul>
          </Block>
        )}
        {project.keyFacts && (
          <Block title="Datos clave">
            <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {project.keyFacts.map((f) => (
                <div key={f.label} className="flex flex-col-reverse justify-end">
                  <dt className="mt-2 text-base text-fg-2">{f.label}</dt>
                  <dd className="font-mono tabular text-3xl text-fg md:text-4xl">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Block>
        )}
        {project.participants && (
          <Block title="Participantes">
            <dl className="grid gap-4 sm:grid-cols-2">
              {project.participants.map((p) => (
                <div key={p.label}>
                  <dt className="text-sm text-fg-3">{p.label}</dt>
                  <dd className="text-fg">{p.value}</dd>
                </div>
              ))}
            </dl>
          </Block>
        )}
        {project.video && (
          <Block title="Video">
            <ProjectVideo video={project.video} />
          </Block>
        )}
        {project.model3d && (
          <Block title="Modelo 3D / BIM">
            <ProjectModel src={project.model3d} title={project.title} />
          </Block>
        )}
        {gallery.length > 0 && (
          <section aria-labelledby="galeria" className="border-t border-line py-10">
            <h2 id="galeria" className="font-semi-expanded mb-8 text-xl font-semibold text-fg">
              Galería
            </h2>
            <ProjectGallery images={gallery} />
          </section>
        )}
        <p className="border-t border-line pt-6 text-sm text-fg-3">Fuente: {project.source}.</p>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="border-t border-line py-20">
          <div className="container-site">
            <h2 id="relacionados" className="font-semi-expanded text-2xl font-bold text-fg md:text-3xl">
              Proyectos relacionados
            </h2>
            <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.slug}>
                  <ProjectCard project={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Link href={`/proyectos/${next.slug}`} className="group relative block min-h-[60vh] overflow-hidden border-t border-line" aria-label={`Siguiente proyecto: ${next.title}`}>
        {nextCover && (
          <Image
            src={nextCover.src}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-50 transition-[transform,opacity] duration-[1200ms] ease-out group-hover:scale-105 group-hover:opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/60 to-transparent" />
        <div className="container-site relative flex min-h-[60vh] flex-col justify-end pb-16">
          <span className="inline-flex items-center gap-2 font-medium text-gold">
            Siguiente proyecto <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
          <span className="font-semi-expanded mt-3 max-w-4xl text-3xl font-bold leading-tight text-fg md:text-5xl">{next.title}</span>
        </div>
      </Link>

      <div className="container-site flex flex-wrap items-center justify-between gap-6 py-14">
        <p className="text-lg text-fg">¿Tiene un proyecto similar?</p>
        <ButtonLink href="/contacto">{ctaLabels.start}</ButtonLink>
      </div>
    </article>
  );
}
