"use client";

import { AuthProvider } from "@/context/AuthContext";
import { IssueProvider } from "@/context/IssueContext";
import { AnnouncementProvider } from "@/context/AnnouncementContext";
import { LanguageProvider } from "@/context/LanguageContext";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <IssueProvider>
        <AnnouncementProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AnnouncementProvider>
      </IssueProvider>
    </AuthProvider>
  );
}