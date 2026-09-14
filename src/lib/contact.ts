import { company } from "@/config/company";

export function whatsappUrl(message: string = company.messages.general): string {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mailtoUrl(subject: string = company.messages.emailSubject, body = ""): string {
  const params = new URLSearchParams({ subject, body }).toString().replace(/\+/g, "%20");
  return `mailto:${company.email}?${params}`;
}

export function telUrl(): string {
  return `tel:${company.phone}`;
}
