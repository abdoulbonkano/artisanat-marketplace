import { z } from "zod";

export const createPromoCodeSchema = z.object({
  code: z
    .string()
    .min(3, "3 caracteres minimum")
    .max(30)
    .transform((value) => value.trim().toUpperCase()),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().int().positive("La valeur doit etre positive"),
  maxUses: z
    .string()
    .optional()
    .transform((value) => (value && value.trim() !== "" ? Number(value) : undefined)),
  expiresAt: z
    .string()
    .optional()
    .transform((value) => (value && value.trim() !== "" ? new Date(value) : undefined)),
});
