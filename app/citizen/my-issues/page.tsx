"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useIssues } from "@/context/IssueContext";

export default function MyIssuesPage() {
  const { user } = useAuth();
  const { issues, loading } = useIssues();

  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "In Progress" | "Resolved">("All");
  const [severityFilter, setSeverityFilter] = useState<"All" | "Low" | "Medium" | "High">("All");
  const [search, setSearch] = useState("");

  const userIssues = useMemo(
    () => issues.filter((issue) => issue.email.toLowerCase() === user?.email?.toLowerCase()),
    [issues, user?.email]
  );

  const filteredIssues = useMemo(() => {
    return userIssues.filter((issue) => {
      const matchesStatus = statusFilter === "All" || issue.status === statusFilter;
      const matchesSeverity = severityFilter === "All" || issue.severity === severityFilter;
      const query = search.trim().toLowerCase();
      const matchesQuery =
        !query ||
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query);

      return matchesStatus && matchesSeverity && matchesQuery;
    });
  }, [search, severityFilter, statusFilter, userIssues]);

  if (loading) {
    return <p className="text-white">Loading issues...</p>;
  }

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card title="Total Issues" value={userIssues.length} />
        <Card title="In Progress" value={userIssues.filter((issue) => issue.status === "In Progress").length} />
        <Card title="Resolved" value={userIssues.filter((issue) => issue.status === "Resolved").length} />
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-10">
        <h2 className="text-xl font-semibold mb-4">Issues Raised by {user?.name}</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues"
            className="w-full p-3 bg-white/10 text-white rounded-lg"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="w-full p-3 bg-white/10 text-white rounded-lg"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as typeof severityFilter)}
            className="w-full p-3 bg-white/10 text-white rounded-lg"
          >
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <p className="text-gray-400">No issues match your filters.</p>
          ) : (
            filteredIssues.map((issue) => <Row key={issue.id} title={issue.title} status={issue.status} severity={issue.severity} />)
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

function Row({ title, status, severity }: { title: string; status: string; severity: string }) {
  return (
    <div className="flex justify-between bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
      <span>{title}</span>
      <span className="text-sm text-gray-400">{status} · {severity}</span>
    </div>
  );
}
