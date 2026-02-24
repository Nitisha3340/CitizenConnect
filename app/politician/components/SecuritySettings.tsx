"use client";

export default function SecuritySettings() {
  return (
    <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-4xl">
      <h3 className="text-2xl font-semibold mb-6">
        Security Settings
      </h3>

      <div className="space-y-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded-md">
          Change Password
        </button>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md">
          Enable Two-Factor Authentication
        </button>

        <button className="bg-gray-800 text-white px-4 py-2 rounded-md">
          View Login History
        </button>
      </div>
    </div>
  );
}