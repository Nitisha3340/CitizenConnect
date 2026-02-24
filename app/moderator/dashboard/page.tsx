"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function ModeratorDashboard() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-10">

      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Moderator Dashboard</h1>

        <button
          onClick={logout}
          className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <StatCard title="Assigned Issues" value="48" />
        <StatCard title="Resolved Today" value="9" />
        <StatCard title="Pending Review" value="14" />
      </div>

      {/* Issue Review Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-6">Recent Flagged Issues</h2>

        <div className="space-y-4">

          <IssueCard title="Illegal Parking Complaint" status="Pending Review" />
          <IssueCard title="Water Supply Disruption" status="In Progress" />
          <IssueCard title="Road Construction Delay" status="Escalated" />

        </div>
      </div>

    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-4xl font-bold mt-3 text-green-400">{value}</p>
    </div>
  );
}

function IssueCard({ title, status }: { title: string; status: string }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex justify-between">
      <span>{title}</span>
      <span className="text-gray-400">{status}</span>
    </div>
  );
}