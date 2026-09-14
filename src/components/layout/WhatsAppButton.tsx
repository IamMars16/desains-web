import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { whatsappUrl } from "@/lib/contact";

/** Boton flotante discreto; se oculta durante el hero 3D del home (ver globals). */
export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="whatsapp-float fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-30 inline-flex size-12 items-center justify-center rounded-full border border-line-strong bg-surface/90 text-fg shadow-[0_10px_30px_rgba(3,6,10,0.5)] backdrop-blur transition-[background-color,opacity,transform] duration-500 hover:border-gold hover:text-gold"
    >
      <WhatsappLogo size={24} weight="regular" />
    </a>
  );
}
