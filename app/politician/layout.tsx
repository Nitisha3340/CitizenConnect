"use client";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PoliticianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["politician"]}>
      <div className="flex min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-indigo-900 to-black">
        
        {/* Sidebar */}
        <div className="w-64 bg-black text-white p-6">
          <h2 className="text-xl font-bold mb-8">Politician Panel</h2>

          <nav className="flex flex-col gap-4">
            <Link href="/politician/dashboard">Dashboard</Link>
            <Link href="/politician/issues">Manage Issues</Link>
            <Link href="/politician/analytics">Analytics</Link>
            <Link href="/politician/announcements">Announcements</Link>
            <Link href="/politician/settings">Settings</Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-x-hidden p-6 text-white md:p-10">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}