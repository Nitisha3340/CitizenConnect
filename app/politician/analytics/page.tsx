"use client";

import { useAuth } from "@/context/AuthContext";
import { useIssues } from "@/context/IssueContext";
import StatsCard from "@/components/StatsCard";
import IssueCharts from "@/components/Charts";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { issues, loading } = useIssues();

  if (loading) {
    return <LoadingSkeleton cards={3} rows={2} />;
  }

  const openIssues = issues.filter((issue) => issue.status !== "Resolved").length;
  const resolvedIssues = issues.filter((issue) => issue.status === "Resolved").length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">{user?.zone} issue insights</h1>
        <p className="mt-2 text-sm text-slate-300">Overview of the issues currently assigned to your zone.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Open Issues" value={openIssues} />
        <StatsCard title="Resolved Issues" value={resolvedIssues} />
        <StatsCard title="Total Issues" value={issues.length} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <IssueCharts issues={issues} />
      </div>
    </div>
  );
}
