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
        return <ProfileSettings />;
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
        return <ProfileSettings />;
    }
  };

  return (
    <div className="p-10 w-full">
      <h1 className="text-3xl font-bold text-white mb-8">
        Advanced Settings
      </h1>

      <div className="flex flex-wrap gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-md transition ${
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