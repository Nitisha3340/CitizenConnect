"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type Role, useAuth } from "@/context/AuthContext";
import { savePendingSignup, ZONES } from "@/app/api/storage";
import Link from "next/link";
import { toast } from "react-hot-toast";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "citizen" as Role,
  zone: ZONES[0] ?? "North Zone",
};

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const signupPayload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        zone: form.zone,
      };

      savePendingSignup(signupPayload);

      const res = await fetch("/api/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, purpose: "signup" }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Failed to request OTP");
      }

      if (data?.emailSent) {
        toast.success("OTP sent to your email.");
      } else {
        const devOtp = typeof data?.devOtp === "string" ? data.devOtp : "";
        if (!devOtp) {
          throw new Error("Unable to continue signup. Please configure SMTP or try again.");
        }

        const verifyRes = await fetch("/api/otp/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: form.email, purpose: "signup", otp: devOtp }),
        });

        const verifyData = await verifyRes.json().catch(() => ({}));
        if (!verifyRes.ok) {
          throw new Error(verifyData?.message || "OTP verification failed");
        }

        await register(signupPayload);
        savePendingSignup(null);
        toast.success("Account created. Please log in.");
        router.push("/login");
        return;
      }

      router.push(`/otp?email=${encodeURIComponent(form.email)}&purpose=signup`);
    } catch (error) {
      savePendingSignup(null);
      toast.error(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#0c1624] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#15304f_0%,transparent_42%),linear-gradient(180deg,#0f1c2d_0%,#08111b_100%)]" />
      <main className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/10 bg-[#101b2d] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <section className="flex flex-col justify-between gap-10 border-b border-white/10 bg-[#0f1b2b] px-8 py-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">CitizenConnect</p>
                <h1 className="mt-4 max-w-md text-4xl font-bold leading-tight text-white sm:text-5xl">
                  Create your account and join your civic zone.
                </h1>
                <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300 sm:text-base">
                  Register as a citizen, politician, moderator, or admin. Your zone keeps updates and issues local to your area.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Secure signup</p>
                  <p className="mt-2 text-sm text-slate-200">OTP verification protects every new account.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Zone aware</p>
                  <p className="mt-2 text-sm text-slate-200">Each report and announcement stays within the selected zone.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#f7f9fc] px-6 py-8 text-slate-900 sm:px-8 sm:py-10">
              <div className="mx-auto max-w-md">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-slate-900">Sign up</h2>
                  <p className="mt-2 text-sm text-slate-600">Fill in your details to create a CitizenConnect account.</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-1 block text-sm font-semibold text-slate-700">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={onChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={onChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500"
                      placeholder="name@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-1 block text-sm font-semibold text-slate-700">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={form.password}
                      onChange={onChange}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500"
                      placeholder="Create a password"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="role" className="mb-1 block text-sm font-semibold text-slate-700">
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={form.role}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="politician">Politician</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="zone" className="mb-1 block text-sm font-semibold text-slate-700">
                        Zone
                      </label>
                      <select
                        id="zone"
                        name="zone"
                        value={form.zone}
                        onChange={onChange}
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-500"
                      >
                        {ZONES.map((zone) => (
                          <option key={zone} value={zone}>
                            {zone}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-[#0f6e8c] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0b5a73] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link href="/login" className="font-semibold text-cyan-700 hover:text-cyan-900">
                    Sign in
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
