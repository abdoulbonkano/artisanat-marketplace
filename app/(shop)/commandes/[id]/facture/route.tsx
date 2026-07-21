import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { OrderInvoiceDocument } from "@/lib/invoice";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await requireUser();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order || order.buyerId !== user.id) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const buffer = await renderToBuffer(<OrderInvoiceDocument order={order} />);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="facture-${order.id}.pdf"`,
    },
  });
}
