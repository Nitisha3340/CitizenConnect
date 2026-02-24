"use client";

import { createContext, useContext, useState } from "react";

export interface Issue {
  id: number;
  title: string;
  status: "Pending" | "In Progress" | "Resolved";
  severity: "Low" | "Medium" | "High";
  region: string;
}

interface IssueContextType {
  issues: Issue[];
  updateStatus: (id: number, status: Issue["status"]) => void;
  addIssue: (issue: Issue) => void;
}

const IssueContext = createContext<IssueContextType | null>(null);

export function IssueProvider({ children }: { children: React.ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 1,
      title: "Road Damage in North Zone",
      status: "Pending",
      severity: "High",
      region: "North",
    },
    {
      id: 2,
      title: "Water Leakage",
      status: "In Progress",
      severity: "Medium",
      region: "South",
    },
  ]);

  const updateStatus = (id: number, status: Issue["status"]) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, status } : issue
      )
    );
  };

  const addIssue = (issue: Issue) => {
    setIssues((prev) => [...prev, issue]);
  };

  return (
    <IssueContext.Provider value={{ issues, updateStatus, addIssue }}>
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