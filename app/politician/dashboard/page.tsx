"use client";

import { useAuth } from "@/context/AuthContext";
import { useIssues } from "@/context/IssueContext";
import LogoutButton from "@/components/LogoutButton";
import StatsCard from "@/components/StatsCard";
import IssueTable from "@/components/IssueTable";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const { issues, updateStatus, loading } = useIssues();

  const total = issues.length;
  const resolved = issues.filter((issue) => issue.status === "Resolved").length;
  const pending = issues.filter((issue) => issue.status !== "Resolved").length;

  if (loading) {
    return <LoadingSkeleton cards={3} rows={3} />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Politician Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-white">{user?.name}</h1>
            <p className="mt-2 text-sm text-slate-300">Monitoring issues in {user?.zone}.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Zone</p>
              <p className="mt-1 font-semibold text-white">{user?.zone}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Issues" value={total} />
        <StatsCard title="Resolved" value={resolved} />
        <StatsCard title="Pending" value={pending} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">Resolve Issues</h2>
          <p className="text-sm text-slate-300">Update the status after taking action on an issue.</p>
        </div>

        <IssueTable issues={issues} onStatusChange={(id, status) => void updateStatus(id, status)} />
      </div>
    </div>
  );
}
