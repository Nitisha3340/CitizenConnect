"use client";

import API from "@/app/api/api";
import { createContext, useContext, useEffect, useState } from "react";

export interface Issue {
  id: number;
  title: string;
  description?: string;
  status: "Pending" | "In Progress" | "Resolved";
  severity: "Low" | "Medium" | "High";
  region: string;
  createdBy: string;
  userId: string;
  email: string;
}

interface IssueContextType {
  issues: Issue[];
  loading: boolean;
  refreshIssues: () => Promise<void>;
  addIssue: (issue: Omit<Issue, "id">) => Promise<void>;
  updateStatus: (id: number, status: Issue["status"]) => Promise<void>;
  deleteIssue: (id: number) => Promise<void>;
}

const IssueContext = createContext<IssueContextType | null>(null);

function normalizeStatus(status: any): Issue["status"] {
  const normalized = String(status || "").toUpperCase();

  if (normalized === "IN_PROGRESS" || normalized === "IN PROGRESS") return "In Progress";
  if (normalized === "RESOLVED") return "Resolved";
  if (normalized === "PENDING") return "Pending";
  return status || "Pending";
}

function toApiStatus(status: Issue["status"]) {
  if (status === "In Progress") return "IN_PROGRESS";
  if (status === "Resolved") return "RESOLVED";
  return "PENDING";
}

function normalizeIssue(issue: any, fallbackId = Date.now()): Issue {
  return {
    id: Number(issue.id ?? fallbackId),
    title: issue.title,
    description: issue.description,
    status: normalizeStatus(issue.status),
    severity: issue.severity || "Low",
    region: issue.region || "",
    createdBy: issue.createdBy || issue.created_by || issue.email || "Unknown",
    userId: issue.userId || issue.user_id || issue.email || "",
    email: issue.email || issue.userEmail || "",
  };
}

export function IssueProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshIssues = async () => {
    setLoading(true);

    try {
      const response = await API.get("/complaints");
      const payload = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      setIssues(payload.map(normalizeIssue));
    } catch {
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshIssues();
  }, []);

  useEffect(() => {
    const handleAuthChange = () => {
      void refreshIssues();
    };

    window.addEventListener("auth-changed", handleAuthChange);

    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, []);

  const addIssue = async (issue: Omit<Issue, "id">) => {
    const response = await API.post("/complaints", issue);
    const createdIssue = normalizeIssue(response.data?.data || response.data || issue);
    setIssues((prev) => [createdIssue, ...prev]);
  };

  const updateStatus = async (id: number, status: Issue["status"]) => {
    await API.patch(`/complaints/${id}`, { status: toApiStatus(status) });
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status } : issue
      )
    );
  };

  const deleteIssue = async (id: number) => {
    await API.delete(`/complaints/${id}`);
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
  };

  return (
    <IssueContext.Provider
      value={{ issues, loading, refreshIssues, addIssue, updateStatus, deleteIssue }}
    >
      {children}
    </IssueContext.Provider>
  );
}

export function useIssues() {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error("useIssues must be used inside IssueProvider");
  }
  return context;
}
