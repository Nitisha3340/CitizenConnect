"use client";

import type { Issue } from "@/context/IssueContext";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = ["#22d3ee", "#f59e0b", "#10b981", "#f43f5e", "#8b5cf6", "#3b82f6"];

export default function IssueCharts({ issues }: { issues: Issue[] }) {
  const statusData = [
    { name: "Pending", value: issues.filter((issue) => issue.status === "Pending").length },
    { name: "In Progress", value: issues.filter((issue) => issue.status === "In Progress").length },
    { name: "Resolved", value: issues.filter((issue) => issue.status === "Resolved").length },
  ];

  const severityData = [
    { name: "Low", value: issues.filter((issue) => issue.severity === "Low").length },
    { name: "Medium", value: issues.filter((issue) => issue.severity === "Medium").length },
    { name: "High", value: issues.filter((issue) => issue.severity === "High").length },
  ];

  const monthlyData = aggregateMonthlyIssues(issues);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ChartCard title="Status Breakdown">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={92} paddingAngle={4}>
              {statusData.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Severity Breakdown">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={severityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#22d3ee" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Monthly Trend">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#cbd5e1" />
            <YAxis stroke="#cbd5e1" allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="issues" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg lg:col-span-1">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function aggregateMonthlyIssues(issues: Issue[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const buckets = new Map<string, number>();

  issues.forEach((issue) => {
    const month = months[new Date(issue.createdAt).getMonth()] || "Jan";
    buckets.set(month, (buckets.get(month) || 0) + 1);
  });

  return months.slice(0, 12).map((month) => ({
    month,
    issues: buckets.get(month) || 0,
  }));
}
