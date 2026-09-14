import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { company } from "@/config/company";
import { contactNav, mainNav } from "@/config/navigation";
import { socialNetworks } from "@/config/social";
import { mailtoUrl, telUrl, whatsappUrl } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-canvas-deep">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-6 text-fg-2">
            Ingeniería estructural, investigación sísmica y construcción. {company.address.city}, {company.address.country}.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="text-sm font-semibold text-fg">Sitio</h2>
          <ul className="mt-4 grid gap-2">
            {[...mainNav, contactNav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-fg-2 transition-colors hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold text-fg">Contacto</h2>
          <ul className="mt-4 grid gap-2 text-fg-2">
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                WhatsApp {company.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={telUrl()} className="hover:text-fg">
                Teléfono {company.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={mailtoUrl()} className="break-all hover:text-fg">
                {company.email}
              </a>
            </li>
            <li>
              {company.address.street}, {company.address.city}
            </li>
            {socialNetworks.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-site flex flex-col gap-2 py-6 text-sm text-fg-3 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {company.companyName}. {company.legalId.label} {company.legalId.value}
          </p>
          <p>Contenido basado en el brochure institucional 2026.</p>
        </div>
      </div>
    </footer>
  );
}
