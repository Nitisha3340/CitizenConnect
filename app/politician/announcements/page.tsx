"use client";

import { useState } from "react";

export default function AnnouncementsPage() {
  const [announcement, setAnnouncement] = useState("");

  const announcements = [
    {
      text: "Road repair completed in North Zone",
      by: "MLA Nitisha Mishra",
      date: "12 Feb 2026",
    },
    {
      text: "New water pipeline project approved",
      by: "MLA Nitisha Mishra",
      date: "18 Feb 2026",
    },
    {
      text: "Street light maintenance drive started",
      by: "MLA Nitisha Mishra",
      date: "22 Feb 2026",
    },
  ];

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-bold mb-6">
        Public Announcements
      </h2>

      {/* Scrolling Headlines */}
      <div className="bg-white text-black p-4 rounded-lg overflow-hidden relative mb-8">
        <div className="animate-marquee whitespace-nowrap">
          {announcements.map((item, index) => (
            <span key={index} className="mx-8 font-medium">
              📢 {item.text} — {item.by} ({item.date})
            </span>
          ))}
        </div>
      </div>

      {/* New Announcement Box */}
      <div className="bg-white p-6 rounded-xl text-black">
        <textarea
          placeholder="Write announcement..."
          value={announcement}
          onChange={(e) => setAnnouncement(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 placeholder-gray-400"
        />

        <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md">
          Publish Announcement
        </button>
      </div>

      {/* Tailwind Custom Animation */}
      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }

        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}