import type { SectorId, ServiceId } from "@/types/content";

/** Etiquetas de filtro por servicio, en el orden en que se muestran. */
export const serviceLabels: Record<ServiceId, string> = {
  "ingenieria-estructural": "Ingeniería estructural",
  construccion: "Construcción",
  "evaluacion-estructural": "Evaluación estructural",
  supervision: "Supervisión",
  bim: "BIM",
  "estudios-especiales": "Estudios especiales",
  hidraulica: "Hidráulica",
  arquitectura: "Arquitectura",
  "revision-estructural": "Revisión estructural",
};

/** Tipo de proyecto o sector, separado del servicio prestado. */
export const sectorLabels: Record<SectorId, string> = {
  vivienda: "Vivienda multifamiliar",
  educacion: "Educación",
  salud: "Salud",
  puentes: "Puentes",
  "industria-mineria": "Industria y minería",
  deportes: "Deporte y espectáculos",
  institucional: "Institucional",
  transporte: "Aeroportuario",
  "agua-energia": "Agua y energía",
  "comercio-turismo": "Comercio y turismo",
};
