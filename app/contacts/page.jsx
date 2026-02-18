"use client";
import { DashboardShell } from "@/components/dashboard-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { defaultContacts } from "@/lib/crm-data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, Mail, Phone, Building2, UserPlus, Grid3X3, List, X, Trash2, } from "lucide-react";
import { useState } from "react";
const statusConfig = {
    active: { label: "Actif", color: "bg-[#22C55E]/15 text-[#22C55E]" },
    inactive: { label: "Inactif", color: "bg-muted text-muted-foreground" },
    lead: { label: "Lead", color: "bg-primary/15 text-primary" },
};
export default function ContactsPage() {
    const { value: contacts, setValue: setContacts } = useLocalStorage("pulsai-contacts", defaultContacts);
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showNew, setShowNew] = useState(false);
    const [newContact, setNewContact] = useState({
        name: "",
        email: "",
        company: "",
        phone: "",
        status: "lead",
    });
    const filtered = contacts.filter((c) => {
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    const handleAddContact = () => {
        if (!newContact.name.trim() || !newContact.email.trim())
            return;
        const contact = {
            id: `c-${Date.now()}`,
            name: newContact.name,
            email: newContact.email,
            company: newContact.company || "N/A",
            avatar: newContact.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()
                .slice(0, 2),
            status: newContact.status,
            lastActivity: "A l'instant",
            phone: newContact.phone || "",
        };
        setContacts((prev) => [contact, ...prev]);
        setNewContact({ name: "", email: "", company: "", phone: "", status: "lead" });
        setShowNew(false);
    };
    const handleDeleteContact = (id) => {
        setContacts((prev) => prev.filter((c) => c.id !== id));
    };
    return (<DashboardShell>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Contacts
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {contacts.length} contacts dans votre base.
              </p>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowNew(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
              <UserPlus className="h-4 w-4"/>
              Ajouter un contact
            </motion.button>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
              <input type="text" placeholder="Rechercher un contact..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-border bg-card py-2.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
            </div>
            <div className="flex gap-1">
              {["all", "active", "lead", "inactive"].map((s) => {
            var _a;
            return (<button key={s} onClick={() => setFilterStatus(s)} className={cn("rounded-md px-3 py-2 text-xs font-medium transition-colors", filterStatus === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:bg-muted")}>
                  {s === "all" ? "Tous" : (_a = statusConfig[s]) === null || _a === void 0 ? void 0 : _a.label}
                </button>);
        })}
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            <button onClick={() => setViewMode("grid")} className={cn("rounded-md p-2 transition-colors", viewMode === "grid"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground")}>
              <Grid3X3 className="h-4 w-4"/>
            </button>
            <button onClick={() => setViewMode("list")} className={cn("rounded-md p-2 transition-colors", viewMode === "list"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground")}>
              <List className="h-4 w-4"/>
            </button>
          </div>
        </div>

        {/* Contacts Grid */}
        {viewMode === "grid" ? (<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filtered.map((contact, index) => {
                const sc = statusConfig[contact.status];
                return (<motion.div key={contact.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -2 }} className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {contact.avatar}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-card-foreground">
                            {contact.name}
                          </h3>
                          <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-medium", sc.color)}>
                            {sc.label}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteContact(contact.id)} className="rounded-md p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all">
                        <Trash2 className="h-4 w-4"/>
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3.5 w-3.5"/>
                        <span className="truncate">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Building2 className="h-3.5 w-3.5"/>
                        <span>{contact.company}</span>
                      </div>
                      {contact.phone && (<div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3.5 w-3.5"/>
                          <span>{contact.phone}</span>
                        </div>)}
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-[11px] text-muted-foreground">
                        {contact.lastActivity}
                      </span>
                      <div className="flex gap-1">
                        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                          <Mail className="h-3.5 w-3.5"/>
                        </button>
                        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                          <Phone className="h-3.5 w-3.5"/>
                        </button>
                      </div>
                    </div>
                  </motion.div>);
            })}
            </AnimatePresence>
          </div>) : (
        /* List View */
        <div className="rounded-xl border border-border bg-card overflow-x-auto">
            <div className="min-w-[720px] grid grid-cols-[1fr_1fr_120px_140px_80px] gap-4 border-b border-border bg-muted/50 px-5 py-3 text-xs font-medium text-muted-foreground">
              <span>Contact</span>
              <span>Email</span>
              <span>Entreprise</span>
              <span>{"Derniere activite"}</span>
              <span>Statut</span>
            </div>
            <AnimatePresence>
              {filtered.map((contact, index) => {
                const sc = statusConfig[contact.status];
                return (<motion.div key={contact.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.03 }} className="min-w-[720px] group grid grid-cols-[1fr_1fr_120px_140px_80px] gap-4 items-center border-b border-border/50 px-5 py-3 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {contact.avatar}
                      </div>
                      <span className="text-sm font-medium text-card-foreground truncate">
                        {contact.name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground truncate">
                      {contact.email}
                    </span>
                    <span className="text-sm text-muted-foreground truncate">
                      {contact.company}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {contact.lastActivity}
                    </span>
                    <span className={cn("rounded-md px-2 py-1 text-[10px] font-medium text-center", sc.color)}>
                      {sc.label}
                    </span>
                  </motion.div>);
            })}
            </AnimatePresence>
          </div>)}

        {filtered.length === 0 && (<div className="flex flex-col items-center justify-center py-16 text-center">
            <UserPlus className="h-10 w-10 text-muted-foreground/40 mb-3"/>
            <p className="text-sm text-muted-foreground">Aucun contact trouve.</p>
          </div>)}
      </div>

      {/* New Contact Modal */}
      <AnimatePresence>
        {showNew && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm" onClick={() => setShowNew(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-xl bg-card border border-border p-6 shadow-xl mx-4">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Ajouter un contact
                </h3>
                <button onClick={() => setShowNew(false)} className="rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5"/>
                </button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground">
                      Nom complet
                    </label>
                    <input type="text" value={newContact.name} onChange={(e) => setNewContact((p) => (Object.assign(Object.assign({}, p), { name: e.target.value })))} placeholder="Jean Dupont" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground">Email</label>
                    <input type="email" value={newContact.email} onChange={(e) => setNewContact((p) => (Object.assign(Object.assign({}, p), { email: e.target.value })))} placeholder="jean@example.com" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-card-foreground">Entreprise</label>
                    <input type="text" value={newContact.company} onChange={(e) => setNewContact((p) => (Object.assign(Object.assign({}, p), { company: e.target.value })))} placeholder="Nom de l'entreprise" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground">{"Telephone"}</label>
                    <input type="tel" value={newContact.phone} onChange={(e) => setNewContact((p) => (Object.assign(Object.assign({}, p), { phone: e.target.value })))} placeholder="+33 6 12 34 56 78" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-card-foreground">Statut</label>
                  <div className="mt-2 flex gap-3">
                    {["lead", "active", "inactive"].map((s) => (<button key={s} onClick={() => setNewContact((p) => (Object.assign(Object.assign({}, p), { status: s })))} className={cn("flex-1 rounded-lg border-2 py-2.5 text-sm font-medium transition-colors", newContact.status === s
                    ? "border-primary bg-accent text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30")}>
                        {statusConfig[s].label}
                      </button>))}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setShowNew(false)} className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                  Annuler
                </button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddContact} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                  Ajouter le contact
                </motion.button>
              </div>
            </motion.div>
          </motion.div>)}
      </AnimatePresence>
    </DashboardShell>);
}
