"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

type PendingSignup = {
  name: string;
  email: string;
  password: string;
  role: any;
};

export default function OtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { register } = useAuth();

  const emailParam = params.get("email") || "";
  const purpose = params.get("purpose") || "signup";

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  const maskedEmail = useMemo(() => {
    const [u, d] = email.split("@");
    if (!u || !d) return email;
    const head = u.slice(0, 2);
    return `${head}${"*".repeat(Math.max(0, u.length - 2))}@${d}`;
  }, [email]);

  const resend = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to resend OTP");
      if (data?.emailSent) {
        toast.success("New code sent — check your Gmail inbox.");
      } else if (data?.devOtp) {
        toast.success(`Dev — OTP: ${data.devOtp}`);
      } else {
        toast.success("OTP resent");
      }
    } catch (e: any) {
      const msg = e?.message || "Failed to resend OTP";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!otp || otp.replace(/\D/g, "").length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose, otp }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "OTP verification failed");

      if (purpose === "signup") {
        const raw = localStorage.getItem("pendingSignup");
        if (!raw) throw new Error("Signup details not found. Please sign up again.");
        const pending = JSON.parse(raw) as PendingSignup;
        await register(pending);
        localStorage.removeItem("pendingSignup");
        toast.success("Account created. Please log in.");
        router.push("/login");
        return;
      }

      toast.success("OTP verified");
      router.push("/login");
    } catch (e: any) {
      const msg = e?.message || "OTP verification failed";
      setError(msg);
      toast.error(msg);
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
          <h1 className="mt-3 text-3xl font-bold text-white">Verify OTP</h1>
          <p className="mt-2 text-sm text-slate-300">
            Enter the 6-digit code sent to <span className="font-semibold text-white">{maskedEmail}</span>.
          </p>
        </div>

        {error && (
          <p className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            inputMode="numeric"
            placeholder="6-digit OTP"
            className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 tracking-[0.4em] text-center"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, "").slice(0, 6))}
          />

          <button
            onClick={verify}
            disabled={loading}
            className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            onClick={resend}
            disabled={loading || !email}
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Resend OTP
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-300">
          Wrong email?{" "}
          <Link href="/signup" className="font-semibold text-cyan-300 hover:underline">
            Go back to Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

