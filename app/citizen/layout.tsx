"use client";

import CitizenSidebar from "@/components/CitizenSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAnnouncements } from "@/context/AnnouncementContext";
import { useMemo } from "react";

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { announcements } = useAnnouncements();

  const defaultAnnouncements = [
    {
      id: 1,
      message: "Road repair completed in North Zone",
      author: "MLA Ravi Kumar",
      date: "12 Feb 2026",
    },
  ];

  const marqueeAnnouncements = useMemo(() => {
    const formatted = announcements.map((item) => ({
      id: item.id,
      message: item.message,
      author: item.author,
      date: new Date(item.id).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    return formatted.length > 0 ? formatted : defaultAnnouncements;
  }, [announcements]);

  return (
    <ProtectedRoute allowedRoles={["citizen"]}>
      <div className="flex min-h-screen bg-[#0b1120]">
        {/* Sidebar */}
        <CitizenSidebar />

        {/* Main Content */}
        <div className="flex-1 p-10 text-white">
          
          {/* 🔥 Global Announcement Scroll */}
          <div className="bg-white text-black p-3 rounded-lg overflow-hidden relative mb-6">
            <div className="animate-marquee whitespace-nowrap">
              {marqueeAnnouncements.map((item) => (
                <span key={item.id} className="mx-8 font-medium">
                  📢 {item.message} — {item.author} ({item.date})
                </span>
              ))}
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-8">
            Citizen Dashboard
          </h1>

          {children}
        </div>
      </div>

      {/* 🎞 Marquee Animation */}
      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 18s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </ProtectedRoute>
  );
}