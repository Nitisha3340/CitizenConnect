"use client";

import { useState } from "react";
import { useIssues } from "@/context/IssueContext";

export default function TrendingPage() {
  const { issues } = useIssues();
  const [selectedRegion, setSelectedRegion] = useState("All");

  const filteredIssues =
    selectedRegion === "All"
      ? issues
      : issues.filter((i) => i.region === selectedRegion);

  const highSeverity = filteredIssues.filter(
    (i) => i.severity === "High"
  );

  const severityCount = {
    Low: filteredIssues.filter((i) => i.severity === "Low").length,
    Medium: filteredIssues.filter((i) => i.severity === "Medium").length,
    High: filteredIssues.filter((i) => i.severity === "High").length,
  };

  return (
    <div className="space-y-8">

      <h2 className="text-3xl font-bold text-white">
        Regional Trending Dashboard
      </h2>

      {/* Region Filter */}
      <select
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
        className="p-3 bg-gray-700 text-white rounded-lg"
      >
        <option value="All">All Regions</option>
        <option value="North Zone">North Zone</option>
        <option value="South Zone">South Zone</option>
        <option value="East Zone">East Zone</option>
        <option value="West Zone">West Zone</option>
      </select>

      {/* High Severity Section */}
      <div className="bg-red-500/10 border border-red-500 p-6 rounded-xl">
        <h3 className="text-xl font-semibold text-red-400 mb-4">
          🚨 High Severity Issues
        </h3>

        {highSeverity.length === 0 ? (
          <p className="text-gray-400">No high severity issues.</p>
        ) : (
          highSeverity.map((issue) => (
            <div key={issue.id} className="py-2 border-b border-white/10">
              {issue.title} — {issue.region}
            </div>
          ))
        )}
      </div>

      {/* Severity Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-green-500 p-6 rounded-xl text-white">
          <h4>Low</h4>
          <p className="text-3xl font-bold">{severityCount.Low}</p>
        </div>

        <div className="bg-yellow-500 p-6 rounded-xl text-white">
          <h4>Medium</h4>
          <p className="text-3xl font-bold">{severityCount.Medium}</p>
        </div>

        <div className="bg-red-600 p-6 rounded-xl text-white">
          <h4>High</h4>
          <p className="text-3xl font-bold">{severityCount.High}</p>
        </div>
      </div>
    </div>
  );
}