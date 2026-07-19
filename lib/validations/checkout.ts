import { z } from "zod";

export const shippingSchema = z.object({
  shippingName: z.string().min(2, "Nom requis"),
  shippingAddress: z.string().min(5, "Adresse requise"),
  shippingCity: z.string().min(1, "Ville requise"),
  shippingPostalCode: z.string().min(2, "Code postal requis"),
  shippingCountry: z.string().min(2).default("FR"),
});
