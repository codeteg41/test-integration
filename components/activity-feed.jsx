"use client";
import { motion } from "framer-motion";
import { Ticket, MessageSquare, Megaphone, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
const typeConfig = {
    ticket: {
        icon: Ticket,
        color: "bg-chart-5/15 text-chart-5",
    },
    conversation: {
        icon: MessageSquare,
        color: "bg-primary/15 text-primary",
    },
    campaign: {
        icon: Megaphone,
        color: "bg-chart-4/15 text-chart-4",
    },
    contact: {
        icon: UserPlus,
        color: "bg-secondary text-secondary-foreground",
    },
};
export function ActivityFeed({ activities }) {
    return (<div className="space-y-1">
      {activities.map((activity, index) => {
            const config = typeConfig[activity.type];
            const Icon = config.icon;
            return (<motion.div key={activity.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors">
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", config.color)}>
              <Icon className="h-4 w-4"/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-card-foreground leading-relaxed">
                {activity.message}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {activity.time} &middot; {activity.user}
              </p>
            </div>
          </motion.div>);
        })}
    </div>);
}
