"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";
export function DashboardShell({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    return (<div className="flex min-h-screen bg-background">
      <AppSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      {mobileOpen && (<div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />)}
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className={cn("flex-1 overflow-x-hidden", "ml-0 lg:ml-[260px]", collapsed && "lg:ml-[72px]")}>
        <TopNavbar onMenu={() => setMobileOpen(true)} />
        {children}
      </motion.main>
    </div>);
}
