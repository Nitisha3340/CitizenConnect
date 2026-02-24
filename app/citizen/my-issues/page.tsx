"use client";

const issues = [
  { id: 1, title: "Road Damage in North Zone", status: "Pending" },
  { id: 2, title: "Water Leakage", status: "In Progress" },
  { id: 3, title: "Street Light Not Working", status: "Resolved" },
];

export default function MyIssuesPage() {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold mb-8">My Issues</h2>

      <div className="relative border-l-4 border-gray-600 pl-8 space-y-10">

        {issues.map((issue) => (
          <div
            key={issue.id}   
            className="relative bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg"
          >
            {/* Timeline Dot */}
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
              Created on: 24 Feb 2026
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}