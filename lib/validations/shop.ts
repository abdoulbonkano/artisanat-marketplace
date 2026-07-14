import { z } from "zod";

export const createShopSchema = z.object({
  name: z.string().min(2, "Le nom de la boutique doit contenir au moins 2 caracteres"),
  description: z.string().max(2000).optional(),
});

export const updateShopSchema = createShopSchema;
