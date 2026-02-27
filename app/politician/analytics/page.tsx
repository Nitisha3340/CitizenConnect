"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const issueData = [
  { month: "Jan", solved: 40 },
  { month: "Feb", solved: 65 },
  { month: "Mar", solved: 80 },
  { month: "Apr", solved: 95 },
];

const surveyData = [
  { month: "Jan", rating: 3.8 },
  { month: "Feb", rating: 4.2 },
  { month: "Mar", rating: 4.5 },
  { month: "Apr", rating: 4.7 },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-bold mb-8">Analytics</h2>

      <div className="grid grid-cols-2 gap-8">

        {/* Issues Solved Chart */}
        <div className="bg-white text-black p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Issues Solved Per Month
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="solved" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Survey Satisfaction Chart */}
        <div className="bg-white text-black p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Post-Resolution Survey Rating
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={surveyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#10B981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}