import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Questions frequentes sur la commande, le paiement, la livraison, les retours et devenir vendeur sur " +
    SITE_NAME +
    ".",
};

const faqSections = [
  {
    title: "Commander et payer",
    items: [
      {
        q: "Comment se passe le paiement ?",
        a: "Le paiement est securise via Stripe et regle en integralite au moment de la commande. Vous recevez une confirmation par email des que le paiement est accepte.",
      },
      {
        q: "Les prix affiches incluent-ils la livraison ?",
        a: "Les prix sont affiches toutes taxes comprises mais n'incluent pas necessairement la livraison, fixee par chaque vendeur. Quand un vendeur a renseigne son frais et son delai indicatif, ils apparaissent directement sur la fiche produit.",
      },
    ],
  },
  {
    title: "Livraison et retours",
    items: [
      {
        q: "Qui gere l'expedition de ma commande ?",
        a: "Chaque vendeur expedie lui-meme ses propres produits - il n'y a pas d'entrepot central. Une fois la commande expediee, le transporteur et le numero de suivi sont visibles depuis \"Mes commandes\".",
      },
      {
        q: "Puis-je retourner un article ?",
        a: "Oui, vous disposez de 14 jours a compter de la reception pour vous retracter, sauf pour les articles personnalises ou fabriques sur mesure. La demande se fait depuis la page de votre commande ; une fois approuvee par le vendeur, le remboursement est declenche automatiquement.",
      },
    ],
  },
  {
    title: "Vendre sur le site",
    items: [
      {
        q: "Comment devenir vendeur ?",
        a: "Creez un compte, puis remplissez le formulaire de candidature boutique depuis l'espace vendeur. Votre candidature est ensuite validee manuellement par l'equipe avant que votre boutique ne soit visible publiquement.",
      },
    ],
  },
  {
    title: "Compte et confidentialite",
    items: [
      {
        q: "Comment supprimer mon compte ?",
        a: "Depuis la page \"Mon compte\", vous pouvez demander la suppression. Pour un compte acheteur, c'est un processus en libre-service. Pour une boutique vendeur active, la demande passe par le formulaire de contact - la fermeture d'une boutique se traite manuellement.",
      },
      {
        q: "Le site utilise-t-il des cookies publicitaires ?",
        a: "Non. Seuls des cookies strictement necessaires au fonctionnement du site (session, panier) sont utilises - aucun cookie publicitaire ni de suivi.",
      },
      {
        q: "Comment sont controles les avis clients ?",
        a: "Un avis ne peut etre laisse que sur une commande reellement payee, ce qui limite les faux avis. L'equipe peut par ailleurs masquer un avis signale comme abusif.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="flex flex-1 flex-col">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqSections.flatMap((section) =>
            section.items.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          ),
        }}
      />

      <section className="border-b border-border bg-secondary/30 px-6 py-16 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            FAQ
          </span>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Questions frequentes
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Les reponses aux questions les plus courantes. Vous ne trouvez pas
            la votre ?{" "}
            <Link
              href="/contact"
              className="text-foreground underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              Contactez-nous
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto flex max-w-2xl flex-col gap-10">
          {faqSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h2 className="text-lg font-medium tracking-tight">{section.title}</h2>
              <div className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl border border-border bg-card px-5 py-4"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium marker:content-none">
                      {item.q}
                      <Plus
                        className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                        strokeWidth={1.75}
                      />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
