"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations/contact";

export type ContactActionState = { error?: string; success?: boolean } | undefined;

export async function submitContactAction(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  await prisma.contactMessage.create({ data: parsed.data });

  return { success: true };
}
