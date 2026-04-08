"use client";

import { useTheme } from "@/context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();

  const themeColors: Record<string, { label: string; emoji: string }> = {
    default: { label: "Indigo", emoji: "🎨" },
    ocean: { label: "Ocean Blue", emoji: "🌊" },
    sunset: { label: "Orange", emoji: "🌅" },
    forest: { label: "Green", emoji: "🌲" },
    midnight: { label: "Slate", emoji: "🌙" },
    pastel: { label: "Pastel", emoji: "✨" },
  };

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value as any)}
      className="rounded-md px-3 py-2 text-sm bg-white text-black border border-gray-300 cursor-pointer hover:bg-gray-100 transition"
      style={{ maxHeight: "40px" }}
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {themeColors[t].emoji} {themeColors[t].label}
        </option>
      ))}
    </select>
  );
}
