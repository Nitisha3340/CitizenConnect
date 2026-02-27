"use client";

export default function NotificationSettings() {
  return (
    <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-4xl">
      <h3 className="text-2xl font-semibold mb-6">
        Notification Settings
      </h3>

      <div className="space-y-4">
        <Toggle label="Email Notifications" />
        <Toggle label="SMS Alerts" />
        <Toggle label="Issue Escalation Alerts" />
        <Toggle label="Weekly Performance Report" />
      </div>

      <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
        Save Changes
      </button>
    </div>
  );
}

function Toggle({ label }: { label: string }) {
  return (
    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
      <span>{label}</span>
      <input type="checkbox" className="w-5 h-5" />
    </div>
  );
}