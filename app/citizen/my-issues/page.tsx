"use client";

import { useIssues } from "@/context/IssueContext";
import { useAuth } from "@/context/AuthContext";

export default function MyIssuesPage() {
  const { issues } = useIssues();
  const { user } = useAuth();

  const myIssues = issues.filter(
    (issue) => issue.userId === user?.id
  );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-8">My Issues</h2>

      <div className="relative border-l-4 border-gray-600 pl-8 space-y-10">

        {myIssues.length === 0 && (
          <p className="text-gray-400">
            No issues raised yet.
          </p>
        )}

        {myIssues.map((issue) => (
          <div
            key={issue.id}
            className="relative bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg"
          >
            <div className="absolute -left-11 top-6 w-5 h-5 bg-blue-600 rounded-full border-4 border-[#0b1120]" />

            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {issue.title}
              </h3>

              <span className="text-sm px-4 py-1 rounded-full bg-gray-700">
                {issue.status}
              </span>
            </div>

            <p className="text-gray-400 mt-2">
              Region: {issue.region} | Severity: {issue.severity}
            </p>

            <p className="text-gray-500 text-sm mt-1">
              Created on: {new Date(issue.id).toLocaleDateString("en-GB")}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}