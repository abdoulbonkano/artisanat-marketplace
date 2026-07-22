"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // localStorage unavailable (private browsing, etc.) - theme just won't persist
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      onClick={toggle}
      className={className}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
