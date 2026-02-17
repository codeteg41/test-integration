"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
export function KpiCard({ title, value, change, icon: Icon, color = "bg-primary", index = 0, }) {
    const isPositive = change && change > 0;
    const isNegative = change && change < 0;
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1, duration: 0.4 }} whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }} className="rounded-xl border border-border bg-card p-5 transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold text-card-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
          </p>
          {change !== undefined && (<div className="mt-2 flex items-center gap-1">
              {isPositive ? (<TrendingUp className="h-3.5 w-3.5 text-[#22C55E]"/>) : isNegative ? (<TrendingDown className="h-3.5 w-3.5 text-destructive"/>) : null}
              <span className={cn("text-xs font-medium", isPositive && "text-[#22C55E]", isNegative && "text-destructive", !isPositive && !isNegative && "text-muted-foreground")}>
                {isPositive && "+"}
                {change}%
              </span>
              <span className="text-xs text-muted-foreground">vs mois dernier</span>
            </div>)}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-lg", color)}>
          <Icon className="h-5 w-5 text-primary-foreground"/>
        </div>
      </div>
    </motion.div>);
}
