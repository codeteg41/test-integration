"use client";
import { DashboardShell } from "@/components/dashboard-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { defaultTickets } from "@/lib/crm-data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, Search, Filter, ChevronDown, AlertCircle, Clock, CheckCircle2, XCircle, User, Calendar, X, } from "lucide-react";
import { useState } from "react";
const statusConfig = {
    open: { label: "Ouvert", color: "bg-primary/15 text-primary", icon: AlertCircle },
    "in-progress": { label: "En cours", color: "bg-chart-4/15 text-chart-4", icon: Clock },
    resolved: { label: "Resolu", color: "bg-[#22C55E]/15 text-[#22C55E]", icon: CheckCircle2 },
    closed: { label: "Ferme", color: "bg-muted text-muted-foreground", icon: XCircle },
};
const priorityConfig = {
    low: { label: "Basse", color: "text-muted-foreground", dotColor: "bg-muted-foreground" },
    medium: { label: "Moyenne", color: "text-chart-4", dotColor: "bg-chart-4" },
    high: { label: "Haute", color: "text-chart-5", dotColor: "bg-chart-5" },
    urgent: { label: "Urgente", color: "text-destructive", dotColor: "bg-destructive" },
};
export default function TicketsPage() {
    const { value: tickets, setValue: setTickets } = useLocalStorage("pulsai-tickets", defaultTickets);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [newTicket, setNewTicket] = useState({
        title: "",
        description: "",
        priority: "medium",
        assignee: "",
        contact: "",
    });
    const filtered = tickets.filter((t) => {
        const matchesStatus = filterStatus === "all" || t.status === filterStatus;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.contact.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });
    const statusCounts = {
        all: tickets.length,
        open: tickets.filter((t) => t.status === "open").length,
        "in-progress": tickets.filter((t) => t.status === "in-progress").length,
        resolved: tickets.filter((t) => t.status === "resolved").length,
        closed: tickets.filter((t) => t.status === "closed").length,
    };
    const handleCreateTicket = () => {
        if (!newTicket.title.trim())
            return;
        const ticket = {
            id: `t-${Date.now()}`,
            title: newTicket.title,
            description: newTicket.description,
            status: "open",
            priority: newTicket.priority,
            assignee: newTicket.assignee || "Non assigne",
            contact: newTicket.contact || "N/A",
            createdAt: new Date().toISOString().split("T")[0],
            updatedAt: new Date().toISOString().split("T")[0],
        };
        setTickets((prev) => [ticket, ...prev]);
        setNewTicket({ title: "", description: "", priority: "medium", assignee: "", contact: "" });
        setShowNewTicket(false);
    };
    const handleStatusChange = (ticketId, newStatus) => {
        setTickets((prev) => prev.map((t) => t.id === ticketId
            ? Object.assign(Object.assign({}, t), { status: newStatus, updatedAt: new Date().toISOString().split("T")[0] }) : t));
    };
    return (<DashboardShell>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Tickets
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gerez et suivez les demandes de support.
              </p>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowNewTicket(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4"/>
              Nouveau ticket
            </motion.button>
          </div>
        </motion.div>

        {/* Status Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.keys(statusCounts).map((status) => {
            var _a;
            return (<button key={status} onClick={() => setFilterStatus(status)} className={cn("flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors", filterStatus === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted")}>
              {status === "all" ? "Tous" : (_a = statusConfig[status]) === null || _a === void 0 ? void 0 : _a.label}
              <span className={cn("flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold", filterStatus === status
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground")}>
                {statusCounts[status]}
              </span>
            </button>);
        })}
        </div>

        {/* Search */}
        <div className="mb-6 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
            <input type="text" placeholder="Rechercher un ticket..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted transition-colors">
            <Filter className="h-4 w-4"/>
            Filtrer
            <ChevronDown className="h-3 w-3"/>
          </button>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((ticket, index) => {
            const sc = statusConfig[ticket.status];
            const pc = priorityConfig[ticket.priority];
            const StatusIcon = sc.icon;
            return (<motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -1 }} className="rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", sc.color)}>
                      <StatusIcon className="h-4 w-4"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-sm font-semibold text-card-foreground">
                            {ticket.title}
                          </h3>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                            {ticket.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <select value={ticket.status} onChange={(e) => handleStatusChange(ticket.id, e.target.value)} className={cn("rounded-md px-2 py-1 text-[11px] font-medium border-0 cursor-pointer focus:ring-2 focus:ring-primary/30", sc.color)}>
                            <option value="open">Ouvert</option>
                            <option value="in-progress">En cours</option>
                            <option value="resolved">Resolu</option>
                            <option value="closed">Ferme</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <div className={cn("h-1.5 w-1.5 rounded-full", pc.dotColor)}/>
                          <span className={pc.color}>{pc.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3"/>
                          {ticket.assignee}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3"/>
                          {ticket.createdAt}
                        </div>
                        <span className="text-muted-foreground/60">|</span>
                        <span>{ticket.contact}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>);
        })}
          </AnimatePresence>

          {filtered.length === 0 && (<div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground/40 mb-3"/>
              <p className="text-sm text-muted-foreground">Aucun ticket trouve.</p>
            </div>)}
        </div>
      </div>

      {/* New Ticket Modal */}
      <AnimatePresence>
        {showNewTicket && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={() => setShowNewTicket(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-card border border-border p-6 shadow-xl mx-4">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Nouveau ticket
                </h3>
                <button onClick={() => setShowNewTicket(false)} className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5"/>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-card-foreground">Titre</label>
                  <input type="text" value={newTicket.title} onChange={(e) => setNewTicket((p) => (Object.assign(Object.assign({}, p), { title: e.target.value })))} placeholder="Decrivez le probleme..." className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground">Description</label>
                  <textarea value={newTicket.description} onChange={(e) => setNewTicket((p) => (Object.assign(Object.assign({}, p), { description: e.target.value })))} placeholder="Plus de details..." rows={3} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground">Priorite</label>
                    <select value={newTicket.priority} onChange={(e) => setNewTicket((p) => (Object.assign(Object.assign({}, p), { priority: e.target.value })))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground">Assigne a</label>
                    <input type="text" value={newTicket.assignee} onChange={(e) => setNewTicket((p) => (Object.assign(Object.assign({}, p), { assignee: e.target.value })))} placeholder="Nom de l'agent" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground">Contact</label>
                  <input type="text" value={newTicket.contact} onChange={(e) => setNewTicket((p) => (Object.assign(Object.assign({}, p), { contact: e.target.value })))} placeholder="Nom du contact" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowNewTicket(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  Annuler
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCreateTicket} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Creer le ticket
                </motion.button>
              </div>
            </motion.div>
          </motion.div>)}
      </AnimatePresence>
    </DashboardShell>);
}
