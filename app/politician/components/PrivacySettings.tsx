"use client";

export default function PrivacySettings() {
  return (
    <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-4xl">
      <h3 className="text-2xl font-semibold mb-6">
        Privacy Settings
      </h3>

      <div className="space-y-4">
        <Toggle label="Make Profile Public" />
        <Toggle label="Show Contact Details Publicly" />
        <Toggle label="Allow Citizens to Message Directly" />
      </div>
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