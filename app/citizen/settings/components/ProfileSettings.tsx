"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { ZONES, type Zone } from "@/app/api/storage";

export default function ProfileSettings({ setError }: { setError: (error: string) => void }) {
  const { user, updateProfile, requestEmailChange } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [zone, setZone] = useState<Zone>(user?.zone || "North Zone");
  const [password, setPassword] = useState(user?.password || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setZone(user.zone);
      setPassword(user.password);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      setError("You must be signed in to update your profile.");
      return;
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      setError("Name required");
      return;
    }

    if (!normalizedEmail) {
      setError("Email required");
      return;
    }

    if (!password) {
      setError("Password required");
      return;
    }

    setError("");
    setSaving(true);

    try {
      const hasEmailChanged = normalizedEmail !== user.email.toLowerCase();

      if (hasEmailChanged) {
        await requestEmailChange(normalizedEmail, {
          name: normalizedName,
          password,
          zone,
        });

        toast.success("OTP sent to verify the new email address.");
        router.push(`/otp?email=${encodeURIComponent(normalizedEmail)}&purpose=email-update`);
        return;
      }

      await updateProfile({
        name: normalizedName,
        password,
        zone,
      });

      toast.success("Profile updated successfully");
    } catch (error: any) {
      const message = error?.message || "Failed to update profile";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-lg max-w-3xl backdrop-blur-xl">
      <h3 className="text-2xl font-semibold mb-6 text-white">Profile & Account</h3>

      <div className="grid gap-6 md:grid-cols-2">
        <Input label="Full Name" value={name} onChange={setName} />
        <Input label="Email" value={email} onChange={setEmail} type="email" />
        <Input label="Password" value={password} onChange={setPassword} type="password" />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-200">Zone</label>
          <select
            value={zone}
            onChange={(e) => setZone(e.target.value as Zone)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          >
            {ZONES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-slate-950/40 p-5 text-sm text-slate-300 md:grid-cols-3">
        <Stat label="Role" value={user?.role || "-"} />
        <Stat label="Zone" value={user?.zone || "-"} />
        <Stat label="Email" value={user?.email || "-"} />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-200">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
      />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">{label}</p>
      <p className="mt-2 text-base font-semibold text-white">{value}</p>
    </div>
  );
}
