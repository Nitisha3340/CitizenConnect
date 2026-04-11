"use client";

import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useIssues } from "@/context/IssueContext";
import { getUsers } from "@/app/api/storage";
import LogoutButton from "@/components/LogoutButton";
import StatsCard from "@/components/StatsCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { allIssues, loading } = useIssues();
  const users = getUsers();

  const activeIssues = allIssues.filter((issue) => !issue.deleted);
  const deletedIssues = allIssues.filter((issue) => issue.deleted);
  const zoneCounts = useMemo(() => {
    const counts = new Map<string, number>();
    activeIssues.forEach((issue) => counts.set(issue.zone, (counts.get(issue.zone) || 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [activeIssues]);

  if (loading) {
    return <LoadingSkeleton cards={4} rows={3} />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Platform overview</h1>
            <p className="mt-2 text-sm text-slate-300">Signed in as {user?.name}</p>
          </div>

          <LogoutButton />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Users" value={users.length} />
        <StatsCard title="Total Issues" value={activeIssues.length} />
        <StatsCard title="Deleted Logs" value={deletedIssues.length} />
        <StatsCard title="Moderators" value={users.filter((item) => item.role === "moderator").length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white">Issues per Zone</h2>
          <div className="mt-4 space-y-3">
            {zoneCounts.length === 0 ? (
              <p className="text-sm text-slate-300">No active issues yet.</p>
            ) : (
              zoneCounts.map(([zone, total]) => (
                <div key={zone} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200">
                  <span>{zone}</span>
                  <span className="font-semibold text-white">{total}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-white">Role Summary</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <Summary label="Citizens" value={users.filter((item) => item.role === "citizen").length} />
            <Summary label="Politicians" value={users.filter((item) => item.role === "politician").length} />
            <Summary label="Moderators" value={users.filter((item) => item.role === "moderator").length} />
            <Summary label="Admins" value={users.filter((item) => item.role === "admin").length} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg text-sm text-slate-300">
        <p>Deleted issues retained in audit log: {deletedIssues.length}</p>
        <p className="mt-2">Zone assignments tracked across all user accounts: {new Set(users.map((item) => item.zone)).size}</p>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
      <span>{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
