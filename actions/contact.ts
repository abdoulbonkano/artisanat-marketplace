"use server";

import { sendEmail } from "@/lib/email";
import { contactNotificationEmail } from "@/lib/emails/templates";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validations/contact";

export type ContactActionState = { error?: string; success?: boolean } | undefined;

const subjectLabel: Record<string, string> = {
  COMMANDE: "Commande",
  BOUTIQUE: "Boutique / vendeur",
  PARTENARIAT: "Partenariat artisan",
  AUTRE: "Autre",
};

export async function submitContactAction(
  _prevState: ContactActionState,
  formData: FormData,
): Promise<ContactActionState> {
  const ip = await getClientIp();
  const { allowed } = await checkRateLimit(`contact:${ip}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!allowed) {
    return { error: "Trop de messages envoyes. Reessayez plus tard." };
  }

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

  const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
  await Promise.all(
    admins.map((admin: (typeof admins)[number]) =>
      sendEmail({
        to: admin.email,
        ...contactNotificationEmail({
          name: parsed.data.name,
          email: parsed.data.email,
          subject: subjectLabel[parsed.data.subject] ?? parsed.data.subject,
          message: parsed.data.message,
        }),
      }),
    ),
  );

  return { success: true };
}
