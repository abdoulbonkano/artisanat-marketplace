import { requireUser } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function VendeurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
}
