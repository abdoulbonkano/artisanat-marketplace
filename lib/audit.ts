import { prisma } from "@/lib/prisma";

export async function logAdminAction(
  adminId: string,
  action: string,
  targetId?: string,
  detail?: string,
) {
  await prisma.adminAuditLog.create({ data: { adminId, action, targetId, detail } });
}
