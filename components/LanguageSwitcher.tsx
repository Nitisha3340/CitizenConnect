"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
      className="rounded-md px-2 py-1 text-sm"
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="zh">中文</option>
      <option value="ar">العربية</option>
      <option value="ru">Русский</option>
      <option value="pt">Português</option>
      <option value="de">Deutsch</option>
      <option value="ja">日本語</option>
    </select>
  );
}
