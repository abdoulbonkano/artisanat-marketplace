"use client";

import { demoteAdminAction, promoteToAdminAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function UserRoleActions({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: string;
  isSelf: boolean;
}) {
  const boundPromote = promoteToAdminAction.bind(null, userId);
  const boundDemote = demoteAdminAction.bind(null, userId);

  if (role === "ADMIN") {
    if (isSelf) return null;
    return (
      <form action={boundDemote}>
        <Button type="submit" variant="destructive" size="sm">
          Retirer les droits admin
        </Button>
      </form>
    );
  }

  return (
    <form action={boundPromote}>
      <Button type="submit" variant="outline" size="sm">
        Promouvoir en admin
      </Button>
    </form>
  );
}
