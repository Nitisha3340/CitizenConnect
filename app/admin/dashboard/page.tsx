"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-10">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400 mt-2">
            System overview & platform control
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <StatCard title="Total Users" value="1,245" color="text-purple-400" />
        <StatCard title="Active Citizens" value="1,032" color="text-blue-400" />
        <StatCard title="Moderators" value="12" color="text-green-400" />
        <StatCard title="Total Issues" value="1,284" color="text-orange-400" />
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* User Management */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            👥 User Management
          </h2>

          <div className="space-y-4 text-gray-400">
            <div className="flex justify-between">
              <span>New Registrations Today</span>
              <span className="text-white font-semibold">18</span>
            </div>

            <div className="flex justify-between">
              <span>Flagged Accounts</span>
              <span className="text-red-400 font-semibold">3</span>
            </div>

            <div className="flex justify-between">
              <span>Blocked Users</span>
              <span className="text-yellow-400 font-semibold">7</span>
            </div>
          </div>
        </div>

        {/* Issue Analytics */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            📊 Issue Analytics
          </h2>

          <div className="space-y-4 text-gray-400">
            <div className="flex justify-between">
              <span>Pending Issues</span>
              <span className="text-yellow-400 font-semibold">65</span>
            </div>

            <div className="flex justify-between">
              <span>In Progress</span>
              <span className="text-blue-400 font-semibold">39</span>
            </div>

            <div className="flex justify-between">
              <span>Resolved</span>
              <span className="text-green-400 font-semibold">1,180</span>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            ⚙ System Health
          </h2>

          <div className="space-y-4 text-gray-400">
            <div className="flex justify-between">
              <span>Server Status</span>
              <span className="text-green-400 font-semibold">Online</span>
            </div>

            <div className="flex justify-between">
              <span>Database</span>
              <span className="text-green-400 font-semibold">Connected</span>
            </div>

            <div className="flex justify-between">
              <span>Last Backup</span>
              <span className="text-white font-semibold">2 hrs ago</span>
            </div>
          </div>
        </div>

        {/* Recent Admin Activity */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-semibold mb-6">
            🕒 Recent Activity
          </h2>

          <div className="space-y-4 text-gray-400">
            <Activity text="Moderator assigned to Zone 4" />
            <Activity text="User account flagged for review" />
            <Activity text="Issue #1045 escalated" />
            <Activity text="System backup completed" />
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 border border-white/10 p-6 rounded-2xl"
    >
      <h3 className="text-gray-400">{title}</h3>
      <p className={`text-3xl font-bold mt-3 ${color}`}>
        {value}
      </p>
    </motion.div>
  );
}

function Activity({ text }: { text: string }) {
  return (
    <div className="border-l-4 border-purple-500 pl-4">
      {text}
    </div>
  );
}