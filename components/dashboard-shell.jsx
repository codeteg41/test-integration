"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNavbar } from "@/components/top-navbar";
import { motion } from "framer-motion";
export function DashboardShell({ children }) {
    return (<div className="flex min-h-screen bg-background">
      <AppSidebar />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="ml-[260px] flex-1 overflow-x-hidden">
        <TopNavbar />
        {children}
      </motion.main>
    </div>);
}
