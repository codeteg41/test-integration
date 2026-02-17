"use client";
import { DashboardShell } from "@/components/dashboard-shell";
import { motion } from "framer-motion";
import { User, Bell, Shield, Palette, Globe, Zap, Save, } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
const sections = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Securite", icon: Shield },
    { id: "appearance", label: "Apparence", icon: Palette },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "language", label: "Langue", icon: Globe },
];
export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState("profile");
    const [saved, setSaved] = useState(false);
    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };
    return (<DashboardShell>
      <div className="p-6 lg:p-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Paramètres
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configurez votre espace de travail PulsAI.
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Settings Sidebar */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="w-56 shrink-0">
            <nav className="space-y-1">
              {sections.map((s) => (<button key={s.id} onClick={() => setActiveSection(s.id)} className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", activeSection === s.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                  <s.icon className="h-4 w-4"/>
                  {s.label}
                </button>))}
            </nav>
          </motion.div>

          {/* Settings Content */}
          <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 max-w-2xl">
            {activeSection === "profile" && (<div className="space-y-6">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="text-base font-semibold text-card-foreground mb-4">
                    Informations personnelles
                  </h3>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                      AD
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        Admin PulsAI
                      </p>
                      <p className="text-xs text-muted-foreground">
                        admin@pulsai.io
                      </p>
                      <button className="mt-1 text-xs font-medium text-primary hover:underline">
                        Changer la photo
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-card-foreground">
                        Prenom
                      </label>
                      <input type="text" defaultValue="Admin" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-card-foreground">
                        Nom
                      </label>
                      <input type="text" defaultValue="PulsAI" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-card-foreground">
                        Email
                      </label>
                      <input type="email" defaultValue="admin@pulsai.io" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-card-foreground">
                        Role
                      </label>
                      <input type="text" defaultValue="Administrateur" disabled className="mt-1 w-full rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground"/>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} className={cn("flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors", saved
                ? "bg-[#22C55E] text-[#FFFFFF]"
                : "bg-primary text-primary-foreground hover:bg-primary/90")}>
                    <Save className="h-4 w-4"/>
                    {saved ? "Sauvegarde !" : "Sauvegarder"}
                  </motion.button>
                </div>
              </div>)}

            {activeSection === "notifications" && (<div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-card-foreground mb-4">
                  Preferences de notification
                </h3>
                <div className="space-y-4">
                  {[
                { label: "Nouveaux tickets", desc: "Recevoir une alerte quand un ticket est cree", defaultOn: true },
                { label: "Nouvelles conversations", desc: "Notifications pour les messages entrants", defaultOn: true },
                { label: "Campagnes", desc: "Rapports de performance des campagnes", defaultOn: false },
                { label: "Mentions d'equipe", desc: "Quand quelqu'un vous mentionne", defaultOn: true },
            ].map((notif) => (<div key={notif.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-card-foreground">{notif.label}</p>
                        <p className="text-xs text-muted-foreground">{notif.desc}</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" defaultChecked={notif.defaultOn} className="peer sr-only"/>
                        <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-card after:transition-transform peer-checked:after:translate-x-full"/>
                      </label>
                    </div>))}
                </div>
              </div>)}

            {activeSection !== "profile" && activeSection !== "notifications" && (<div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <Zap className="h-7 w-7 text-primary"/>
                </div>
                <h3 className="text-base font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  {"Bientot disponible"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                  Cette section de parametres est en cours de developpement. Revenez bientot !
                </p>
              </div>)}
          </motion.div>
        </div>
      </div>
    </DashboardShell>);
}
