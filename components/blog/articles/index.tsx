import type { ComponentType } from "react";
import { NotreDemarcheArticle } from "./notre-demarche";
import { EntretienArticle } from "./entretien-bijoux-et-ceramiques";

export const articleComponents: Record<string, ComponentType> = {
  "notre-demarche": NotreDemarcheArticle,
  "entretien-bijoux-et-ceramiques": EntretienArticle,
};
