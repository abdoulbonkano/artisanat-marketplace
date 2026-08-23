export const metadata = { title: "Conditions generales de vente" };

export default function CgvPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        Conditions generales de vente
      </h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">1. Champ d&apos;application</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Les presentes conditions generales de vente (CGV) regissent les ventes
          conclues entre les vendeurs artisans et les acheteurs via la plateforme
          Façonné, editee par BONKANO SOLUTIONS. Chaque vente constitue
          un contrat direct entre le vendeur et l&apos;acheteur ; BONKANO SOLUTIONS
          intervient uniquement en tant qu&apos;intermediaire technique et
          encaisseur du paiement pour le compte des vendeurs.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">2. Prix</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Les prix des produits sont affiches en euros, toutes taxes comprises. Ils
          sont fixes librement par chaque vendeur et n&apos;incluent pas
          necessairement les frais de livraison, precises avant validation de la
          commande le cas echeant.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">3. Commande et paiement</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          La commande est validee lorsque l&apos;acheteur confirme son panier et
          procede au paiement via la solution securisee Stripe. Le paiement est exige
          en integralite au moment de la commande. Une confirmation est envoyee a
          l&apos;acheteur une fois le paiement accepte.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">4. Livraison</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Les delais et modalites de livraison sont geres par chaque vendeur pour ses
          propres produits. L&apos;acheteur est invite a se referer aux informations
          fournies sur la fiche produit ou aupres du vendeur via la messagerie.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">5. Droit de retractation</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Conformement aux articles L.221-18 et suivants du Code de la consommation,
          l&apos;acheteur dispose d&apos;un delai de 14 jours a compter de la
          reception du produit pour exercer son droit de retractation, sauf
          exceptions legales (produits personnalises ou confectionnes selon les
          specifications du consommateur, notamment). La demande de retractation est
          a adresser directement au vendeur concerne.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">6. Garanties legales</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Les produits vendus beneficient de la garantie legale de conformite
          (articles L.217-3 et suivants du Code de la consommation) et de la garantie
          des vices caches (articles 1641 et suivants du Code civil), dues par le
          vendeur.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">7. Responsabilite</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          BONKANO SOLUTIONS n&apos;etant pas partie au contrat de vente, sa
          responsabilite ne saurait etre engagee au titre de la conformite, de la
          qualite ou de la livraison des produits. La responsabilite du vendeur
          demeure entiere a ce titre.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">8. Mediation de la consommation</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          En cas de litige non resolu directement avec le vendeur, l&apos;acheteur
          consommateur peut recourir gratuitement a un mediateur de la consommation,
          conformement aux articles L.616-1 et suivants du Code de la consommation.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">9. Droit applicable</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Les presentes CGV sont soumises au droit francais.
        </p>
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Ce document est un modele generique fourni a titre indicatif et doit etre
        relu par un professionnel du droit avant mise en production, notamment pour
        confirmer le regime applicable a une marketplace multi-vendeurs (repartition
        des responsabilites, obligations d&apos;information issues du Code de la
        consommation et de la reglementation europeenne sur les services
        numeriques).
      </p>
    </div>
  );
}
