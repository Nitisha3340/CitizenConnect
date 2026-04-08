"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role } from "@/context/AuthContext";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8080";

export default function LoginPage() {
  const { login, setOtpVerified } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("citizen");
  const [error, setError] = useState("");

  const validateName = (value: string) =>
    /^[A-Z][a-zA-Z ]*$/.test(value);

  const validateEmail = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value);

  const validatePassword = (value: string) => value.length >= 6;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!validateName(name)) {
      setError("Name must start with a Capital letter.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email must end with @gmail.com.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      // Trigger backend login so it can send OTP (backend is unchanged).
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          data?.message ||
          data?.error ||
          `Login failed (API ${res.status}). Check NEXT_PUBLIC_API_URL.`;
        setError(message);
        return;
      }

      // Keep local auth user for UI; token is optional depending on backend flow.
      login({ name, email, password, role });

      const token =
        data?.token || data?.accessToken || data?.data?.token || data?.authToken;
      if (token) localStorage.setItem("token", token);

      localStorage.setItem("postOtpRedirect", `/${role}/dashboard`);
      setOtpVerified(false);
      router.push("/otp-verification");
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Login failed. Unable to reach backend. Check NEXT_PUBLIC_API_URL."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-white dark:from-indigo-900 dark:via-purple-900 dark:to-black">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        CitizenConnect Login
      </h2>

      {error && (
        <p className="text-red-600 mb-4 text-sm font-medium">
          {error}
        </p>
      )}

      <input
        type="text"
        placeholder="Full Name"
        className="w-full border border-gray-300 p-2 mb-3 rounded text-black"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email (@gmail.com)"
        className="w-full border border-gray-300 p-2 mb-3 rounded text-black dark:text-white dark:bg-gray-700"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password (min 6 characters)"
        className="w-full border border-gray-300 p-2 mb-3 rounded text-black dark:text-white dark:bg-gray-700"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="w-full border border-gray-300 p-2 mb-4 rounded text-black dark:text-white dark:bg-gray-700"
        value={role}
        onChange={(e) =>
          setRole(e.target.value as Role)
        }
      >
        <option value="citizen">Citizen</option>
        <option value="politician">Politician</option>
        <option value="moderator">Moderator</option>
        <option value="admin">Admin</option>
      </select>

      <button
        onClick={handleLogin}
        disabled={isSubmitting}
        className="w-full bg-indigo-600 disabled:opacity-60 text-white py-2 rounded hover:bg-indigo-700 transition font-semibold"
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </div>
  </div>
);
}