"use client";
import { DashboardShell } from "@/components/dashboard-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { defaultCampaigns } from "@/lib/crm-data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Mail, MessageCircle, Bell, Play, Pause, Eye, MousePointerClick, Send, TrendingUp, Calendar, X, } from "lucide-react";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, } from "recharts";
const statusConfig = {
    draft: { label: "Brouillon", color: "bg-muted text-muted-foreground" },
    active: { label: "Active", color: "bg-[#22C55E]/15 text-[#22C55E]" },
    paused: { label: "En pause", color: "bg-chart-4/15 text-chart-4" },
    completed: { label: "Terminee", color: "bg-primary/15 text-primary" },
};
const typeIcons = {
    email: Mail,
    sms: MessageCircle,
    push: Bell,
};
export default function CampaignsPage() {
    const { value: campaigns, setValue: setCampaigns } = useLocalStorage("pulsai-campaigns", defaultCampaigns);
    const [showNew, setShowNew] = useState(false);
    const [newCampaign, setNewCampaign] = useState({
        name: "",
        type: "email",
    });
    const totalSent = campaigns.reduce((s, c) => s + c.sent, 0);
    const totalOpened = campaigns.reduce((s, c) => s + c.opened, 0);
    const totalClicked = campaigns.reduce((s, c) => s + c.clicked, 0);
    const avgOpenRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : "0";
    const avgClickRate = totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : "0";
    const chartData = campaigns
        .filter((c) => c.sent > 0)
        .map((c) => ({
        name: c.name.length > 12 ? c.name.slice(0, 12) + "..." : c.name,
        envoyes: c.sent,
        ouverts: c.opened,
        cliques: c.clicked,
    }));
    const handleCreateCampaign = () => {
        if (!newCampaign.name.trim())
            return;
        const camp = {
            id: `camp-${Date.now()}`,
            name: newCampaign.name,
            status: "draft",
            type: newCampaign.type,
            sent: 0,
            opened: 0,
            clicked: 0,
            startDate: new Date().toISOString().split("T")[0],
            endDate: "",
        };
        setCampaigns((prev) => [camp, ...prev]);
        setNewCampaign({ name: "", type: "email" });
        setShowNew(false);
    };
    const toggleCampaignStatus = (id) => {
        setCampaigns((prev) => prev.map((c) => {
            if (c.id !== id)
                return c;
            if (c.status === "active")
                return Object.assign(Object.assign({}, c), { status: "paused" });
            if (c.status === "paused" || c.status === "draft")
                return Object.assign(Object.assign({}, c), { status: "active" });
            return c;
        }));
    };
    return (<DashboardShell>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Campagnes
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Creez et gerez vos campagnes marketing.
              </p>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowNew(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4"/>
              Nouvelle campagne
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 mb-8">
          {[
            { label: "Total envoyes", value: totalSent.toLocaleString("fr-FR"), icon: Send, color: "bg-primary" },
            { label: "Taux d'ouverture", value: `${avgOpenRate}%`, icon: Eye, color: "bg-[#22C55E]" },
            { label: "Taux de clic", value: `${avgClickRate}%`, icon: MousePointerClick, color: "bg-chart-3" },
            { label: "Campagnes actives", value: campaigns.filter((c) => c.status === "active").length, icon: TrendingUp, color: "bg-chart-4" },
        ].map((stat, i) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", stat.color)}>
                <stat.icon className="h-5 w-5 text-primary-foreground"/>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  {stat.value}
                </p>
              </div>
            </motion.div>))}
        </div>

        {/* Performance Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-card-foreground">
                Performance des campagnes
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Comparaison des metriques
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-primary"/>
                Envoyes
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-[#22C55E]"/>
                Ouverts
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-chart-3"/>
                Cliques
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barGap={4}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }}/>
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}/>
              <Tooltip contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            fontSize: "12px",
        }}/>
              <Bar dataKey="envoyes" fill="#3590E3" radius={[4, 4, 0, 0]}/>
              <Bar dataKey="ouverts" fill="#22C55E" radius={[4, 4, 0, 0]}/>
              <Bar dataKey="cliques" fill="#6366F1" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {campaigns.map((camp, index) => {
            const sc = statusConfig[camp.status];
            const TypeIcon = typeIcons[camp.type];
            const openRate = camp.sent > 0 ? ((camp.opened / camp.sent) * 100).toFixed(1) : "0";
            return (<motion.div key={camp.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -2 }} className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                        <TypeIcon className="h-5 w-5 text-accent-foreground"/>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-card-foreground">
                          {camp.name}
                        </h3>
                        <span className="text-[11px] text-muted-foreground capitalize">
                          {camp.type}
                        </span>
                      </div>
                    </div>
                    <span className={cn("rounded-md px-2 py-1 text-[10px] font-medium", sc.color)}>
                      {sc.label}
                    </span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                        {camp.sent > 1000 ? `${(camp.sent / 1000).toFixed(1)}k` : camp.sent}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Envoyes</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-[#22C55E]" style={{ fontFamily: "var(--font-heading)" }}>
                        {openRate}%
                      </p>
                      <p className="text-[10px] text-muted-foreground">Ouverture</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-chart-3" style={{ fontFamily: "var(--font-heading)" }}>
                        {camp.clicked.toLocaleString("fr-FR")}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Clics</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {camp.sent > 0 && (<div className="mb-4">
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${openRate}%` }} transition={{ delay: 0.5, duration: 0.8 }} className="h-full rounded-full bg-primary"/>
                      </div>
                    </div>)}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3"/>
                      {camp.startDate}
                    </div>
                    {(camp.status === "active" || camp.status === "paused" || camp.status === "draft") && (<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => toggleCampaignStatus(camp.id)} className={cn("flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium transition-colors", camp.status === "active"
                        ? "bg-chart-4/15 text-chart-4"
                        : "bg-[#22C55E]/15 text-[#22C55E]")}>
                        {camp.status === "active" ? (<>
                            <Pause className="h-3 w-3"/> Pause
                          </>) : (<>
                            <Play className="h-3 w-3"/> Lancer
                          </>)}
                      </motion.button>)}
                  </div>
                </motion.div>);
        })}
          </AnimatePresence>
        </div>
      </div>

      {/* New Campaign Modal */}
      <AnimatePresence>
        {showNew && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={() => setShowNew(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl bg-card border border-border p-6 shadow-xl mx-4">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Nouvelle campagne
                </h3>
                <button onClick={() => setShowNew(false)} className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5"/>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground">
                    Nom de la campagne
                  </label>
                  <input type="text" value={newCampaign.name} onChange={(e) => setNewCampaign((p) => (Object.assign(Object.assign({}, p), { name: e.target.value })))} placeholder="Ex: Promotion Printemps 2026" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground">
                    Type de campagne
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {["email", "sms", "push"].map((type) => {
                const TIcon = typeIcons[type];
                return (<button key={type} onClick={() => setNewCampaign((p) => (Object.assign(Object.assign({}, p), { type })))} className={cn("flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-sm font-medium transition-colors", newCampaign.type === type
                        ? "border-primary bg-accent text-primary"
                        : "border-border text-muted-foreground hover:border-primary/30")}>
                          <TIcon className="h-5 w-5"/>
                          <span className="text-xs capitalize">{type}</span>
                        </button>);
            })}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowNew(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  Annuler
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCreateCampaign} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Creer la campagne
                </motion.button>
              </div>
            </motion.div>
          </motion.div>)}
      </AnimatePresence>
    </DashboardShell>);
}
