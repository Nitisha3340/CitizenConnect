"use client";

import { useAuth } from "@/context/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";
import API from "@/app/api/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [data, setData] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
    recent: []
  });

  // 🔐 Route protection
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
  }, []);

  // 📊 Fetch dashboard data
  useEffect(() => {
    API.get("/complaints/my")
      .then((res: any) => {
        const issues = res.data;

        setData({
          total: issues.length,
          inProgress: issues.filter((i: any) => i.status === "IN_PROGRESS").length,
          resolved: issues.filter((i: any) => i.status === "RESOLVED").length,
          recent: issues.slice(0, 3)
        });
      });
  }, []);

  function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:scale-105 transition duration-300">
      <h3 className="text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-purple-400">
        {value}
      </p>
    </div>
  );
}
function Issue({ title, status }: { title: string; status: string }) {
  return (
    <div className="flex justify-between bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition">
      <span>{title}</span>
      <span className="text-sm text-gray-400">
        {status}
      </span>
    </div>
  );
}

  return (
    <>
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

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <Card title="Total Issues" value={data.total} />
        <Card title="In Progress" value={data.inProgress} />
        <Card title="Resolved" value={data.resolved} />
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
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
    </>
  );
}