import { VerifyEmailForm } from "@/components/auth/verify-email-form";

export const dynamic = "force-dynamic";

export default async function VerifierEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return <VerifyEmailForm token={token} />;
}
