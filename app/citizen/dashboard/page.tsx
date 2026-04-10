"use client";

import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CitizenSidebar from "@/components/CitizenSidebar";
import { useIssues, type Issue } from "@/context/IssueContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const { issues } = useIssues();
  const router = useRouter();

  const [data, setData] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
    recent: [] as Issue[]
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    const userIssues = user
      ? issues.filter((issue) => issue.email === user.email)
      : [];

    setData({
      total: userIssues.length,
      inProgress: userIssues.filter((issue) => issue.status === "In Progress").length,
      resolved: userIssues.filter((issue) => issue.status === "Resolved").length,
      recent: userIssues.slice(0, 3),
    });
  }, [issues, user]);

  function Card({ title, value }: { title: string; value: number }) {
    return (
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg hover:scale-105 transition">
        <h3 className="text-gray-400 mb-2">{title}</h3>
        <p className="text-3xl font-bold text-purple-400">{value}</p>
      </div>
    );
  }

  function Issue({ title, status }: { title: string; status: string }) {
    return (
      <div className="flex justify-between bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
        <span>{title}</span>
        <span className="text-sm text-gray-400">{status}</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      
      {/* Sidebar */}
      <CitizenSidebar />

      {/* Main Content */}
      <div className="flex-1 p-8">
        
        {/* Header */}
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

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card title="Total Issues" value={data.total} />
          <Card title="In Progress" value={data.inProgress} />
          <Card title="Resolved" value={data.resolved} />
        </div>

        {/* Recent Issues */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-lg">
          <h2 className="text-xl font-semibold mb-4">
            Recent Issues
          </h2>

          <div className="space-y-4">
            {data.recent.map((issue: any) => (
              <Issue
                key={issue.id}
                title={issue.title}
                status={issue.status}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}