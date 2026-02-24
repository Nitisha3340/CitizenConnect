"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function PoliticianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const { logout } = useAuth();
  return (
    <ProtectedRoute allowedRoles={["politician"]}>
      <div className="flex min-h-screen bg-gradient-to-br from-indigo-900 to-black">
        
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
        <div className="flex-1 p-10 text-white">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}