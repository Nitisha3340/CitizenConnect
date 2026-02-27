"use client";
import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

export default function PrivacySettings() {
  const [publicProfile, setPublicProfile] = useState(false);
  const [dataShare, setDataShare] = useState(false);

  return (
    <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-3xl">
      <h3 className="text-2xl font-semibold mb-6">Privacy Controls</h3>

      <Setting label="Make Profile Public" state={publicProfile} setState={setPublicProfile} />
      <Setting label="Allow Data Sharing for Analytics" state={dataShare} setState={setDataShare} />

      <button className="mt-6 bg-gray-800 text-white px-5 py-2 rounded-md">
        Download My Data (PDF)
      </button>
    </div>
  );
}

function Setting({ label, state, setState }: any) {
  return (
    <div className="flex justify-between items-center mb-6">
      <span>{label}</span>
      <ToggleSwitch enabled={state} setEnabled={setState} />
    </div>
  );
}