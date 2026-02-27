"use client";
import { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

export default function NotificationSettings() {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  return (
    <div className="bg-white text-black p-8 rounded-xl shadow-lg max-w-3xl">
      <h3 className="text-2xl font-semibold mb-6">Notification Controls</h3>

      <Setting label="Push Notifications" state={push} setState={setPush} />
      <Setting label="Email Updates" state={email} setState={setEmail} />
      <Setting label="SMS Alerts" state={sms} setState={setSms} />
      <Setting label="Weekly Performance Report" state={weeklyReport} setState={setWeeklyReport} />
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