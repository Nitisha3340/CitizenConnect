"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CitizenSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/citizen/dashboard" },
    { name: "Raise Issue", href: "/citizen/raise-issue" },
    { name: "My Issues", href: "/citizen/my-issues" },
    { name: "Trending", href: "/citizen/trending" },
    { name: "Settings", href: "/citizen/settings" },
  ];

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-[#0f172a] to-[#020617] text-white p-6 flex flex-col border-r border-white/10">
      
      {/* Logo / Title */}
      <h1 className="text-2xl font-bold mb-10 text-purple-400 tracking-wide">
        CitizenConnect
      </h1>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`px-4 py-2 rounded-lg transition duration-200 flex items-center justify-between ${
                active
                  ? "bg-purple-600 text-white shadow-md"
                  : "hover:bg-white/10 text-gray-300"
              }`}
            >
              {item.name}

              {/* Active indicator */}
              {active && (
                <span className="w-2 h-2 bg-white rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer */}
      <div className="mt-auto pt-10 text-xs text-gray-500 border-t border-white/10">
        <p>Citizen Panel</p>
        <p className="mt-1">© 2026 CitizenConnect</p>
      </div>
    </aside>
  );
}