/**
 * Unico lugar para editar los datos de contacto de la empresa.
 * Todos los botones (WhatsApp, correo, telefono) leen de aqui.
 */
export const company = {
  companyName: "DESAINS INGENIEROS SRL",
  shortName: "DESAINS Ingenieros",
  legalId: { label: "RUC", value: "20570524063" },
  foundedYear: 2006,
  formerName: "SYGNUS S.A.C.",
  generalManager: "Ing. Arnold Ramsey Mendo Rodríguez",

  /** Telefono en formato internacional sin espacios, se usa para tel: */
  phone: "+51998487401",
  phoneDisplay: "+51 998 487 401",

  /** Numero para WhatsApp: codigo de pais + numero, solo digitos. */
  whatsapp: "51998487401",

  email: "arnold.r.mendo@gmail.com",
  secondaryEmail: "arnold.mendo@pucp.pe",

  address: {
    street: "Jr. Marañón N° 448",
    city: "Cajamarca",
    country: "Perú",
  },

  /** Mensajes iniciales de WhatsApp y correo. */
  messages: {
    general: "Hola, quisiera información sobre un proyecto de ingeniería.",
    quote: "Hola, quisiera solicitar una cotización para un proyecto.",
    project: "Hola, quiero iniciar un proyecto con DESAINS Ingenieros.",
    emailSubject: "Consulta de proyecto desde la web",
  },
} as const;

export type Company = typeof company;
