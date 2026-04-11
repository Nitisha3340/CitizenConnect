"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen w-full overflow-x-hidden bg-[#0b1120] p-6 text-white md:p-10">
        {children}
      </div>
    </ProtectedRoute>
  );
}
