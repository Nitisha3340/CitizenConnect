"use client";

import CitizenSidebar from "@/components/CitizenSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["citizen"]}>
      <div className="flex min-h-screen bg-[#0b1120]">
        {/* Sidebar */}
        <CitizenSidebar />

        {/* Main Content */}
        <div className="flex-1 p-10 text-white">
          <h1 className="text-3xl font-bold mb-8">
            Citizen Dashboard
          </h1>

          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}