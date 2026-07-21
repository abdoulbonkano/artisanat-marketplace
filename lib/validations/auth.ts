import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caracteres"),
  email: z.email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caracteres"),
});

export const signInSchema = z.object({
  email: z.email("Adresse email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export const requestPasswordResetSchema = z.object({
  email: z.email("Adresse email invalide"),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caracteres"),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
