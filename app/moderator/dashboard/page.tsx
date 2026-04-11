"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useIssues } from "@/context/IssueContext";
import LogoutButton from "@/components/LogoutButton";
import StatsCard from "@/components/StatsCard";
import IssueCard from "@/components/IssueCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const { issues, loading } = useIssues();

  if (loading) {
    return <LoadingSkeleton cards={3} rows={3} />;
  }

  const total = issues.length;
  const highSeverity = issues.filter((issue) => issue.severity === "High").length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Moderator Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{user?.zone} moderation queue</h1>
            <p className="mt-2 text-sm text-slate-300">Review and remove offensive issues in your assigned zone.</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/moderator/moderation" className="rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
              Open moderation
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Queue Size" value={total} subtitle="Zone issues visible now" />
        <StatsCard title="High Severity" value={highSeverity} subtitle="Potential review candidates" />
        <StatsCard title="Zone" value={user?.zone || "-"} subtitle="Assigned scope" />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">Recent Issues</h2>
          <p className="text-sm text-slate-300">Current items in your moderation zone</p>
        </div>

        <div className="grid gap-4">
          {issues.slice(0, 3).map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </div>
    </div>
  );
}
