import { EnvelopeSimple, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { company } from "@/config/company";
import { mailtoUrl, telUrl, whatsappUrl } from "@/lib/contact";

export function ContactActions({ layout = "stack" }: { layout?: "stack" | "grid" }) {
  const items = [
    {
      label: "WhatsApp",
      value: company.phoneDisplay,
      href: whatsappUrl(company.messages.general),
      icon: WhatsappLogo,
      external: true,
      primary: true,
    },
    { label: "Correo", value: company.email, href: mailtoUrl(), icon: EnvelopeSimple },
    { label: "Teléfono", value: company.phoneDisplay, href: telUrl(), icon: Phone },
  ];
  return (
    <ul className={layout === "grid" ? "grid gap-4 md:grid-cols-3" : "grid gap-3"}>
      {items.map(({ label, value, href, icon: Icon, external, primary }) => (
        <li key={label}>
          <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`group flex min-h-16 items-center gap-4 rounded-xs border px-5 py-4 transition-colors ${
              primary ? "border-gold bg-gold text-on-gold hover:bg-gold-hover" : "border-line-strong text-fg hover:bg-hover"
            }`}
          >
            <Icon size={26} weight="regular" aria-hidden="true" />
            <span className="flex min-w-0 flex-col">
              <span className="font-semibold">{label}</span>
              <span className={`truncate text-sm ${primary ? "text-on-gold/80" : "text-fg-2"}`}>{value}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
