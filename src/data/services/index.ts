import type { Service, SpecialStudy } from "@/types/content";
import { projectImages, siteImages } from "@/data/generated/images";

const img = (key: string, alt: string) => ({ ...siteImages[key], alt });
const projectImg = (slug: string, i: number, alt: string) => ({ ...projectImages[slug][i], alt });

/** Servicios que presta DESAINS (brochure pp. 2, 16-21, 32). El tipo de proyecto se trata aparte. */
export const services: Service[] = [
  {
    id: "ingenieria-estructural",
    name: "Ingeniería estructural",
    summary: "Concepción y cálculo de estructuras, nuestra actividad principal desde los inicios como SYGNUS S.A.C.",
    detail: [
      "La concepción estructural es uno de los aspectos fundamentales de todo proyecto de ingeniería. Por esa razón nuestro equipo se ha especializado en el cálculo de estructuras.",
    ],
    image: img("servicios/estructural", "Modelo estructural tridimensional de una edificación"),
  },
  {
    id: "evaluacion-estructural",
    name: "Evaluación estructural y reforzamiento",
    summary: "Capacidad de estructuras existentes ante nuevas solicitaciones y propuesta del refuerzo necesario.",
    detail: [
      "La evaluación estructural se realiza para evaluar la capacidad de estructuras ante la incertidumbre de la acción de nuevas solicitaciones.",
      "Mediante la evaluación se propone el refuerzo necesario para que las estructuras satisfagan sus estados límite de diseño.",
    ],
    image: projectImg("reservorio-manuel-vasquez", 2, "Modelo de elementos finitos del reservorio Manuel Vásquez"),
  },
  {
    id: "revision-estructural",
    name: "Revisión estructural de expedientes",
    summary: "Revisión de proyectos estructurales de terceros para entidades y consultoras.",
    detail: ["Participamos como revisores estructurales de expedientes técnicos de puentes y hospitales."],
    image: projectImg("hospital-provincial-viru", 0, "Plano del proyecto del Hospital Provincial de Virú"),
  },
  {
    id: "construccion",
    name: "Construcción",
    summary: "Ejecución de obras bajo rigurosos protocolos de calidad, con experiencia continua desde 2006.",
    detail: [
      "Aseguramos que cada edificación satisfaga plenamente sus estados límite de diseño durante toda su vida útil.",
    ],
    image: img("servicios/construccion", "Obra de puente en ejecución"),
  },
  {
    id: "supervision",
    name: "Supervisión",
    summary: "Calidad de la construcción, correcta ejecución de las obras y soluciones durante la ejecución.",
    detail: [
      "Realizamos el servicio de supervisión para garantizar la calidad de la construcción, la correcta ejecución de las obras y proponer soluciones eficientes a los problemas que se presentan en cada proyecto.",
    ],
    image: img("servicios/supervision", "Vista aérea de un coliseo supervisado"),
  },
  {
    id: "bim",
    name: "Modelamiento BIM",
    summary: "Gemelos digitales para resolver interferencias y validar cada detalle antes de construir.",
    detail: [
      "Implementamos la metodología BIM (Building Information Modeling) para desarrollar gemelos digitales de nuestros proyectos.",
      "Esto permite resolver interferencias, optimizar recursos y modelar el comportamiento de las estructuras en un entorno virtual antes de que se inicie su construcción real.",
    ],
    image: projectImg("colegio-emblematico-trujillo", 0, "Modelo BIM de colegio emblemático en Trujillo"),
  },
  {
    id: "arquitectura",
    name: "Arquitectura",
    summary: "Una arquitectura bien concebida permite un esqueleto estructural eficiente y económico.",
    detail: [
      "La arquitectura constituye uno de los aspectos más importantes en la concepción de un proyecto. Una arquitectura bien concebida permite que el esqueleto estructural sea eficiente y cumpla con los requisitos de economía exigidos en todo proyecto.",
    ],
    image: projectImg("archivo-regional-cajamarca", 1, "Proyecto arquitectónico del Archivo Regional de Cajamarca"),
  },
  {
    id: "estudios-especiales",
    name: "Estudios especiales",
    summary: "Peligro sísmico, análisis Pushover, licuación de suelos, presas, taludes e hidráulica para puentes.",
    detail: ["Estudios de alta especialización que complementan el diseño y la evaluación de estructuras."],
    image: img("estudios/peligro-sismico", "Mapa de peligro sísmico del Perú"),
  },
];

/** Estudios especiales (brochure pp. 11-13). */
export const specialStudies: SpecialStudy[] = [
  {
    id: "presas-taludes",
    name: "Análisis dinámico de presas y estabilidad de taludes",
    summary:
      "Permite analizar la configuración geométrica adecuada de presas o zonas de ladera para que permanezcan estables ante las fuerzas que pueden actuar durante su vida útil.",
    images: [img("estudios/taludes", "Evaluación de la estabilidad de taludes"), img("estudios/presas", "Análisis dinámico de presas")],
  },
  {
    id: "licuacion",
    name: "Análisis de licuación de suelos",
    summary:
      "Estima la pérdida de firmeza o rigidez del suelo durante el movimiento sísmico, que puede causar colapso de estructuras, deslizamientos y daños en tuberías.",
    images: [img("estudios/licuacion", "Evaluación de las condiciones geotécnicas por licuación de suelos")],
  },
  {
    id: "peligro-sismico",
    name: "Estudios de peligro sísmico",
    summary:
      "Estiman el movimiento del suelo en un lugar determinado con valores de aceleración, velocidad o desplazamiento para un nivel de probabilidad de ocurrencia.",
    images: [
      img("estudios/peligro-sismico", "Cálculo de mapas de peligro sísmico (Mendo, 2015)"),
      img("estudios/espectros", "Espectros de probabilidad uniforme en sitios específicos (Mendo, 2015)"),
    ],
  },
  {
    id: "escalogramas",
    name: "Construcción de escalogramas",
    summary:
      "Detectan contenidos de frecuencia predominantes en el suelo para el diseño sismorresistente. En Cajamarca, con el sismo del Alto Mayo 2019, se identificaron periodos predominantes alrededor de 1,0 s.",
    images: [img("estudios/escalograma", "Escalograma del suelo de Cajamarca, sismo del Alto Mayo 2019")],
  },
  {
    id: "senales",
    name: "Selección y escalamiento de señales sísmicas",
    summary:
      "Paso fundamental del análisis estructural que influye directamente en la confiabilidad de los resultados de respuesta estructural.",
    images: [img("estudios/senales", "Selección y escalamiento de señales sísmicas")],
  },
  {
    id: "pushover",
    name: "Análisis Pushover",
    summary:
      "El análisis estático no lineal identifica con precisión las vulnerabilidades y mecanismos de falla de una edificación para optimizar su refuerzo.",
    images: [
      img("estudios/pushover-modelo", "Evaluación de estructura mediante análisis Pushover"),
      img("estudios/pushover-curva", "Curva de resistencia de la edificación"),
    ],
  },
  {
    id: "hidraulica-puentes",
    name: "Estudios hidráulicos para el diseño de puentes",
    summary:
      "Con software como HEC-RAS o IBER se estiman velocidades del flujo, cotas del agua y otros parámetros para el diseño hidráulico de puentes.",
    images: [
      img("estudios/hidraulica-2d", "Modelamiento hidráulico bidimensional"),
      img("estudios/socavacion", "Modelo para el cálculo de socavación en estribos y pilas"),
    ],
  },
];
