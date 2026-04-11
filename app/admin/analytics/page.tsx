"use client";

import { useMemo } from "react";
import { useIssues } from "@/context/IssueContext";
import StatsCard from "@/components/StatsCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function AdminAnalyticsPage() {
  const { allIssues, loading } = useIssues();

  const deletedIssues = allIssues.filter((issue) => issue.deleted);

  const zoneDeletes = useMemo(() => {
    const counts = new Map<string, number>();
    deletedIssues.forEach((issue) => counts.set(issue.zone, (counts.get(issue.zone) || 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [deletedIssues]);

  if (loading) {
    return <LoadingSkeleton cards={3} rows={3} />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Moderation and audit logs</h1>
        <p className="mt-2 text-sm text-slate-300">Records are retained for audit even after global deletion.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Deleted Logs" value={deletedIssues.length} />
        <StatsCard title="Zones Touched" value={zoneDeletes.length} />
        <StatsCard title="Moderation Actions" value={deletedIssues.length} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white">Deleted Issue Logs</h2>

        <div className="mt-6 space-y-4">
          {deletedIssues.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-300">No deleted issues yet.</div>
          ) : (
            deletedIssues.map((issue) => (
              <div key={issue.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-200">
                <p className="font-semibold text-white">{issue.title}</p>
                <p className="mt-1 text-slate-300">Zone: {issue.zone}</p>
                <p className="text-slate-300">Deleted by: {issue.deletedBy || "Unknown"}</p>
                <p className="text-slate-300">Reason: {issue.deleteReason || "offensive"}</p>
                <p className="text-slate-400">{issue.deletedAt ? new Date(issue.deletedAt).toLocaleString() : "Unknown time"}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-white">Deleted Issues by Zone</h2>
        <div className="mt-4 space-y-3">
          {zoneDeletes.length === 0 ? (
            <p className="text-sm text-slate-300">No zone-level deletions recorded yet.</p>
          ) : (
            zoneDeletes.map(([zone, total]) => (
              <div key={zone} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200">
                <span>{zone}</span>
                <span className="font-semibold text-white">{total}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
