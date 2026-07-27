import { z } from "zod";

export const confirmTwoFactorSchema = z.object({
  code: z.string().trim().regex(/^\d{6}$/, "Le code doit contenir exactement 6 chiffres"),
});

export const disableTwoFactorSchema = z.object({
  password: z.string().min(1, "Mot de passe requis"),
});
