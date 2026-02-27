"use client";

import { useState } from "react";

import ProfileSettings from "../components/ProfileSettings";
import OfficeSettings from "../components/OfficeSettings";
import NotificationSettings from "../components/NotificationSettings";
import SecuritySettings from "../components/SecuritySettings";
import PrivacySettings from "../components/PrivacySettings";

export default function PoliticianSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;

      case "office":
        return <OfficeSettings />;

      case "notifications":
        return <NotificationSettings />;

      case "security":
        return <SecuritySettings />;

      case "privacy":
        return <PrivacySettings />;

      default:
        return <ProfileSettings />;
    }
  };

  const tabs = [
    "profile",
    "office",
    "notifications",
    "security",
    "privacy",
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-white">
        Politician Settings
      </h2>

      <div className="flex gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md capitalize ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {renderContent()}
    </div>
  );
}