"use client";

import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

export default function PreferenceSettings() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <div className="bg-white text-black p-6 rounded-lg shadow-md max-w-xl">
      <h3 className="text-lg font-semibold mb-6">App Preferences</h3>

      <div className="flex justify-between items-center mb-6">
        <span>Dark Mode</span>
        <ToggleSwitch enabled={darkMode} setEnabled={setDarkMode} />
      </div>

      <div>
        <label className="block mb-2">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full border p-2 rounded-md"
        >
          <option>English</option>
          <option>Hindi</option>
        </select>
      </div>
    </div>
  );
}