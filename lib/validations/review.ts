import { z } from "zod";

export const createReviewSchema = z.object({
  orderItemId: z.string().min(1),
  rating: z.coerce.number().int().min(1, "Note requise").max(5, "Note invalide"),
  comment: z
    .string()
    .max(2000, "Le commentaire ne peut pas depasser 2000 caracteres")
    .optional()
    .transform((value) => (value ? value.trim() : undefined))
    .transform((value) => (value === "" ? undefined : value)),
});
