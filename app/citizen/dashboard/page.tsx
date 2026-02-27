"use client";

import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      {/* Top Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome, {user?.name} 👋
          </h1>
          <p className="text-gray-400 text-sm">
            Here’s an overview of your activity.
          </p>
        </div>

        <LogoutButton />
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card title="Total Issues" value="12" />
        <Card title="In Progress" value="5" />
        <Card title="Resolved" value="7" />
      </div>

      {/* Recent Issues */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-semibold mb-4">
          Recent Issues
        </h2>

        <div className="space-y-4">
          <Issue
            title="Streetlight not working"
            status="In Progress"
          />
          <Issue
            title="Garbage collection delay"
            status="Resolved"
          />
          <Issue
            title="Water supply disruption"
            status="Pending"
          />
        </div>
      </div>
    </>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
      <h3 className="text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-purple-400">
        {value}
      </p>
    </div>
  );
}

function Issue({ title, status }: any) {
  return (
    <div className="flex justify-between bg-white/5 p-4 rounded-xl border border-white/10">
      <span>{title}</span>
      <span className="text-sm text-gray-400">
        {status}
      </span>
    </div>
  );
}