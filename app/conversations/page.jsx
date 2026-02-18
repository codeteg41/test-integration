"use client";
import { DashboardShell } from "@/components/dashboard-shell";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { defaultConversations } from "@/lib/crm-data";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, Send, Sparkles, MessageSquare, Mail, Phone, MoreVertical, Paperclip, Smile, Bot, User, Headphones, Hash, ArrowLeft, } from "lucide-react";
import { useState, useRef, useEffect } from "react";
const channelIcons = {
    chat: MessageSquare,
    email: Mail,
    whatsapp: Phone,
};
const channelColors = {
    chat: "bg-primary/15 text-primary",
    email: "bg-chart-4/15 text-chart-4",
    whatsapp: "bg-[#22C55E]/15 text-[#22C55E]",
};
const senderConfig = {
    agent: { label: "Vous", icon: Headphones, color: "bg-primary text-primary-foreground" },
    contact: { label: "Client", icon: User, color: "bg-muted text-muted-foreground" },
    ai: { label: "PulsAI", icon: Bot, color: "bg-secondary text-secondary-foreground" },
};
export default function ConversationsPage() {
    const { value: conversations, setValue: setConversations } = useLocalStorage("pulsai-conversations", defaultConversations);
    const [selectedId, setSelectedId] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef(null);
    const selected = conversations.find((c) => c.id === selectedId);
    const filteredConversations = conversations.filter((c) => c.contactName.toLowerCase().includes(searchQuery.toLowerCase()));
    useEffect(() => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }, [selected === null || selected === void 0 ? void 0 : selected.messages.length]);
    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedId)
            return;
        const msg = {
            id: `m-${Date.now()}`,
            content: newMessage.trim(),
            sender: "agent",
            timestamp: new Date().toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
        setConversations((prev) => prev.map((c) => c.id === selectedId
            ? Object.assign(Object.assign({}, c), { messages: [...c.messages, msg], lastMessage: msg.content, timestamp: msg.timestamp }) : c));
        setNewMessage("");
        // Simulate AI response
        setTimeout(() => {
            const aiMsg = {
                id: `m-ai-${Date.now()}`,
                content: getAIResponse(newMessage.trim()),
                sender: "ai",
                timestamp: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            };
            setConversations((prev) => prev.map((c) => c.id === selectedId
                ? Object.assign(Object.assign({}, c), { messages: [...c.messages, aiMsg] }) : c));
        }, 1500);
    };
    return (<DashboardShell>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col xl:h-[calc(100vh-4rem)] xl:flex-row">
        {/* Conversation List */}
        <div className={cn("w-full flex-shrink-0 flex-col border-b border-border bg-card xl:flex xl:w-80 xl:border-b-0 xl:border-r", selectedId ? "hidden xl:flex" : "flex")}>
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Conversations
              </h2>
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-[11px] font-bold text-primary-foreground">
                {conversations.reduce((sum, c) => sum + c.unread, 0)}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
              <input type="text" placeholder="Rechercher une conversation..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
            </div>
          </div>

          {/* Channel Tabs */}
          <div className="flex gap-1 p-3 border-b border-border">
            {["all", "chat", "email", "whatsapp"].map((ch) => (<button key={ch} className="flex-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors capitalize">
                {ch === "all" ? "Tous" : ch}
              </button>))}
          </div>

          {/* List */}
          <div className="max-h-[45vh] flex-1 overflow-y-auto xl:max-h-none">
            {filteredConversations.map((conv) => {
            const ChIcon = channelIcons[conv.channel];
            return (<motion.button key={conv.id} whileTap={{ scale: 0.98 }} onClick={() => setSelectedId(conv.id)} className={cn("w-full flex items-start gap-3 p-4 text-left border-b border-border/50 transition-colors", selectedId === conv.id
                    ? "bg-accent"
                    : "hover:bg-muted/50")}>
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {conv.contactAvatar}
                    </div>
                    <div className={cn("absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full", channelColors[conv.channel])}>
                      <ChIcon className="h-2.5 w-2.5"/>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-card-foreground truncate">
                        {conv.contactName}
                      </p>
                      <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                        {conv.timestamp}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shrink-0 mt-1">
                      {conv.unread}
                    </span>)}
                </motion.button>);
        })}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn("flex-1 flex-col", selectedId ? "flex" : "hidden xl:flex")}>
          {selected ? (<>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedId(null)} className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors xl:hidden">
                    <ArrowLeft className="h-4 w-4"/>
                  </button>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {selected.contactAvatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">
                      {selected.contactName}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#22C55E]"/>
                      <span className="text-[11px] text-muted-foreground">
                        En ligne
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("flex items-center gap-1 rounded-md px-2 py-1 text-xs", channelColors[selected.channel])}>
                    {(() => { const I = channelIcons[selected.channel]; return <I className="h-3 w-3"/>; })()}
                    <span className="capitalize">{selected.channel}</span>
                  </div>
                  <button className="rounded-md p-2 text-muted-foreground hover:bg-muted transition-colors">
                    <MoreVertical className="h-4 w-4"/>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <AnimatePresence>
                  {selected.messages.map((msg) => {
                const config = senderConfig[msg.sender];
                const SIcon = config.icon;
                const isAgent = msg.sender === "agent";
                const isAI = msg.sender === "ai";
                return (<motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn("flex gap-3", isAgent && "flex-row-reverse")}>
                        <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.color)}>
                          <SIcon className="h-4 w-4"/>
                        </div>
                        <div className={cn("max-w-[70%] rounded-xl px-4 py-2.5", isAgent
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : isAI
                            ? "bg-secondary/60 border border-secondary text-secondary-foreground rounded-bl-sm"
                            : "bg-muted text-card-foreground rounded-bl-sm")}>
                          {isAI && (<div className="flex items-center gap-1.5 mb-1">
                              <Sparkles className="h-3 w-3"/>
                              <span className="text-[10px] font-semibold uppercase tracking-wider">
                                Suggestion IA
                              </span>
                            </div>)}
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                          <p className={cn("mt-1 text-[10px]", isAgent
                        ? "text-primary-foreground/70 text-right"
                        : "text-muted-foreground")}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </motion.div>);
            })}
                </AnimatePresence>
                <div ref={messagesEndRef}/>
              </div>

              {/* Input */}
              <div className="border-t border-border bg-card p-4">
                <div className="flex items-center gap-3">
                  <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors">
                    <Paperclip className="h-5 w-5"/>
                  </button>
                  <div className="relative flex-1">
                    <input type="text" placeholder="Tapez votre message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"/>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Smile className="h-4 w-4"/>
                    </button>
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleSendMessage} disabled={!newMessage.trim()} className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50 transition-opacity">
                    <Send className="h-4 w-4"/>
                  </motion.button>
                </div>
              </div>
            </>) : (<div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Hash className="h-8 w-8 text-primary"/>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                Selectionnez une conversation
              </h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                Choisissez une conversation dans la liste pour commencer a echanger avec vos contacts.
              </p>
            </div>)}
        </div>
      </div>
    </DashboardShell>);
}
function getAIResponse(userMessage) {
    const responses = [
        "D'apres l'analyse du contexte, je recommande de proposer une remise de 10% pour fideliser ce client.",
        "Le sentiment de ce message est positif. Le client semble satisfait de la resolution.",
        "Je detecte un besoin d'assistance technique. Je peux generer un ticket automatiquement si vous le souhaitez.",
        "Voici un modele de reponse: 'Nous comprenons votre situation et travaillons activement sur une solution. Vous recevrez une mise a jour dans les 24h.'",
        "Analyse terminee: ce client a un score d'engagement de 8.5/10. C'est un bon moment pour proposer une offre premium.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}
