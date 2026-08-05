import { z } from "zod";

export const createShopSchema = z.object({
  name: z.string().min(2, "Le nom de la boutique doit contenir au moins 2 caracteres"),
  description: z
    .string()
    .min(20, "Decrivez votre activite d'artisan en quelques phrases (20 caracteres minimum)")
    .max(2000),
  siret: z
    .string()
    .regex(/^\d{14}$/, "Le numero SIRET doit contenir exactement 14 chiffres"),
  phone: z.string().min(6, "Numero de telephone invalide").max(20),
  shippingPrice: z.preprocess(
    (v) => (v == null || (typeof v === "string" && v.trim() === "") ? undefined : v),
    z.coerce
      .number()
      .min(0, "Le montant ne peut pas etre negatif")
      .max(1000, "Montant trop eleve")
      .optional(),
  ),
  shippingInfo: z
    .string()
    .max(200, "200 caracteres maximum")
    .optional()
    .transform((v) => (v && v.trim() !== "" ? v : null)),
});

export const updateShopSchema = createShopSchema;
