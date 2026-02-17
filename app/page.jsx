"use client";
import { DashboardShell } from "@/components/dashboard-shell";
import { KpiCard } from "@/components/kpi-card";
import { ActivityFeed } from "@/components/activity-feed";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { motion } from "framer-motion";
import { Users, Ticket, MessageSquare, Send, Clock, ThumbsUp, Sparkles, ArrowRight, CalendarDays, } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, } from "recharts";
import { dashboardStats, revenueData, ticketsByCategory, weeklyActivity, recentActivities, } from "@/lib/crm-data";
export default function DashboardPage() {
    const { value: stats } = useLocalStorage("pulsai-stats", dashboardStats);
    const { value: activities } = useLocalStorage("pulsai-activities", recentActivities);
    return (<DashboardShell>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Tableau de bord
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Bienvenue, voici un apercu de votre activite CRM.
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 sm:mt-0">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4"/>
                <span>30 derniers jours</span>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                <Sparkles className="h-4 w-4"/>
                Rapport IA
              </button>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <KpiCard title="Contacts totaux" value={stats.totalContacts} change={stats.contactsGrowth} icon={Users} color="bg-primary" index={0}/>
          <KpiCard title="Tickets actifs" value={stats.activeTickets} change={-5.2} icon={Ticket} color="bg-chart-5" index={1}/>
          <KpiCard title="Conversations" value={stats.openConversations} change={8.3} icon={MessageSquare} color="bg-chart-3" index={2}/>
          <KpiCard title="Campagnes envoyees" value={stats.campaignsSent.toLocaleString("fr-FR")} change={15.7} icon={Send} color="bg-chart-4" index={3}/>
        </div>

        {/* Secondary stats row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary"/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{"Temps de reponse moy."}</p>
              <p className="text-xl font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {stats.avgResponseTime}
              </p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E]/10">
              <ThumbsUp className="h-6 w-6 text-[#22C55E]"/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
              <p className="text-xl font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {stats.satisfactionRate}%
              </p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
              <Ticket className="h-6 w-6 text-secondary-foreground"/>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tickets resolus</p>
              <p className="text-xl font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {stats.ticketsResolved}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-8">
          {/* Revenue Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">
                  Revenus & Objectifs
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Comparaison mensuelle
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary"/>
                  Revenus
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-secondary"/>
                  Objectif
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3590E3" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3590E3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(v) => `${v / 1000}k`}/>
                <Tooltip contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            fontSize: "12px",
        }} formatter={(value) => [
            `${value.toLocaleString("fr-FR")} FCFA`,
        ]}/>
                <Area type="monotone" dataKey="revenue" stroke="#3590E3" strokeWidth={2} fill="url(#revenueGradient)"/>
                <Area type="monotone" dataKey="target" stroke="#BAF09D" strokeWidth={2} strokeDasharray="5 5" fill="none"/>
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Tickets Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold text-card-foreground mb-1">
              Tickets par categorie
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Repartition actuelle
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={ticketsByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {ticketsByCategory.map((entry, i) => (<Cell key={i} fill={entry.fill}/>))}
                </Pie>
                <Tooltip contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            fontSize: "12px",
        }}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {ticketsByCategory.map((cat) => (<div key={cat.name} className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.fill }}/>
                  <span className="text-muted-foreground">{cat.name}</span>
                  <span className="ml-auto font-medium text-card-foreground">
                    {cat.value}%
                  </span>
                </div>))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: Weekly Activity + Activity Feed */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Weekly Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="lg:col-span-3 rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-card-foreground">
                  {"Activite hebdomadaire"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Conversations, tickets et emails
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weeklyActivity} barGap={4}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 12 }}/>
                <Tooltip contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            fontSize: "12px",
        }}/>
                <Bar dataKey="conversations" fill="#3590E3" radius={[4, 4, 0, 0]} name="Conversations"/>
                <Bar dataKey="tickets" fill="#BAF09D" radius={[4, 4, 0, 0]} name="Tickets"/>
                <Bar dataKey="emails" fill="#6366F1" radius={[4, 4, 0, 0]} name="Emails"/>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Activity Feed */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-card-foreground">
                {"Activite recente"}
              </h3>
              <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                Tout voir <ArrowRight className="h-3 w-3"/>
              </button>
            </div>
            <ActivityFeed activities={activities}/>
          </motion.div>
        </div>
      </div>
    </DashboardShell>);
}
