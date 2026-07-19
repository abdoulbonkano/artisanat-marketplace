export const metadata = { title: "Mentions legales" };

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Mentions legales</h1>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Editeur du site</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Le site Marketplace Artisanat est edite par la societe BONKANO SOLUTIONS,
          Societe par actions simplifiee (SASU) au capital social de 500,00 euros,
          immatriculee au Registre du Commerce et des Societes de Bordeaux sous le
          numero 930 452 644, dont le siege social est situe Apt 0001, 1 Rue Jacques
          Cartier, 33700 Merignac, France.
          <br />
          Nom commercial : BONK Solutions.
          <br />
          President : Abdoul Aziz Amadou Bonkano.
          <br />
          Contact : bonkano.solutions@gmail.com
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Directeur de la publication</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Abdoul Aziz Amadou Bonkano, President de BONKANO SOLUTIONS.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Hebergement</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Le site est heberge par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA
          91789, Etats-Unis.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Propriete intellectuelle</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          L&apos;ensemble des elements du site (structure, textes, logos, mise en
          page) est protege par le droit de la propriete intellectuelle. Les photos
          et descriptions des produits publies par les vendeurs restent la propriete
          de leurs auteurs respectifs. Toute reproduction non autorisee est
          susceptible de constituer une contrefacon.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Donnees personnelles</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Les informations recueillies via le site (creation de compte, commandes,
          messagerie) font l&apos;objet d&apos;un traitement destine a assurer le
          fonctionnement de la marketplace. Conformement au Reglement General sur la
          Protection des Donnees (RGPD) et a la loi Informatique et Libertes, vous
          disposez d&apos;un droit d&apos;acces, de rectification, d&apos;effacement
          et de portabilite de vos donnees, exercable en ecrivant a
          bonkano.solutions@gmail.com.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Cookies</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Le site utilise uniquement des cookies strictement necessaires a
          l&apos;authentification et au fonctionnement du panier, sans finalite
          publicitaire.
        </p>
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Ce document est un modele generique fourni a titre indicatif et doit etre
        relu par un professionnel du droit avant mise en production.
      </p>
    </div>
  );
}
