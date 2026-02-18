"use client";

import { Bot, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("Guest");
  const [email, setEmail] = useState("guest@pulsai.io");

  const handleLogin = () => {
    window.localStorage.setItem("pulsai-auth", "true");
    window.localStorage.setItem(
      "pulsai-user",
      JSON.stringify({
        name: name.trim() || "Guest",
        email: email.trim() || "guest@pulsai.io",
      })
    );
    router.push("/");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(53,144,227,0.18),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(186,240,157,0.2),transparent_38%)]" />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-2xl border border-border bg-card/95 p-6 shadow-xl backdrop-blur"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p
              className="text-xl font-semibold tracking-[0.08em] text-card-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Puls<span className="text-primary">AI</span>
            </p>
            <p className="text-xs text-muted-foreground">Connexion de test</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-card-foreground">Nom</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-card-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <LogIn className="h-4 w-4" />
            Se connecter
          </button>
          <p className="text-center text-xs text-muted-foreground">
            Acces test libre: aucun mot de passe requis.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
