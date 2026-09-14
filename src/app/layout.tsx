import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { company } from "@/config/company";
import { siteMeta, siteUrl } from "@/config/site";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteMeta.title, template: "%s | DESAINS Ingenieros" },
  description: siteMeta.description,
  applicationName: company.shortName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: siteMeta.locale,
    siteName: company.shortName,
    title: siteMeta.title,
    description: siteMeta.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: siteMeta.title, description: siteMeta.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0f17",
  colorScheme: "dark",
};

/** Se ejecuta antes de pintar: activa las animaciones de revelado solo si el usuario no pidio reducir movimiento. */
const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.motion='on'}}catch(e){}`;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.companyName,
  url: siteUrl,
  foundingDate: String(company.foundedYear),
  email: company.email,
  telephone: company.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressCountry: "PE",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-PE" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#contenido"
          className="fixed left-4 top-4 z-50 -translate-y-24 rounded-xs bg-gold px-4 py-2 font-semibold text-on-gold focus:translate-y-0"
        >
          Saltar al contenido
        </a>
        <div id="top-sentinel" aria-hidden="true" className="absolute top-0 h-px w-px" />
        <SiteHeader />
        <main id="contenido">{children}</main>
        <SiteFooter />
        <WhatsAppButton />
      </body>
    </html>
  );
}
