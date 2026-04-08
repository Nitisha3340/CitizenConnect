"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Navbar() {
  const { logout } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="sticky top-0 z-50 bg-[#0b1120] dark:bg-white border-b border-white/10 dark:border-gray-200">
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
          <span className="text-2xl font-bold tracking-wide text-white dark:text-black">
            CitizenConnect
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
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
  );
}
