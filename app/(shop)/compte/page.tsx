import { DeleteAccountForm } from "@/components/account/delete-account-form";
import { TwoFactorSettings } from "@/components/account/two-factor-settings";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ComptePage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: { shop: true },
  });

  if (!user) return null;

  const canSelfDelete = user.role !== "ADMIN" && !user.shop;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">Mon compte</h1>
        <p className="text-sm text-muted-foreground">Gerez les informations de votre compte.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Nom</span>
            <span>{user.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Statut email</span>
            <Badge variant={user.emailVerified ? "secondary" : "destructive"}>
              {user.emailVerified ? "Confirme" : "Non confirme"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {(user.role === "SELLER" || user.role === "ADMIN") && (
        <Card>
          <CardHeader>
            <CardTitle>Authentification a deux facteurs</CardTitle>
          </CardHeader>
          <CardContent>
            <TwoFactorSettings enabled={user.twoFactorEnabled} />
          </CardContent>
        </Card>
      )}

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
        </CardHeader>
        <CardContent>
          {canSelfDelete ? (
            <>
              <p className="mb-4 text-sm text-muted-foreground">
                Cette action est irreversible. Vos donnees personnelles seront
                anonymisees et vous serez deconnecte. L&apos;historique de vos
                commandes est conserve de facon anonyme pour nos obligations
                comptables.
              </p>
              <DeleteAccountForm />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {user.role === "ADMIN"
                ? "Les comptes administrateur ne peuvent pas etre supprimes en libre-service."
                : "Vous avez une boutique active. Contactez-nous via le formulaire de contact pour organiser la fermeture de votre boutique avant de supprimer votre compte."}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
