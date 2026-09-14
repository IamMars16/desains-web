import Image from "next/image";
import Link from "next/link";
import type { Professional } from "@/types/content";

export function ProfessionalCard({ person, sizes = "(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 70vw" }: { person: Professional; sizes?: string }) {
  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xs bg-surface">
        <Image
          src={person.photo.src}
          alt={person.photo.alt ?? person.name}
          fill
          sizes={sizes}
          className="object-cover grayscale transition-[filter,transform] duration-700 group-hover:scale-[1.03] group-hover:grayscale-0 group-has-[:focus-visible]:grayscale-0"
        />
      </div>
      <h3 className="mt-4 text-lg font-semibold leading-snug text-fg">
        <Link href={`/profesionales/${person.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
          {person.name}
        </Link>
      </h3>
      <p className="mt-1 text-fg-2">{person.role ?? person.specialty}</p>
      {person.role && <p className="text-sm text-fg-3">{person.specialty}</p>}
      <span className="mt-3 inline-block text-sm font-medium text-gold">Ver perfil</span>
      <span className="pointer-events-none absolute -inset-2 rounded-xs ring-2 ring-focus opacity-0 group-has-[:focus-visible]:opacity-100" aria-hidden="true" />
    </article>
  );
}
