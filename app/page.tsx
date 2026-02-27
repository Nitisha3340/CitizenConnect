"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function HomePage() {
  const { logout } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-[#0b1120] text-white overflow-x-hidden">

      {/* ================= NAVBAR ================= */}
      <div className="sticky top-0 z-50 bg-[#0b1120] border-b border-white/10">
  <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-5">
          <div
  className="flex items-center gap-3 cursor-pointer"
  onClick={() => router.push("/")}
>
  <Image
    src="/logo.png"
    alt="CitizenConnect Logo"
    width={62}
    height={62}
    className="object-contain drop-shadow-lg-[0_0_12px_rgba(255,255,255,0.5)] w-[62px] h-[62px]"
  />
  <span className="text-2xl font-bold tracking-wide">
    CitizenConnect
  </span>
</div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => router.push("/login")}
              className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
            >
              {t("login")}
            </button>

            <button
              onClick={logout}
              className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:opacity-90 transition"
            >
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

      {/* ================= HERO ================= */}
      <section className="relative flex flex-col items-center justify-center text-center pt-24 pb-20 px-6 overflow-hidden">

        {/* Glow Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.15),transparent_40%)]" />

        <div className="relative z-10 max-w-4xl mx-auto">

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-6 leading-tight"
          >
            {t("whereVoicesMatter")}
            <br />
            {t("whereLeadershipListens")}
          </motion.h2>

          {/* Live Issue Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mx-auto w-fit bg-white/5 border border-white/10 px-8 py-3 rounded-full text-sm text-gray-300"
          >
            {t("liveTicker")}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="mt-10 text-gray-500 text-sm"
          >
            {t("scrollToExplore")}
          </motion.div>

          {/* ================= ROLE CARDS ================= */}
          <div className="grid md:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto">

            <Link href="/citizen/dashboard"
              className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 
                         hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] 
                         transition duration-300 text-center">
              <h3 className="text-lg font-semibold mb-2">{t("citizenPanel")}</h3>
              <p className="text-sm text-gray-400">
                Report and track civic issues.
              </p>
            </Link>

            <Link href="/politician/dashboard"
              className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 
                         hover:scale-105 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] 
                         transition duration-300 text-center">
              <h3 className="text-lg font-semibold mb-2">{t("politicianPanel")}</h3>
              <p className="text-sm text-gray-400">
                Respond and manage issues.
              </p>
            </Link>

            <Link href="/admin/dashboard"
              className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 
                         hover:scale-105 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] 
                         transition duration-300 text-center">
              <h3 className="text-lg font-semibold mb-2">{t("adminPanel")}</h3>
              <p className="text-sm text-gray-400">
                Platform oversight and control.
              </p>
            </Link>

            <Link href="/moderator/dashboard"
              className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 
                         hover:scale-105 hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] 
                         transition duration-300 text-center">
              <h3 className="text-lg font-semibold mb-2">{t("moderatorPanel")}</h3>
              <p className="text-sm text-gray-400">
                Review and verify submissions.
              </p>
            </Link>

          </div>

        </div>
      </section>

      {/* ================= IMPACT STATS ================= */}
      <section className="py-24 px-6">

        <h2 className="text-4xl font-bold text-center mb-16">
          {t("platformImpact")}
        </h2>

        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto text-center">

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10 hover:scale-105 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-5xl font-bold text-purple-400">
              <CountUp end={1284} duration={2} />+
            </h3>
            <p className="mt-4 text-gray-400 text-lg">
              {t("issuesReported")}
            </p>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10 hover:scale-105 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-5xl font-bold text-green-400">
              <CountUp end={87} duration={2} />%
            </h3>
            <p className="mt-4 text-gray-400 text-lg">
              {t("resolutionRate")}
            </p>
          </motion.div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md p-10 rounded-2xl border border-white/10 hover:scale-105 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-5xl font-bold text-yellow-400">
              <CountUp end={24} duration={2} />h
            </h3>
            <p className="mt-4 text-gray-400 text-lg">
              {t("avgResponseTime")}
            </p>
          </motion.div>

        </div>
      </section>
      {/* ================= INDIA DEVELOPMENTS ================= */}
<section className="py-24 px-6">

  <h2 className="text-4xl font-bold text-center mb-4">
    India's Latest Major Developments
  </h2>

  <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
    Highlighting progress across education, healthcare, sanitation, and infrastructure.
  </p>

  <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">

    {/* Card 1 */}
    <div className="relative group rounded-2xl overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1588072432836-e10032774350"
        alt="Education development"
        className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute bottom-6 left-6 right-6 z-10">
        <span className="text-sm text-purple-400 font-semibold">
          Education
        </span>
        <h3 className="text-xl font-bold mt-2">
          Digital Smart Classrooms Expansion
        </h3>
        <p className="text-gray-300 text-sm mt-2">
          Thousands of rural schools equipped with smart boards and internet access.
        </p>
      </div>
    </div>

    {/* Card 2 */}
    <div className="relative group rounded-2xl overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1584515933487-779824d29309"
        alt="Healthcare development"
        className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute bottom-6 left-6 right-6 z-10">
        <span className="text-sm text-green-400 font-semibold">
          Healthcare
        </span>
        <h3 className="text-xl font-bold mt-2">
          New AIIMS Hospitals Launched
        </h3>
        <p className="text-gray-300 text-sm mt-2">
          Strengthening medical infrastructure across multiple states.
        </p>
      </div>
    </div>

    {/* Card 3 */}
    <div className="relative group rounded-2xl overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1570129477492-45c003edd2be"
        alt="Sanitation development"
        className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute bottom-6 left-6 right-6 z-10">
        <span className="text-sm text-yellow-400 font-semibold">
          Sanitation
        </span>
        <h3 className="text-xl font-bold mt-2">
          Clean Water Supply Expansion
        </h3>
        <p className="text-gray-300 text-sm mt-2">
          Rural water pipeline coverage increased under national mission.
        </p>
      </div>
    </div>

  </div>
</section>

    </main>
  );
}