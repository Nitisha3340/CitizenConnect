"use client";

import { useIssues } from "@/context/IssueContext";
import IssueTable from "@/components/IssueTable";
import StatsCard from "@/components/StatsCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function IssuesPage() {
  const { issues, updateStatus, loading } = useIssues();

  if (loading) {
    return <LoadingSkeleton cards={3} rows={3} />;
  }

  const openIssues = issues.filter((issue) => issue.status !== "Resolved").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Issues" value={issues.length} />
        <StatsCard title="Open Issues" value={openIssues} />
        <StatsCard title="Resolved" value={issues.filter((issue) => issue.status === "Resolved").length} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Manage Issues</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Zone issues</h1>
        </div>

        <IssueTable issues={issues} onStatusChange={(id, status) => void updateStatus(id, status)} />
      </div>
    </div>
  );
}
