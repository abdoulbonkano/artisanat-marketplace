import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Merci d'indiquer votre nom"),
  email: z.string().email("Adresse email invalide"),
  subject: z.enum(["COMMANDE", "BOUTIQUE", "PARTENARIAT", "AUTRE"]),
  message: z
    .string()
    .min(10, "Votre message est un peu court (10 caracteres minimum)")
    .max(3000),
});
