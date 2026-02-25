"use client";

import { useState, useMemo } from "react";
import { useAnnouncements } from "@/context/AnnouncementContext";

export default function AnnouncementsPage() {
  const { addAnnouncement, announcements } = useAnnouncements();
  const [text, setText] = useState("");

  // Default fallback announcements (only if no custom ones exist)
  const defaultAnnouncements = [
    {
      id: 1,
      message: "Road repair completed in North Zone",
      author: "MLA Nitisha Mishra",
      date: "12 Feb 2026",
    },
    {
      id: 2,
      message: "New water pipeline project approved",
      author: "MLA Nitisha Mishra",
      date: "18 Feb 2026",
    },
    {
      id: 3,
      message: "Street light maintenance drive started",
      author: "MLA Nitisha Mishra",
      date: "22 Feb 2026",
    },
  ];

  const handlePublish = () => {
    if (!text.trim()) return;

    addAnnouncement({
      id: Date.now(),
      message: text,
      author: "MLA Nitisha Mishra",
    });

    setText("");
  };

  // Format announcements for marquee
  const marqueeAnnouncements = useMemo(() => {
    const formattedCustom = announcements.map((item) => ({
      id: item.id,
      message: item.message,
      author: item.author,
      date: new Date(item.id).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    // If user-added announcements exist, show them first
    return formattedCustom.length > 0
      ? formattedCustom
      : defaultAnnouncements;
  }, [announcements]);

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-bold mb-6">
        Public Announcements
      </h2>

      {/* 🔥 Scrolling Headlines */}
      <div className="bg-white text-black p-4 rounded-lg overflow-hidden relative mb-8">
        <div className="animate-marquee whitespace-nowrap">
          {marqueeAnnouncements.map((item) => (
            <span key={item.id} className="mx-8 font-medium">
              📢 {item.message} — {item.author} ({item.date})
            </span>
          ))}
        </div>
      </div>

      {/* ✍ New Announcement Box */}
      <div className="bg-white p-6 rounded-xl text-black shadow-lg">
        <textarea
          placeholder="Write announcement..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handlePublish}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2 rounded-md"
        >
          Publish Announcement
        </button>
      </div>

      {/* 🎞 Tailwind Custom Animation */}
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
    </div>
  );
}