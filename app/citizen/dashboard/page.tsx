"use client";

import { useAuth } from "@/context/AuthContext";
import { useIssues } from "@/context/IssueContext";
import LogoutButton from "@/components/LogoutButton";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const { issues, loading } = useIssues();

  const userIssues = user
    ? issues.filter((issue) => issue.email.toLowerCase() === user.email.toLowerCase())
    : [];

  const total = userIssues.length;
  const inProgress = userIssues.filter((issue) => issue.status === "In Progress").length;
  const resolved = userIssues.filter((issue) => issue.status === "Resolved").length;
  const recent = userIssues.slice(0, 3);

  if (loading) {
    return <LoadingSkeleton cards={3} rows={2} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name} 👋</h1>
          <p className="text-gray-400 text-sm">Here’s an overview of your activity.</p>
        </div>

        <LogoutButton />
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card title="Total Issues" value={total} />
        <Card title="In Progress" value={inProgress} />
        <Card title="Resolved" value={resolved} />
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Issues</h2>

        <div className="space-y-4">
          {recent.length === 0 ? (
            <p className="text-gray-400 text-center mt-10">🚀 No issues yet — start by raising one!</p>
          ) : (
            recent.map((issue) => <IssueRow key={issue.id} title={issue.title} status={issue.status} />)
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
      <h3 className="text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-purple-400">{value}</p>
    </div>
  );
}

function IssueRow({ title, status }: { title: string; status: string }) {
  return (
    <div className="flex justify-between bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
      <span>{title}</span>
      <span className="text-sm text-gray-400">{status}</span>
    </div>
  );
}
