"use client";

import { IssueProvider } from "@/context/IssueContext";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <IssueProvider>
        {children}
      </IssueProvider>
    </AuthProvider>
  );
}