import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrderTimeline({
  createdAt,
  isPaid,
  isShipped,
  isCancelledOrRefunded,
}: {
  createdAt: Date;
  isPaid: boolean;
  isShipped: boolean;
  isCancelledOrRefunded: boolean;
}) {
  const steps = [
    { label: "Commande passee", done: true, date: createdAt },
    { label: "Paiement confirme", done: isPaid, date: null },
    { label: "Expediee", done: isShipped, date: null },
  ];

  if (isCancelledOrRefunded) {
    return (
      <p className="text-sm text-muted-foreground">
        Cette commande a ete annulee ou remboursee.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.label} className="flex flex-1 items-center gap-2">
          <div className="flex flex-col items-center gap-1.5">
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs",
                step.done
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {step.done ? <Check className="size-3.5" /> : index + 1}
            </span>
            <span className="text-center text-xs text-muted-foreground">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <span
              className={cn("h-0.5 flex-1", step.done ? "bg-primary" : "bg-muted")}
            />
          )}
        </div>
      ))}
    </div>
  );
}
