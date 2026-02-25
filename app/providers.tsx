"use client";

import { AuthProvider } from "@/context/AuthContext";
import { IssueProvider } from "@/context/IssueContext";
import { AnnouncementProvider } from "@/context/AnnouncementContext";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <IssueProvider>
        <AnnouncementProvider>
          {children}
        </AnnouncementProvider>
      </IssueProvider>
    </AuthProvider>
  );
}