"use client";

import { useState } from "react";

export default function IssuesPage() {
  const [status, setStatus] = useState("Pending");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Issues</h1>

      <div className="bg-white text-black p-6 rounded-lg">
        <h3 className="font-semibold mb-4">Water Leakage - Sector 5</h3>

        <p className="mb-4">Severity: High</p>

        <label className="block mb-2 font-medium">Update Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded-md mb-4"
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <button className="bg-indigo-600 text-white px-5 py-2 rounded-md">
          Save Status
        </button>
      </div>
    </div>
  );
}