"use client";

import { AuthProvider } from "@/context/AuthContext";
import { IssueProvider } from "@/context/IssueContext";
import { AnnouncementProvider } from "@/context/AnnouncementContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <IssueProvider>
          <AnnouncementProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </AnnouncementProvider>
        </IssueProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}