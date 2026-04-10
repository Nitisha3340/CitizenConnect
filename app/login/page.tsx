"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("citizen");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateName = (value: string) =>
    /^[A-Z][a-zA-Z ]*$/.test(value);

  const validateEmail = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value);

  const handleLogin = async () => {

    // ✅ VALIDATION
    if (!name) {
      setError("Name is required");
      return;
    }

    if (!validateName(name)) {
      setError("Name must start with capital letter");
      return;
    }

    if (!email) {
      setError("Email required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Email must end with @gmail.com");
      return;
    }

    if (!password) {
      setError("Password required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login({
        name,
        email,
        password,
        role
      });

      toast.success("Login successful");

      if (role === "admin") router.push("/admin/dashboard");
      else if (role === "moderator") router.push("/moderator/dashboard");
      else if (role === "politician") router.push("/politician/dashboard");
      else router.push("/citizen/dashboard");

    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please sign up first, then log in.";
      setError(message);
      toast.error(message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-96">

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          CitizenConnect Login
        </h2>

        {/* ✅ ERROR MESSAGE */}
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
          className="w-full border border-gray-300 p-2 mb-3 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* ✅ PASSWORD FIELD ADDED */}
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-2 mb-3 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full border border-gray-300 p-2 mb-4 rounded text-black"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="citizen">Citizen</option>
          <option value="politician">Politician</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
        </select>

        {/* ✅ BUTTON WITH LOADING */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200 font-semibold hover:opacity-90"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link href="/signup" className="font-semibold text-indigo-600 hover:underline">
            Sign up first
          </Link>
        </p>

      </div>
    </div>
  );
}