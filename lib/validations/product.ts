import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caracteres"),
  description: z.string().min(10, "La description doit contenir au moins 10 caracteres"),
  price: z.coerce.number().positive("Le prix doit etre superieur a 0"),
  stock: z.coerce.number().int().min(0, "Le stock ne peut pas etre negatif"),
  categoryId: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});
