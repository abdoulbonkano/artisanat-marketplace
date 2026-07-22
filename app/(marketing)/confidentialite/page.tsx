export const metadata = { title: "Politique de confidentialite" };

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">
        Politique de confidentialite
      </h1>
      <p className="text-sm text-muted-foreground">
        Derniere mise a jour : 22 juillet 2026.
      </p>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Qui traite vos donnees ?</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          BONKANO SOLUTIONS, editeur du site Marketplace Artisanat, est
          responsable du traitement des donnees personnelles collectees via le
          site. Pour toute question, ecrivez a{" "}
          <a href="mailto:bonkano.solutions@gmail.com" className="underline">
            bonkano.solutions@gmail.com
          </a>
          .
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Quelles donnees sont collectees</h2>
        <ul className="list-disc pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>
            Compte : nom, adresse email, mot de passe (stocke sous forme
            chiffree, jamais en clair).
          </li>
          <li>
            Commandes : adresse de livraison, historique d&apos;achats,
            informations de paiement traitees directement par Stripe (nous ne
            stockons jamais votre numero de carte).
          </li>
          <li>
            Messagerie : messages echanges entre acheteurs et vendeurs sur la
            plateforme.
          </li>
          <li>Avis et notes laisses sur les produits achetes.</li>
          <li>Liste de favoris.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">
          Pourquoi ces donnees sont collectees
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Ces informations sont utilisees exclusivement pour faire fonctionner
          la marketplace : creer et gerer votre compte, traiter vos commandes
          et livraisons, permettre la messagerie entre acheteurs et vendeurs,
          vous envoyer des emails transactionnels (confirmation de commande,
          reinitialisation de mot de passe, etc.), et repondre a vos demandes
          via le formulaire de contact.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Partage avec des tiers</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Certaines donnees transitent par des prestataires techniques
          necessaires au fonctionnement du site, chacun agissant selon sa
          propre politique de confidentialite :
        </p>
        <ul className="list-disc pl-5 text-sm leading-relaxed text-muted-foreground">
          <li>Stripe (paiement en ligne)</li>
          <li>Resend (envoi des emails transactionnels)</li>
          <li>Vercel et Neon (hebergement du site et de la base de donnees)</li>
        </ul>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Nous ne vendons ni ne louons vos donnees personnelles a des tiers a
          des fins commerciales ou publicitaires.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Duree de conservation</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Vos donnees de compte sont conservees tant que votre compte existe.
          Vous pouvez le supprimer a tout moment depuis la page{" "}
          <a href="/compte" className="underline">
            Mon compte
          </a>
          . Les donnees de commande sont conservees, meme apres suppression du
          compte, pour respecter nos obligations comptables legales (elles
          sont alors anonymisees).
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Vos droits</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Conformement au Reglement General sur la Protection des Donnees
          (RGPD), vous disposez d&apos;un droit d&apos;acces, de
          rectification, d&apos;effacement, de limitation et de portabilite
          de vos donnees. Vous pouvez exercer ces droits directement depuis
          votre compte, ou en ecrivant a{" "}
          <a href="mailto:bonkano.solutions@gmail.com" className="underline">
            bonkano.solutions@gmail.com
          </a>
          .
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Cookies</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Le site utilise uniquement des cookies strictement necessaires a son
          fonctionnement : maintien de votre session de connexion et de votre
          panier. Ces cookies ne servent ni a la publicite ni au suivi
          publicitaire et n&apos;exigent pas de consentement prealable au
          regard de la reglementation en vigueur. Si des cookies de mesure
          d&apos;audience ou publicitaires venaient a etre ajoutes a
          l&apos;avenir, un bandeau de consentement adapte serait mis en
          place avant leur depot.
        </p>
      </section>

      <p className="mt-4 text-xs text-muted-foreground">
        Ce document est un modele generique fourni a titre indicatif et doit
        etre relu par un professionnel du droit avant mise en production.
      </p>
    </div>
  );
}
