"use client";

import { useState } from "react";

import ProfileSettings from "./components/ProfileSettings";
import NotificationSettings from "./components/NotificationSettings";
import SecuritySettings from "./components/SecuritySettings";
import PrivacySettings from "./components/PrivacySettings";
import PreferenceSettings from "./components/PreferenceSettings";
import AdvancedSettings from "./components/AdvancedSettings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [error, setError] = useState("");
  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "privacy", label: "Privacy" },
    { id: "preferences", label: "Preferences" },
    { id: "advanced", label: "Advanced" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings setError={setError}/>;
      case "notifications":
        return <NotificationSettings />;
      case "security":
        return <SecuritySettings />;
      case "privacy":
        return <PrivacySettings />;
      case "preferences":
        return <PreferenceSettings />;
      case "advanced":
        return <AdvancedSettings />;
      default:
        return <ProfileSettings setError={setError}/>;
    }
  };

  return (
    <div className="p-10 w-full">
      <h1 className="mb-3 text-3xl font-bold text-white">
        Citizen Settings
      </h1>
      <p className="mb-8 text-sm text-slate-300">Update your profile, zone, and account security from one place.</p>
        
         {/* ✅ SHOW ERROR HERE */}
      {error && (
        <p className="text-red-500 mb-4 font-medium">
          {error}
        </p>
      )}
      

      <div className="flex flex-wrap gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-md hover:opacity-90 transition duration-200 ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}