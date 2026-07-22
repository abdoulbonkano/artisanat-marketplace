import { ScrollText } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

export default async function AdminAuditPage() {
  const logs = await prisma.adminAuditLog.findMany({
    include: { admin: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Journal d&apos;activite</h1>

      {logs.length === 0 ? (
        <EmptyState icon={ScrollText} title="Aucune action enregistree pour le moment" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log: (typeof logs)[number]) => (
              <TableRow key={log.id}>
                <TableCell>
                  {log.createdAt.toLocaleDateString("fr-FR")}{" "}
                  {log.createdAt.toLocaleTimeString("fr-FR")}
                </TableCell>
                <TableCell>{log.admin.name}</TableCell>
                <TableCell className="font-mono text-xs">{log.action}</TableCell>
                <TableCell className="text-muted-foreground">{log.detail ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
