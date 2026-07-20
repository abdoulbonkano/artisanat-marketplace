import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question sur une commande, une boutique ou un partenariat artisan ? Contactez BONKANO SOLUTIONS.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Mail className="size-6" strokeWidth={1.75} />
      </div>
      <h1 className="text-3xl font-medium tracking-tight">Contactez-nous</h1>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        Une question sur une commande, une boutique ou envie de proposer un
        partenariat artisan ? Ecrivez-nous, nous repondons sous 24h.
      </p>
      <Button render={<a href="mailto:bonkano.solutions@gmail.com" />} nativeButton={false}>
        bonkano.solutions@gmail.com
      </Button>
    </div>
  );
}
