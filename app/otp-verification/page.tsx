"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function OTPVerificationPage() {
  const router = useRouter();
  const { user, setOtpVerified } = useAuth();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string>("");
  const [info, setInfo] = useState<string>("");

  const email = useMemo(() => user?.email || "", [user?.email]);
  const [demoOtp, setDemoOtp] = useState<string>("");

  useEffect(() => {
    if (!email) router.replace("/login");
  }, [email, router]);

  useEffect(() => {
    // Frontend-only OTP: show current OTP to user (since no backend/email).
    const storedEmail = localStorage.getItem("otpEmail");
    const storedOtp = localStorage.getItem("otpCode");
    if (storedEmail && storedEmail === email && storedOtp) setDemoOtp(storedOtp);
  }, [email]);

  const redirectAfterOtp = () => {
    const redirectTo = localStorage.getItem("postOtpRedirect");
    localStorage.removeItem("postOtpRedirect");
    router.replace(redirectTo || (user ? `/${user.role}/dashboard` : "/login"));
  };

  const handleVerify = () => {
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setError("");
    setInfo("");

    const expectedEmail = localStorage.getItem("otpEmail");
    const expectedOtp = localStorage.getItem("otpCode");
    const issuedAt = Number(localStorage.getItem("otpIssuedAt") || "0");
    const isExpired = issuedAt ? Date.now() - issuedAt > 5 * 60 * 1000 : false;

    if (!expectedEmail || expectedEmail !== email || !expectedOtp) {
      setError("OTP session not found. Please login again.");
      return;
    }
    if (isExpired) {
      setError("OTP expired. Please resend OTP.");
      return;
    }
    if (otp !== expectedOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    localStorage.removeItem("otpCode");
    localStorage.removeItem("otpIssuedAt");
    setOtpVerified(true);
    redirectAfterOtp();
  };

  const handleResend = () => {
    setError("");
    setInfo("");

    const expectedEmail = localStorage.getItem("otpEmail");
    if (!expectedEmail || expectedEmail !== email) {
      setError("OTP session not found. Please login again.");
      return;
    }

    const newOtp = generateOtp();
    localStorage.setItem("otpCode", newOtp);
    localStorage.setItem("otpIssuedAt", String(Date.now()));
    setDemoOtp(newOtp);
    setInfo("A new OTP was generated.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-white dark:from-indigo-900 dark:via-purple-900 dark:to-black">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800 dark:text-white">
          OTP Verification
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
          Enter the 6-digit OTP for <span className="font-semibold">{email}</span>.
        </p>

        {!!demoOtp && (
          <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-900 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-100">
            Demo OTP: <span className="font-mono font-semibold">{demoOtp}</span>
          </div>
        )}

        {error && (
          <p className="text-red-600 mb-4 text-sm font-medium">
            {error}
          </p>
        )}

        {info && (
          <p className="text-green-700 mb-4 text-sm font-medium">
            {info}
          </p>
        )}

        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Enter OTP"
          className="w-full border border-gray-300 p-2 mb-4 rounded text-black dark:text-white dark:bg-gray-700"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
        />

        <button
          onClick={handleVerify}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold mb-3"
        >
          Verify OTP
        </button>

        <button
          onClick={handleResend}
          className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition font-semibold"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}

