"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function HomePage() {
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#0b1120] text-white">

      {/* ================= NAVBAR ================= */}
      <div className="flex justify-between items-center px-10 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold">CitizenConnect</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
          >
            Login
          </button>

          <button
            onClick={logout}
            className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section className="flex flex-col items-center justify-center text-center mt-28 px-6">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-6"
        >
          Where Voices Matter.
          <br />
          Where Leadership Listens.
        </motion.h2>

        <p className="text-gray-400 max-w-2xl mb-10">
          A digital bridge between citizens and policymakers —
          enabling transparency, accountability, and real-time civic engagement.
        </p>

        <p className="mb-6 text-gray-500">
          Choose your role to continue
        </p>

        <div className="flex gap-6 flex-wrap justify-center">
          <Link href="/citizen/dashboard" className="bg-purple-600 px-6 py-3 rounded-lg hover:scale-105 transition">
            Citizen Panel
          </Link>
          <Link href="/politician/dashboard" className="bg-blue-600 px-6 py-3 rounded-lg hover:scale-105 transition">
            Politician Panel
          </Link>
          <Link href="/admin/dashboard" className="bg-orange-500 px-6 py-3 rounded-lg hover:scale-105 transition">
            Admin Panel
          </Link>
          <Link href="/moderator/dashboard" className="bg-green-500 px-6 py-3 rounded-lg hover:scale-105 transition">
            Moderator Panel
          </Link>
        </div>
      </section>

      {/* ================= IMPACT STATS ================= */}
      <section className="py-28 px-8">

        <h2 className="text-4xl font-bold text-center mb-20">
          Platform Impact
        </h2>

        <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto text-center">

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 p-10 rounded-2xl border border-white/10"
          >
            <h3 className="text-5xl font-bold text-purple-400">
              <CountUp end={1284} duration={2} />+
            </h3>
            <p className="mt-4 text-gray-400 text-lg">
              Issues Reported
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 p-10 rounded-2xl border border-white/10"
          >
            <h3 className="text-5xl font-bold text-green-400">
              <CountUp end={87} duration={2} />%
            </h3>
            <p className="mt-4 text-gray-400 text-lg">
              Resolution Rate
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 p-10 rounded-2xl border border-white/10"
          >
            <h3 className="text-5xl font-bold text-yellow-400">
              <CountUp end={24} duration={2} />h
            </h3>
            <p className="mt-4 text-gray-400 text-lg">
              Avg Response Time
            </p>
          </motion.div>

        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="pb-32 px-8">

        <h2 className="text-4xl font-bold text-center mb-16">
          Why CitizenConnect?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-purple-400 transition">
            <h3 className="text-xl font-semibold mb-4">🗳 Citizen Reporting</h3>
            <p className="text-gray-400">
              Submit civic concerns effortlessly and track progress transparently.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-blue-400 transition">
            <h3 className="text-xl font-semibold mb-4">🏛 Public Accountability</h3>
            <p className="text-gray-400">
              Leaders respond openly, building trust through visible governance.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-green-400 transition">
            <h3 className="text-xl font-semibold mb-4">⚡ Real-Time Updates</h3>
            <p className="text-gray-400">
              Stay updated instantly as issues move through resolution stages.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}