"use client";

import { motion } from "framer-motion";
import type { Issue } from "@/context/IssueContext";

export default function IssueCard({
  issue,
  action,
}: {
  issue: Issue;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{issue.title}</h3>
            <p className="mt-1 text-sm text-slate-300">{issue.description}</p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs text-slate-200">
            <Badge label={issue.zone} tone="cyan" />
            <Badge label={issue.status} tone={issue.status === "Resolved" ? "emerald" : issue.status === "In Progress" ? "amber" : "slate"} />
            <Badge label={issue.severity} tone={issue.severity === "High" ? "rose" : issue.severity === "Medium" ? "amber" : "emerald"} />
          </div>

          <div className="text-sm text-slate-400">
            <p>Raised by {issue.createdBy}</p>
            <p>{issue.email}</p>
            {issue.assignedPolitician ? <p>Assigned to {issue.assignedPolitician}</p> : null}
            <p>{new Date(issue.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {action ? <div className="flex shrink-0 gap-2">{action}</div> : null}
      </div>
    </motion.div>
  );
}

function Badge({ label, tone }: { label: string; tone: "cyan" | "emerald" | "amber" | "rose" | "slate" }) {
  const tones = {
    cyan: "bg-cyan-500/10 text-cyan-200 border-cyan-500/20",
    emerald: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-200 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-200 border-rose-500/20",
    slate: "bg-slate-500/10 text-slate-200 border-slate-500/20",
  } as const;

  return <span className={`rounded-full border px-3 py-1 ${tones[tone]}`}>{label}</span>;
}
