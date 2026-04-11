"use client";

import type { Issue } from "@/context/IssueContext";

export default function IssueTable({
  issues,
  onStatusChange,
  onDelete,
}: {
  issues: Issue[];
  onStatusChange?: (id: number, status: Issue["status"]) => void;
  onDelete?: (id: number) => void;
}) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 shadow-lg">
      <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
        <thead className="bg-slate-900 text-xs uppercase tracking-[0.2em] text-slate-300">
          <tr>
            <th className="px-4 py-3">Issue</th>
            <th className="px-4 py-3">Zone</th>
            <th className="px-4 py-3">Severity</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Raised By</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {issues.map((issue) => (
            <tr key={issue.id} className="align-top hover:bg-slate-900">
              <td className="px-4 py-4">
                <p className="font-semibold text-white">{issue.title}</p>
                <p className="mt-1 max-w-md text-xs text-slate-400">{issue.description}</p>
              </td>
              <td className="px-4 py-4">{issue.zone}</td>
              <td className="px-4 py-4">{issue.severity}</td>
              <td className="px-4 py-4">
                {onStatusChange ? (
                  <select
                    value={issue.status}
                    onChange={(e) => onStatusChange(issue.id, e.target.value as Issue["status"])}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                ) : (
                  issue.status
                )}
              </td>
              <td className="px-4 py-4">{issue.createdBy}</td>
              <td className="px-4 py-4">
                {onDelete ? (
                  <button
                    onClick={() => onDelete(issue.id)}
                    className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
                  >
                    Delete
                  </button>
                ) : (
                  <span className="text-xs text-slate-500">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
