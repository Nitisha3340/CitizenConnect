"use client";

import { getIssues, nowIso, saveIssues, type IssueSeverity, type IssueStatus, type StoredIssue } from "@/app/api/storage";
import { useAuth } from "@/context/AuthContext";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface Issue extends StoredIssue {
  region: string;
}

type IssueInput = Omit<Issue, "id" | "createdAt" | "updatedAt" | "deleted" | "deletedAt" | "deletedBy" | "deleteReason"> & {
  zone?: Issue["zone"];
};

interface IssueContextType {
  issues: Issue[];
  allIssues: Issue[];
  loading: boolean;
  refreshIssues: () => Promise<void>;
  addIssue: (issue: IssueInput) => Promise<Issue>;
  updateStatus: (id: number, status: IssueStatus) => Promise<void>;
  deleteIssue: (id: number, reason?: string) => Promise<void>;
}

const IssueContext = createContext<IssueContextType | null>(null);

async function requestIssueApi<T>(
  url: string,
  options?: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
  }
) {
  const response = await fetch(url, {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) {
    throw new Error(data?.message || "Issue request failed");
  }

  return data;
}

function normalizeStatus(status: any): IssueStatus {
  const normalized = String(status || "").toUpperCase();

  if (normalized === "IN_PROGRESS" || normalized === "IN PROGRESS") return "In Progress";
  if (normalized === "RESOLVED") return "Resolved";
  return "Pending";
}

function normalizeSeverity(severity: any): IssueSeverity {
  const normalized = String(severity || "").toLowerCase();

  if (normalized === "high") return "High";
  if (normalized === "medium") return "Medium";
  return "Low";
}

function normalizeIssue(issue: any, fallbackId = Date.now()): Issue {
  const zone = issue.zone || issue.region || "North Zone";

  return {
    id: Number(issue.id ?? fallbackId),
    title: issue.title || "Untitled issue",
    description: issue.description || "",
    status: normalizeStatus(issue.status),
    severity: normalizeSeverity(issue.severity),
    zone,
    region: issue.region || zone,
    createdBy: issue.createdBy || issue.created_by || issue.email || "Unknown",
    createdById: issue.createdById || issue.userId || issue.user_id || issue.email || "",
    email: issue.email || issue.userEmail || "",
    assignedPolitician: issue.assignedPolitician || issue.assigned_politician || "",
    createdAt: issue.createdAt || issue.created_at || new Date(fallbackId).toISOString(),
    updatedAt: issue.updatedAt || issue.updated_at || new Date(fallbackId).toISOString(),
    deleted: Boolean(issue.deleted),
    deletedAt: issue.deletedAt || issue.deleted_at,
    deletedBy: issue.deletedBy || issue.deleted_by,
    deleteReason: issue.deleteReason || issue.delete_reason,
  };
}

function toApiStatus(status: IssueStatus) {
  if (status === "In Progress") return "IN_PROGRESS";
  if (status === "Resolved") return "RESOLVED";
  return "PENDING";
}

function toStoredIssue(issue: Issue): StoredIssue {
  return {
    ...issue,
    region: issue.region || issue.zone,
    deleted: issue.deleted ?? false,
  };
}

export function IssueProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  const loadIssues = async () => {
    const zone = user?.role === "admin" ? undefined : user?.zone;
    const endpoint = zone ? `/api/issues?zone=${encodeURIComponent(zone)}` : "/api/issues";

    try {
      const response = await requestIssueApi<{ data?: unknown[] }>(endpoint);
      const payload = Array.isArray(response.data) ? response.data : [];

      const normalized = payload.map(normalizeIssue).filter((issue: Issue) => !issue.deleted);
      setIssues(normalized);
      saveIssues(normalized.map(toStoredIssue));
      return;
    } catch {
      const fallback = getIssues().map(normalizeIssue).filter((issue: Issue) => !issue.deleted);
      setIssues(fallback);
    }
  };

  const refreshIssues = async () => {
    setLoading(true);

    try {
      await loadIssues();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshIssues();
  }, [user?.role, user?.zone]);

  useEffect(() => {
    const handleAuthChange = () => {
      void refreshIssues();
    };

    window.addEventListener("auth-changed", handleAuthChange);

    return () => window.removeEventListener("auth-changed", handleAuthChange);
  }, [user?.role, user?.zone]);

  useEffect(() => {
    if (!user) return;

    const interval = window.setInterval(() => {
      void loadIssues();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [user?.id, user?.role, user?.zone]);

  const scopedIssues = useMemo(() => {
    if (!user) return [];
    if (user.role === "admin") return issues;
    return issues.filter((issue) => issue.zone === user.zone);
  }, [issues, user]);

  const addIssue = async (issue: IssueInput) => {
    if (!user) {
      throw new Error("You must be signed in to submit an issue.");
    }

    try {
      const response = await requestIssueApi<{ data?: unknown }>("/api/issues", {
        method: "POST",
        body: {
          title: issue.title,
          description: issue.description,
          status: issue.status || "Pending",
          severity: issue.severity || "Low",
          zone: issue.zone || user.zone,
          region: issue.region || issue.zone || user.zone,
          createdBy: issue.createdBy || user.name,
          createdById: issue.createdById || user.id,
          email: issue.email || user.email,
          assignedPolitician: issue.assignedPolitician || "",
        },
      });

      const createdIssue = normalizeIssue(response.data || issue, Date.now());
      const merged = [createdIssue, ...getIssues().map(normalizeIssue).filter((item) => item.id !== createdIssue.id)];
      saveIssues(merged.map(toStoredIssue));
      setIssues(merged.filter((item) => !item.deleted));
      return createdIssue;
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to add issue");
    }
  };

  const updateStatus = async (id: number, status: IssueStatus) => {
    if (!user || user.role !== "politician") {
      throw new Error("Only politicians can update issue status");
    }

    try {
      const response = await requestIssueApi<{ data?: unknown }>(`/api/issues/${id}`, {
        method: "PATCH",
        headers: { "x-user-role": user.role },
        body: {
          status,
          assignedPolitician: user.name,
          zone: user.zone,
          normalizedStatus: toApiStatus(status),
        },
      });

      const updatedIssue = normalizeIssue(response.data || {}, id);
      const currentIssues = getIssues().map(normalizeIssue);
      const nextIssues = currentIssues.map((issue) =>
        issue.id === id ? { ...issue, ...updatedIssue, updatedAt: nowIso() } : issue
      );
      saveIssues(nextIssues.map(toStoredIssue));
      setIssues(nextIssues.filter((issue) => !issue.deleted));
      await loadIssues();
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to update status");
    }
  };

  const deleteIssue = async (id: number) => {
    if (!user || user.role !== "moderator") {
      throw new Error("Only moderators can delete issues");
    }

    try {
      await requestIssueApi<{ success: boolean }>(`/api/issues/${id}`, {
        method: "DELETE",
        headers: { "x-user-role": user.role },
      });

      const nextIssues = getIssues().map(normalizeIssue).filter((issue) => issue.id !== id);
      saveIssues(nextIssues.map(toStoredIssue));
      setIssues(nextIssues);
      await loadIssues();
    } catch (error) {
      throw error instanceof Error ? error : new Error("Failed to delete issue");
    }
  };

  return (
    <IssueContext.Provider
      value={{ issues: scopedIssues, allIssues: issues, loading, refreshIssues, addIssue, updateStatus, deleteIssue }}
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
