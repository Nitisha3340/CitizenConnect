"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Role, useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("citizen");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateName = (value: string) => /^[A-Z][a-zA-Z ]*$/.test(value);
  const validateEmail = (value: string) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value);

  const handleSignup = async () => {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedName) {
      setError("Name is required");
      return;
    }

    if (!validateName(normalizedName)) {
      setError("Name must start with a capital letter");
      return;
    }

    if (!normalizedEmail) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setError("Email must end with @gmail.com");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const pending = { name: normalizedName, email: normalizedEmail, password, role };
      localStorage.setItem("pendingSignup", JSON.stringify(pending));

      const res = await fetch("/api/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, purpose: "signup" }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Failed to request OTP");
      }

      if (data?.devOtp) {
        toast.success(`OTP sent (dev): ${data.devOtp}`);
      } else {
        toast.success("OTP sent. Please verify to continue.");
      }

      router.push(`/otp?email=${encodeURIComponent(normalizedEmail)}&purpose=signup`);
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.message || "Signup failed";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            CitizenConnect
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-sm text-slate-300">
            Sign up once, then use the same details to log in.
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) handleSignup();
          }}
        >
          <input
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email (@gmail.com)"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            <option value="citizen">Citizen</option>
            <option value="politician">Politician</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>

          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-300">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-cyan-300 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
