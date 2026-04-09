"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useIssues } from "@/context/IssueContext";
import { useAuth } from "@/context/AuthContext";
import API from "@/app/api/api";


export default function RaiseIssuePage() {
  const { addIssue } = useIssues();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [region, setRegion] = useState("");
  const [severity, setSeverity] =
    useState<"Low" | "Medium" | "High">("Low");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {

  if (!title) {
    setError("Title is required");
    return;
  }

  if (!description) {
    setError("Description is required");
    return;
  }

  setError("");
  setLoading(true);

  try {
    await API.post("/complaints", {
      title,
      description,
      severity,
      region
    });

    toast.success("Issue submitted successfully");

  } catch (err: any) {
    setError(err.response?.data?.message || "Something went wrong");
  }

  setLoading(false);
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

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-purple-600 px-4 py-2 rounded hover:opacity-90 transition duration-200"
         >
           {loading ? "Submitting..." : "Submit Issue"}
          </button>
      </form>
    </div>
  );
}