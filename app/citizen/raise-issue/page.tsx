"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useIssues } from "@/context/IssueContext";

export default function RaiseIssuePage() {
  const { user } = useAuth();
  const { addIssue } = useIssues();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"Low" | "Medium" | "High">("Low");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    if (!user) {
      setError("You must be signed in to submit an issue");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await addIssue({
        title: title.trim(),
        description: description.trim(),
        status: "Pending",
        severity,
        zone: user.zone,
        region: user.zone,
        createdBy: user.name,
        createdById: user.id,
        email: user.email,
        assignedPolitician: "",
      });

      toast.success("Issue submitted successfully");
      setTitle("");
      setDescription("");
      setSeverity("Low");
    } catch (submitError: any) {
      const message = submitError?.message || "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 max-w-2xl">
      <h2 className="text-2xl font-semibold mb-6 text-white">Raise a New Issue</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Issue Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-white/10 text-white rounded-lg"
        />

        <textarea
          placeholder="Describe the issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full min-h-32 p-3 bg-white/10 text-white rounded-lg"
        />

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value as "Low" | "Medium" | "High")}
          className="w-full p-3 bg-gray-700 text-white rounded-lg"
        >
          <option value="Low">Low Severity</option>
          <option value="Medium">Medium Severity</option>
          <option value="High">High Severity</option>
        </select>

        <input
          value={user?.zone || ""}
          readOnly
          className="w-full p-3 bg-gray-700 text-white rounded-lg opacity-80"
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 px-4 py-2 rounded hover:opacity-90 transition duration-200"
        >
          {loading ? "Submitting..." : "Submit Issue"}
        </button>
      </form>
    </div>
  );
}
