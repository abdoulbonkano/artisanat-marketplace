import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/auth/connexion");
  return session.user;
}

export async function requireSeller() {
  const user = await requireUser();
  if (user.role !== "SELLER" && user.role !== "ADMIN") {
    redirect(`/?debug_role=${encodeURIComponent(String(user.role))}&debug_id=${encodeURIComponent(user.id)}`);
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") redirect("/");
  return user;
}
