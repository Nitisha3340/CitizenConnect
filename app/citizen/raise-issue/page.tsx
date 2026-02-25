"use client";

import { useState } from "react";
import { useIssues } from "@/context/IssueContext";
import { useAuth } from "@/context/AuthContext";

export default function RaiseIssuePage() {
  const { addIssue } = useIssues();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [region, setRegion] = useState("");
  const [severity, setSeverity] =
    useState<"Low" | "Medium" | "High">("Low");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !region || !user) return;

    const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!title || !region || !user) return;

  addIssue({
    id: Date.now(),
    title,
    region,
    severity,
    status: "Pending",
    createdBy: user.name,
    userId: user.id,
    email: user.email,
  });

  setTitle("");
  setRegion("");
  setSeverity("Low");
};

    setTitle("");
    setRegion("");
    setSeverity("Low");
  };

  return (
    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-white">
        Raise a New Issue
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-white/10 text-white rounded-lg"
        />

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white rounded-lg"
        >
          <option value="">Select Region</option>
          <option value="North Zone">North Zone</option>
          <option value="South Zone">South Zone</option>
          <option value="East Zone">East Zone</option>
          <option value="West Zone">West Zone</option>
        </select>

        <select
          value={severity}
          onChange={(e) =>
            setSeverity(e.target.value as "Low" | "Medium" | "High")
          }
          className="w-full p-3 bg-gray-700 text-white rounded-lg"
        >
          <option value="Low">Low Severity</option>
          <option value="Medium">Medium Severity</option>
          <option value="High">High Severity</option>
        </select>

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 rounded-lg text-white"
        >
          Submit Issue
        </button>
      </form>
    </div>
  );
}