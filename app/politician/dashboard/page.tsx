"use client";

import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
  return (
    <div>
      {/* Top Right Logout Button */}
      <div className="flex justify-end mb-6">
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Issues" value="245" />
        <StatCard title="Resolved" value="180" />
        <StatCard title="Pending" value="65" />
      </div>

      <div className="bg-white text-black p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">
          Recent High Priority Issues
        </h3>
        <ul className="space-y-2">
          <li>Road Damage - Ward 4</li>
          <li>Water Leakage - Sector 8</li>
          <li>Electric Failure - Block A</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}