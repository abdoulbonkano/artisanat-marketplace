"use server";

import bcrypt from "bcryptjs";
import { signOut } from "@/lib/auth";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { deleteAccountSchema } from "@/lib/validations/account";

export type DeleteAccountState = { error?: string } | undefined;

export async function deleteAccountAction(
  _prevState: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const sessionUser = await requireUser();

  const parsed = deleteAccountSchema.safeParse({
    password: formData.get("password"),
    confirmation: formData.get("confirmation"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: { shop: true },
  });

  if (!user?.hashedPassword) {
    return { error: "Compte introuvable" };
  }

  if (user.role === "ADMIN") {
    return {
      error: "Les comptes administrateur ne peuvent pas etre supprimes en libre-service. Contactez un autre administrateur.",
    };
  }

  if (user.shop) {
    return {
      error:
        "Vous avez une boutique active. Contactez-nous via le formulaire de contact pour organiser la fermeture de votre boutique avant de supprimer votre compte.",
    };
  }

  const isValid = await bcrypt.compare(parsed.data.password, user.hashedPassword);
  if (!isValid) {
    return { error: "Mot de passe incorrect" };
  }

  await prisma.$transaction([
    prisma.session.deleteMany({ where: { userId: user.id } }),
    prisma.account.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.verificationToken.deleteMany({ where: { identifier: user.email } }),
    prisma.cartItem.deleteMany({ where: { cart: { userId: user.id } } }),
    prisma.cart.deleteMany({ where: { userId: user.id } }),
    prisma.user.update({
      where: { id: user.id },
      data: {
        name: "Utilisateur supprime",
        email: `deleted-${user.id}@deleted.local`,
        hashedPassword: null,
        image: null,
        emailVerified: null,
      },
    }),
  ]);

  await signOut({ redirectTo: "/" });
}
