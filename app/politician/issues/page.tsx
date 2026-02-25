"use client";

import { useIssues } from "@/context/IssueContext";

export default function IssuesPage() {
  const { issues, updateStatus } = useIssues();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Issues</h1>

      {issues.length === 0 && (
        <p className="text-gray-400">No issues submitted yet.</p>
      )}

      <div className="space-y-6">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="bg-white text-black p-6 rounded-lg shadow-md"
          >
            <h3 className="font-semibold text-lg mb-2">
              {issue.title}
            </h3>

            <p className="mb-1">
              <strong>Region:</strong> {issue.region}
            </p>

            <p className="mb-1">
              <strong>Severity:</strong> {issue.severity}
            </p>

            <p className="mb-1">
              <strong>Raised By:</strong> {issue.createdBy}
            </p>

            <p className="mb-4">
              <strong>Current Status:</strong> {issue.status}
            </p>

            <label className="block mb-2 font-medium">
              Update Status
            </label>

            <select
              value={issue.status}
              onChange={(e) =>
                updateStatus(
                  issue.id,
                  e.target.value as
                    | "Pending"
                    | "In Progress"
                    | "Resolved"
                )
              }
              className="border p-2 rounded-md mb-4"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}