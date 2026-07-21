"use client";

import { CheckCircle2 } from "lucide-react";
import { useActionState } from "react";
import { submitContactAction } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const subjectLabels: Record<string, string> = {
  COMMANDE: "Une commande",
  BOUTIQUE: "Une boutique / un vendeur",
  PARTENARIAT: "Proposer un partenariat artisan",
  AUTRE: "Autre",
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactAction, undefined);

  if (state?.success) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="size-7" strokeWidth={1.75} />
        </div>
        <p className="text-lg font-medium">Message envoye</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Merci, on vous repond sous 24h a l&apos;adresse que vous avez indiquee.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nom</Label>
          <Input id="name" name="name" required placeholder="Votre nom" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="vous@exemple.com"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="subject">Sujet</Label>
        <Select name="subject" defaultValue="AUTRE">
          <SelectTrigger id="subject" className="w-full">
            <SelectValue>
              {(value: string) => subjectLabels[value] ?? value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COMMANDE">Une commande</SelectItem>
            <SelectItem value="BOUTIQUE">Une boutique / un vendeur</SelectItem>
            <SelectItem value="PARTENARIAT">Proposer un partenariat artisan</SelectItem>
            <SelectItem value="AUTRE">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Ecrivez votre message ici..."
        />
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" disabled={isPending} className="w-fit">
        {isPending ? "Envoi..." : "Envoyer le message"}
      </Button>
    </form>
  );
}
