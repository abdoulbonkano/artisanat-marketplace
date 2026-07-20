import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/seller/onboarding-form";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function OnboardingPage() {
  const user = await requireUser();

  const shop = await prisma.shop.findUnique({ where: { ownerId: user.id } });
  if (shop) {
    redirect("/vendeur");
  }

  return <OnboardingForm />;
}
