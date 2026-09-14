"use client";

import { EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react";
import { useId, useState, type FormEvent } from "react";
import { company } from "@/config/company";
import { serviceLabels } from "@/data/projects/taxonomy";
import { mailtoUrl, whatsappUrl } from "@/lib/contact";

type Field = "nombre" | "servicio" | "descripcion";

/**
 * Formulario sin servidor: arma el mensaje y lo abre en WhatsApp o en el correo del usuario.
 * No guarda ni envia datos a terceros.
 */
export function ProjectRequestForm() {
  const id = useId();
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const handle = (channel: "whatsapp" | "email") => (e: FormEvent) => {
    e.preventDefault();
    const form = (e.currentTarget as HTMLElement).closest("form");
    if (!form) return;
    const data = new FormData(form);
    const v = (k: string) => String(data.get(k) ?? "").trim();
    const next: Partial<Record<Field, string>> = {};
    if (!v("nombre")) next.nombre = "Escriba su nombre.";
    if (!v("servicio")) next.servicio = "Seleccione el servicio que necesita.";
    if (v("descripcion").length < 15) next.descripcion = "Describa el proyecto en al menos 15 caracteres.";
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    const lines = [
      company.messages.project,
      `Nombre: ${v("nombre")}`,
      v("empresa") && `Empresa: ${v("empresa")}`,
      `Servicio: ${v("servicio")}`,
      v("ubicacion") && `Ubicación: ${v("ubicacion")}`,
      `Descripción: ${v("descripcion")}`,
    ].filter(Boolean);
    const text = lines.join("\n");
    const url = channel === "whatsapp" ? whatsappUrl(text) : mailtoUrl(company.messages.emailSubject, text);
    window.open(url, channel === "whatsapp" ? "_blank" : "_self", "noopener");
  };

  const input = "min-h-12 w-full rounded-xs border border-line-strong bg-surface px-4 text-fg placeholder:text-fg-3 aria-[invalid=true]:border-[#f08a7a]";
  const err = (f: Field) =>
    errors[f] ? (
      <p id={`${id}-${f}-e`} role="alert" className="text-sm text-[#f4a597]">
        {errors[f]}
      </p>
    ) : null;

  return (
    <form noValidate className="grid gap-6" onSubmit={handle("whatsapp")}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor={`${id}-nombre`} className="font-medium text-fg">
            Nombre <span className="text-fg-3">(obligatorio)</span>
          </label>
          <input id={`${id}-nombre`} name="nombre" autoComplete="name" className={input} aria-invalid={!!errors.nombre} aria-describedby={errors.nombre ? `${id}-nombre-e` : undefined} />
          {err("nombre")}
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${id}-empresa`} className="font-medium text-fg">
            Empresa o entidad
          </label>
          <input id={`${id}-empresa`} name="empresa" autoComplete="organization" className={input} />
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${id}-servicio`} className="font-medium text-fg">
            Servicio <span className="text-fg-3">(obligatorio)</span>
          </label>
          <select id={`${id}-servicio`} name="servicio" defaultValue="" className={input} aria-invalid={!!errors.servicio} aria-describedby={errors.servicio ? `${id}-servicio-e` : undefined}>
            <option value="" disabled>
              Seleccione una opción
            </option>
            {Object.values(serviceLabels).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
            <option value="Otro">Otro</option>
          </select>
          {err("servicio")}
        </div>
        <div className="grid gap-2">
          <label htmlFor={`${id}-ubicacion`} className="font-medium text-fg">
            Ubicación del proyecto
          </label>
          <input id={`${id}-ubicacion`} name="ubicacion" autoComplete="address-level2" className={input} />
        </div>
      </div>
      <div className="grid gap-2">
        <label htmlFor={`${id}-descripcion`} className="font-medium text-fg">
          Descripción del proyecto <span className="text-fg-3">(obligatorio)</span>
        </label>
        <textarea
          id={`${id}-descripcion`}
          name="descripcion"
          autoComplete="off"
          rows={5}
          className={`${input} py-3`}
          aria-invalid={!!errors.descripcion}
          aria-describedby={`${id}-descripcion-h${errors.descripcion ? ` ${id}-descripcion-e` : ""}`}
        />
        <p id={`${id}-descripcion-h`} className="text-sm text-fg-3">
          Por ejemplo: tipo de edificación, número de niveles, etapa del proyecto y plazos.
        </p>
        {err("descripcion")}
      </div>
      <div className="flex flex-wrap gap-3">
        <button type="submit" className="inline-flex min-h-12 items-center gap-2 rounded-xs bg-gold px-5 font-semibold text-on-gold hover:bg-gold-hover">
          <WhatsappLogo size={20} aria-hidden="true" /> Enviar por WhatsApp
        </button>
        <button type="button" onClick={handle("email")} className="inline-flex min-h-12 items-center gap-2 rounded-xs border border-line-strong px-5 font-semibold text-fg hover:bg-hover">
          <EnvelopeSimple size={20} aria-hidden="true" /> Enviar por correo
        </button>
      </div>
      <p className="text-sm text-fg-3">El mensaje se abre en su WhatsApp o en su aplicación de correo para que lo revise antes de enviarlo.</p>
    </form>
  );
}
