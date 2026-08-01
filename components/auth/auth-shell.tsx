import { Sparkles } from "lucide-react";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-grain flex flex-1 items-center justify-center bg-secondary/30 px-4 py-16">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Sparkles className="size-5" strokeWidth={1.75} />
        </span>
        {children}
      </div>
    </div>
  );
}
