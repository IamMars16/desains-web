import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { getFilterOptions, projects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Puentes, edificaciones, infraestructura educativa, industrial y de salud: proyectos de ingeniería estructural, evaluación, supervisión y BIM.",
  alternates: { canonical: "/proyectos" },
};

/** HTML estatico con todos los proyectos mientras el cliente aplica los filtros de la URL. */
function AllProjects() {
  return (
    <div className="container-site py-12 md:py-16">
      <ul className="mt-32 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.slug}>
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        title="Proyectos"
        intro={`${projects.length} proyectos de ingeniería estructural, evaluación, supervisión, BIM y construcción desarrollados desde 2006.`}
      />
      <Suspense fallback={<AllProjects />}>
        <ProjectExplorer projects={projects} options={getFilterOptions()} />
      </Suspense>
    </>
  );
}
