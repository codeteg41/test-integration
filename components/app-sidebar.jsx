"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, MessageSquare, Ticket, Megaphone, Users, Settings, Bot, ChevronLeft, ChevronRight, LogOut, X, } from "lucide-react";
import { cn } from "@/lib/utils";
const navItems = [
    {
        label: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        label: "Conversations",
        href: "/conversations",
        icon: MessageSquare,
        badge: 6,
    },
    {
        label: "Tickets",
        href: "/tickets",
        icon: Ticket,
        badge: 3,
    },
    {
        label: "Campagnes",
        href: "/campaigns",
        icon: Megaphone,
    },
    {
        label: "Contacts",
        href: "/contacts",
        icon: Users,
    },
];
const bottomItems = [
    {
        label: "Paramètres",
        href: "/settings",
        icon: Settings,
    },
];
export function AppSidebar({ collapsed, onCollapsedChange, mobileOpen, onMobileClose, }) {
    const pathname = usePathname();
    const handleNavClick = () => {
        if (onMobileClose) {
            onMobileClose();
        }
    };
    return (<motion.aside initial={false} animate={{ width: collapsed ? 72 : 260 }} transition={{ duration: 0.3, ease: "easeInOut" }} className={cn("fixed left-0 top-0 z-40 flex h-screen flex-col bg-sidebar-bg border-r border-sidebar-border", "w-[260px] -translate-x-full transition-transform duration-300 lg:translate-x-0", mobileOpen && "translate-x-0")}>
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
          <Bot className="h-5 w-5 text-primary"/>
        </div>
        {!collapsed && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
            <span className="text-xl font-semibold tracking-[0.08em] text-sidebar-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              Puls<span className="text-primary">AI</span>
            </span>
          </motion.div>)}
        <button onClick={onMobileClose} className="ml-auto flex h-8 w-8 items-center justify-center rounded-md text-sidebar-muted hover:text-sidebar-foreground lg:hidden">
          <X className="h-4 w-4"/>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
            return (<Link key={item.href} href={item.href} onClick={handleNavClick}>
                <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }} className={cn("relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", isActive
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground")}>
                  {isActive && (<motion.div layoutId="sidebar-active" className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                    }}/>)}
                  <item.icon className="h-5 w-5 shrink-0"/>
                  {!collapsed && (<motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
                      {item.label}
                    </motion.span>)}
                  {!collapsed && item.badge && (<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                      {item.badge}
                    </span>)}
                </motion.div>
              </Link>);
        })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        {bottomItems.map((item) => {
            const isActive = pathname === item.href;
            return (<Link key={item.href} href={item.href} onClick={handleNavClick}>
              <motion.div whileHover={{ x: 2 }} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", isActive
                    ? "bg-primary/15 text-primary"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground")}>
                <item.icon className="h-5 w-5 shrink-0"/>
                {!collapsed && <span>{item.label}</span>}
              </motion.div>
            </Link>);
        })}

        <button className={cn("mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors", "bg-destructive/15 text-destructive hover:bg-destructive/20")}>
          <LogOut className="h-5 w-5 shrink-0"/>
          {!collapsed && <span>Deconnexion</span>}
        </button>
      </div>

      {/* Collapse button */}
      <button onClick={() => onCollapsedChange(!collapsed)} className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground transition-colors lg:flex">
        {collapsed ? (<ChevronRight className="h-3 w-3"/>) : (<ChevronLeft className="h-3 w-3"/>)}
      </button>
    </motion.aside>);
}
