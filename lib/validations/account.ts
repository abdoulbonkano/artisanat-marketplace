import { z } from "zod";

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Mot de passe requis"),
  confirmation: z.literal("SUPPRIMER", {
    message: "Tapez SUPPRIMER en majuscules pour confirmer",
  }),
});
