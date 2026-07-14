import { redirect } from "next/navigation";
import { OnboardingForm } from "@/components/seller/onboarding-form";
import { requireUser } from "@/lib/permissions";

export default async function OnboardingPage() {
  const user = await requireUser();

  if (user.role === "SELLER" || user.role === "ADMIN") {
    redirect("/vendeur");
  }

  return <OnboardingForm />;
}
