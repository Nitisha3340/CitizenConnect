"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useIssues } from "@/context/IssueContext";

export default function TrendingPage() {
  const { user } = useAuth();
  const { issues } = useIssues();
  const [selectedZone, setSelectedZone] = useState(user?.zone || "All");

  const filteredIssues =
    selectedZone === "All"
      ? issues
      : issues.filter((issue) => issue.zone === selectedZone);

  const highSeverity = filteredIssues.filter((issue) => issue.severity === "High");

  const severityCount = useMemo(
    () => ({
      Low: filteredIssues.filter((issue) => issue.severity === "Low").length,
      Medium: filteredIssues.filter((issue) => issue.severity === "Medium").length,
      High: filteredIssues.filter((issue) => issue.severity === "High").length,
    }),
    [filteredIssues]
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Regional Trending Dashboard</h2>

      <select
        value={selectedZone}
        onChange={(e) => setSelectedZone(e.target.value)}
        className="p-3 bg-gray-700 text-white rounded-lg"
      >
        <option value="All">All Zones</option>
        <option value="North Zone">North Zone</option>
        <option value="South Zone">South Zone</option>
        <option value="East Zone">East Zone</option>
        <option value="West Zone">West Zone</option>
      </select>

      <div className="bg-red-500/10 border border-red-500 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-red-400 mb-4">🚨 High Severity Issues</h3>

        {highSeverity.length === 0 ? (
          <p className="text-gray-400">No high severity issues.</p>
        ) : (
          highSeverity.map((issue) => (
            <div key={issue.id} className="py-2 border-b border-white/10 hover:bg-white/10 transition">
              {issue.title} — {issue.zone}
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <StatBox title="Low" value={severityCount.Low} color="bg-green-500" />
        <StatBox title="Medium" value={severityCount.Medium} color="bg-yellow-500" />
        <StatBox title="High" value={severityCount.High} color="bg-red-600" />
      </div>
    </div>
  );
}

function StatBox({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <div className={`${color} p-6 rounded-xl text-white`}>
      <h4>{title}</h4>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
