export const metadata = { title: "Conditions generales d'utilisation" };

export default function CguPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        Conditions generales d&apos;utilisation
      </h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">1. Objet</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Les presentes conditions generales d&apos;utilisation (CGU) regissent
          l&apos;acces et l&apos;utilisation du site Marketplace Artisanat, edite par
          BONKANO SOLUTIONS (SASU, RCS Bordeaux 930 452 644), qui met en relation des
          artisans createurs (« vendeurs ») et des particuliers (« acheteurs ») pour
          la vente d&apos;articles issus de l&apos;artisanat.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">2. Acces au site et creation de compte</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          L&apos;acces a certaines fonctionnalites (achat, vente, messagerie)
          necessite la creation d&apos;un compte. L&apos;utilisateur s&apos;engage a
          fournir des informations exactes et a maintenir la confidentialite de ses
          identifiants. Tout utilisateur peut, sous reserve de repondre aux
          conditions, ouvrir une boutique de vendeur depuis son compte.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">3. Role de la plateforme</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          BONKANO SOLUTIONS agit en qualite d&apos;intermediaire technique entre
          vendeurs et acheteurs. Les contrats de vente sont conclus directement entre
          le vendeur et l&apos;acheteur ; la plateforme n&apos;est pas partie a la
          transaction et n&apos;est pas responsable de la conformite, de la qualite
          ou de la livraison des produits vendus par les vendeurs tiers.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">4. Contenu publie par les utilisateurs</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Les vendeurs sont seuls responsables des descriptions, photos et prix
          publies pour leurs produits. Tout contenu illicite, trompeur ou portant
          atteinte aux droits de tiers pourra etre retire par l&apos;administration
          du site, qui se reserve le droit de suspendre ou de supprimer une boutique
          ou un compte en cas de manquement.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">5. Messagerie</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          La messagerie interne permet aux acheteurs et vendeurs d&apos;echanger au
          sujet des produits et commandes. Tout usage abusif (demarchage, propos
          injurieux, contenu illicite) est interdit et peut entrainer la suspension
          du compte.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">6. Donnees personnelles</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Le traitement des donnees personnelles des utilisateurs est decrit dans les
          mentions legales du site, conformement au RGPD.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">7. Modification des CGU</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          BONKANO SOLUTIONS se reserve le droit de modifier les presentes CGU a tout
          moment. Les utilisateurs seront informes des modifications substantielles
          via le site.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">8. Droit applicable</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Les presentes CGU sont soumises au droit francais. En cas de litige, les
          tribunaux du ressort du siege social de BONKANO SOLUTIONS seront
          competents, sauf disposition imperative contraire applicable aux
          consommateurs.
        </p>
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Ce document est un modele generique fourni a titre indicatif et doit etre
        relu par un professionnel du droit avant mise en production.
      </p>
    </div>
  );
}
