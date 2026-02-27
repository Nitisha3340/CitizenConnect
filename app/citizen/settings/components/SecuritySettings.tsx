"use client";
import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

export default function SecuritySettings() {
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-3xl">
      <h3 className="text-2xl font-semibold mb-6">Security & Authentication</h3>

      <div className="flex justify-between items-center mb-6">
        <span>Enable Two-Factor Authentication</span>
        <ToggleSwitch enabled={twoFA} setEnabled={setTwoFA} />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h4 className="font-semibold mb-2">Active Sessions</h4>
        <p>Windows - Chrome - Active Now</p>
        <p>Android - Logged in 2 days ago</p>
      </div>

      <button className="bg-red-600 text-white px-5 py-2 rounded-md">
        Logout From All Devices
      </button>
    </div>
  );
}