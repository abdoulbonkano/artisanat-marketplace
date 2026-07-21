import type { Metadata } from "next";
import { Clock, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question sur une commande, une boutique ou un partenariat artisan ? Contactez BONKANO SOLUTIONS.",
};

const reassurances = [
  {
    icon: Clock,
    title: "Reponse sous 24h",
    description: "On lit chaque message et on repond rapidement.",
  },
  {
    icon: MessageCircle,
    title: "Une vraie personne",
    description: "Pas de bot, pas de centre d'appel : BONKANO SOLUTIONS.",
  },
  {
    icon: ShieldCheck,
    title: "Vos donnees restent privees",
    description: "Utilisees uniquement pour vous repondre.",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-secondary/30 px-6 py-16 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
          <span className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            Contact
          </span>
          <h1 className="text-4xl font-medium tracking-tight text-balance sm:text-5xl">
            Une question ? Ecrivez-nous
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
            Commande, boutique, envie de proposer un partenariat artisan...
            dites-nous en plus, on vous repond sous 24h.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="bg-grain relative isolate flex flex-col gap-8 overflow-hidden rounded-[2rem] bg-primary px-8 py-10 text-primary-foreground">
            <div className="pointer-events-none absolute -top-16 -right-12 size-56 rounded-full bg-accent/20 blur-3xl" />
            <div className="relative flex flex-col gap-2">
              <div className="flex size-11 items-center justify-center rounded-full bg-primary-foreground/10">
                <Mail className="size-5" strokeWidth={1.75} />
              </div>
              <h2 className="text-2xl font-medium tracking-tight">
                Parlons-en
              </h2>
              <p className="text-sm leading-relaxed text-primary-foreground/75">
                Remplissez le formulaire, ou ecrivez-nous directement.
              </p>
              <a
                href="mailto:bonkano.solutions@gmail.com"
                className="mt-1 w-fit text-sm font-medium underline decoration-primary-foreground/40 underline-offset-4 hover:decoration-primary-foreground"
              >
                bonkano.solutions@gmail.com
              </a>
            </div>

            <div className="relative flex flex-col gap-5">
              {reassurances.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-primary-foreground/65">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card px-6 py-8 shadow-[0_4px_8px_-4px_rgba(36,28,16,0.06),0_20px_36px_-16px_rgba(36,28,16,0.14)] sm:px-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
