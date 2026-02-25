"use client";

import { useAuth } from "@/context/AuthContext";
import { useIssues } from "@/context/IssueContext";

export default function ModeratorDashboard() {
  const { logout } = useAuth();
  const { issues, deleteIssue } = useIssues();

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-10">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Moderator Dashboard</h1>

        <button
          onClick={logout}
          className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-6">
          All Submitted Issues
        </h2>

        {issues.length === 0 && (
          <p className="text-gray-400">No issues available.</p>
        )}

        <div className="space-y-6">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white/5 border border-white/10 p-6 rounded-xl flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">
                  {issue.title}
                </h3>
                <p className="text-sm text-gray-400">
                  Raised by: {issue.createdBy}
                </p>
                <p className="text-sm text-gray-400">
                  Status: {issue.status}
                </p>
              </div>

              <button
                onClick={() => deleteIssue(issue.id)}
                className="bg-red-600 px-4 py-2 rounded-md hover:opacity-80"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}