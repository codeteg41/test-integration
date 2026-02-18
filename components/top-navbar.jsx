"use client";

import { useTheme } from "next-themes";
import { Bell, Menu, Moon, Search, Sun, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function TopNavbar({ onMenu }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-4 md:px-6 lg:px-8">
        <button
          aria-label="Ouvrir le menu"
          onClick={onMenu}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative min-w-0 flex-1 max-w-2xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="ml-1 flex items-center gap-2 md:gap-3 lg:gap-4">
          <button
            aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            aria-label="Notifications"
            className="relative rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              3
            </span>
          </button>

          <button className="hidden items-center gap-3 rounded-lg border border-border bg-card px-2.5 py-1.5 text-left transition-colors hover:bg-muted/60 md:flex md:px-3">
            <UserCircle2 className="h-7 w-7 text-primary" />
            <div className={cn("hidden leading-tight md:block")}>
              <p className="text-sm font-medium text-card-foreground">Admin PulsAI</p>
              <p className="text-[11px] text-muted-foreground">admin@pulsai.io</p>
            </div>
          </button>
          <button className="flex items-center justify-center rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden">
            <UserCircle2 className="h-5 w-5 text-primary" />
          </button>
        </div>
      </div>
    </header>
  );
}
