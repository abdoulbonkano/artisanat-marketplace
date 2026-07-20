import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/auth/connexion");
  return session.user;
}

export async function requireSeller() {
  const user = await requireUser();
  if (user.role !== "SELLER" && user.role !== "ADMIN") redirect("/");
  return user;
}

// A SELLER/ADMIN role doesn't guarantee a Shop row exists (e.g. an admin
// account, or a role that was granted without going through onboarding) —
// route sellers without a shop to onboarding instead of crashing.
export async function requireShop() {
  const user = await requireSeller();
  const shop = await prisma.shop.findUnique({ where: { ownerId: user.id } });
  if (!shop) redirect("/vendeur/onboarding");
  return { user, shop };
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/");
  return user;
}
