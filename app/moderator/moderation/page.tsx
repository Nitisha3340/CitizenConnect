"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useIssues } from "@/context/IssueContext";
import IssueCard from "@/components/IssueCard";
import StatsCard from "@/components/StatsCard";
import ConfirmModal from "@/components/ConfirmModal";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function ModerationPage() {
  const { user } = useAuth();
  const { issues, allIssues, deleteIssue, loading } = useIssues();
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);

  const selectedIssue = useMemo(() => issues.find((issue) => issue.id === selectedIssueId) || null, [issues, selectedIssueId]);

  const handleDelete = async (id: number) => {
    try {
      await deleteIssue(id, "offensive");
      toast.success("Issue deleted globally");
      setSelectedIssueId(null);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete issue");
    }
  };

  if (loading) {
    return <LoadingSkeleton cards={3} rows={3} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Zone" value={user?.zone || "-"} subtitle="Moderation scope" />
        <StatsCard title="Issues in Queue" value={issues.length} subtitle="Visible in your zone" />
        <StatsCard title="Deleted Logs" value={allIssues.filter((issue) => issue.deleted).length} subtitle="Audit trail retained" />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Moderation</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Review issues in {user?.zone}</h1>
          <p className="mt-2 text-sm text-slate-300">Delete only if the content is offensive. Global removal keeps the audit log.</p>
        </div>

        <div className="grid gap-4">
          {issues.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-slate-300">No issues to moderate in this zone.</div>
          ) : (
            issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                action={
                  <button
                    onClick={() => setSelectedIssueId(issue.id)}
                    className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/20"
                  >
                    Delete offensive
                  </button>
                }
              />
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        open={selectedIssueId !== null}
        title="Delete this issue?"
        message={selectedIssue ? `This will remove "${selectedIssue.title}" globally and keep an audit log.` : "This will remove the selected issue globally."}
        confirmLabel="Delete"
        onConfirm={() => {
          if (selectedIssueId !== null) {
            void handleDelete(selectedIssueId);
          }
        }}
        onCancel={() => setSelectedIssueId(null)}
      />
    </div>
  );
}
