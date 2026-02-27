"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language =
  | "en"
  | "hi"
  | "es"
  | "fr"
  | "zh"
  | "ar"
  | "ru"
  | "pt"
  | "de"
  | "ja";

// minimal translations for each language; fallback to English for unspecified keys
const translations: Record<Language, Record<string, string>> = {
  en: {
    login: "Login",
    logout: "Logout",
    citizenPanel: "Citizen Panel",
    politicianPanel: "Politician Panel",
    adminPanel: "Admin Panel",
    moderatorPanel: "Moderator Panel",
    issuesReported: "Issues Reported",
    resolutionRate: "Resolution Rate",
    avgResponseTime: "Avg Response Time",
    whereVoicesMatter: "Where Voices Matter.",
    whereLeadershipListens: "Where Leadership Listens.",
    platformImpact: "Platform Impact",
    scrollToExplore: "↓ Scroll to explore",
    liveTicker: "🟢 Road repair – In Progress • 🔴 Water supply – Pending • 🟣 Streetlight fixed – Resolved",
  },
  hi: {
    login: "लॉगिन",
    logout: "लॉगआउट",
    citizenPanel: "नागरिक पैनल",
    politicianPanel: "राजनेता पैनल",
    adminPanel: " prashasan पैनल",
    moderatorPanel: "मॉडरेटर पैनल",
    issuesReported: "रिपोर्ट की गई समस्याएं",
    resolutionRate: "समाधान दर",
    avgResponseTime: "औसत प्रतिक्रिया समय",
    whereVoicesMatter: "जहाँ आवाज़ मायने रखती है।",
    whereLeadershipListens: "जहाँ नेतृत्व सुनता है।",
    platformImpact: "प्लेटफ़ॉर्म प्रभाव",
    scrollToExplore: "↓ अन्वेषण करने के लिए स्क्रॉल करें",
    liveTicker: "🟢 सड़क मरम्मत – चल रही है • 🔴 जल आपूर्ति – लंबित • 🟣 स्ट्रीटलाइट ठीक – समाधान",
  },
  es: {
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    citizenPanel: "Panel de Ciudadano",
    politicianPanel: "Panel de Político",
    adminPanel: "Panel de Administrador",
    moderatorPanel: "Panel de Moderador",
    issuesReported: "Problemas Informados",
    resolutionRate: "Tasa de Resolución",
    avgResponseTime: "Tiempo de Respuesta Promedio",
    whereVoicesMatter: "Donde las voces importan.",
    whereLeadershipListens: "Donde el liderazgo escucha.",
    platformImpact: "Impacto de la Plataforma",
    scrollToExplore: "↓ Desplázate para explorar",
    liveTicker: "🟢 Reparación de carretera – En progreso • 🔴 Suministro de agua – Pendiente • 🟣 Farola arreglada – Resuelto",
  },
  fr: {
    login: "Connexion",
    logout: "Déconnexion",
    citizenPanel: "Panneau Citoyen",
    politicianPanel: "Panneau Politicien",
    adminPanel: "Panneau Administrateur",
    moderatorPanel: "Panneau Modérateur",
    issuesReported: "Problèmes signalés",
    resolutionRate: "Taux de résolution",
    avgResponseTime: "Temps de réponse moyen",
    whereVoicesMatter: "Où les voix comptent.",
    whereLeadershipListens: "Où le leadership écoute.",
    platformImpact: "Impact de la plateforme",
    scrollToExplore: "↓ Faites défiler pour explorer",
    liveTicker: "🟢 Réparation de la route – En cours • 🔴 Approvisionnement en eau – En attente • 🟣 Lampadaire réparé – Résolu",
  },
  zh: {
    login: "登录",
    logout: "登出",
    citizenPanel: "市民面板",
    politicianPanel: "政治家面板",
    adminPanel: "管理员面板",
    moderatorPanel: "版主面板",
    issuesReported: "报告的问题",
    resolutionRate: "解决率",
    avgResponseTime: "平均响应时间",
    whereVoicesMatter: "声音重要的地方。",
    whereLeadershipListens: "领导倾听的地方。",
    platformImpact: "平台影响",
    scrollToExplore: "↓ 向下滚动以探索",
    liveTicker: "🟢 道路维修 – 进行中 • 🔴 供水 – 待定 • 🟣 街灯修复 – 已解决",
  },
  ar: {
    login: "تسجيل الدخول",
    logout: "تسجيل الخروج",
    citizenPanel: "لوحة المواطن",
    politicianPanel: "لوحة السياسي",
    adminPanel: "لوحة المسؤول",
    moderatorPanel: "لوحة المشرف",
    issuesReported: "المشكلات المبلغ عنها",
    resolutionRate: "معدل الحل",
    avgResponseTime: "متوسط وقت الاستجابة",
    whereVoicesMatter: "حيث تصنع الأصوات فرقًا.",
    whereLeadershipListens: "حيث القيادة تستمع.",
    platformImpact: "تأثير المنصة",
    scrollToExplore: "↓ قم بالتمرير للاستكشاف",
    liveTicker: "🟢 إصلاح الطريق – جارٍ • 🔴 إمدادات المياه – معلق • 🟣 إصلاح عمود الإنارة – تم حلها",
  },
  ru: {
    login: "Войти",
    logout: "Выйти",
    citizenPanel: "Панель гражданина",
    politicianPanel: "Панель политика",
    adminPanel: "Панель администратора",
    moderatorPanel: "Панель модератора",
    issuesReported: "Сообщенные проблемы",
    resolutionRate: "Уровень разрешения",
    avgResponseTime: "Среднее время ответа",
    whereVoicesMatter: "Там, где голоса важны.",
    whereLeadershipListens: "Там, где руководство слушает.",
    platformImpact: "Влияние платформы",
    scrollToExplore: "↓ Прокрутите, чтобы исследовать",
    liveTicker: "🟢 Ремонт дороги – в процессе • 🔴 Водоснабжение – в ожидании • 🟣 Уличный фонарь починен – решено",
  },
  pt: {
    login: "Entrar",
    logout: "Sair",
    citizenPanel: "Painel do Cidadão",
    politicianPanel: "Painel do Político",
    adminPanel: "Painel do Administrador",
    moderatorPanel: "Painel do Moderador",
    issuesReported: "Problemas Reportados",
    resolutionRate: "Taxa de Resolução",
    avgResponseTime: "Tempo Médio de Resposta",
    whereVoicesMatter: "Onde as vozes importam.",
    whereLeadershipListens: "Onde a liderança escuta.",
    platformImpact: "Impacto da Plataforma",
    scrollToExplore: "↓ Role para explorar",
    liveTicker: "🟢 Reparação de estrada – Em progresso • 🔴 Abastecimento de água – Pendente • 🟣 Poste de luz consertado – Resolvido",
  },
  de: {
    login: "Anmelden",
    logout: "Abmelden",
    citizenPanel: "Bürgerpanel",
    politicianPanel: "Politikerpanel",
    adminPanel: "Admin-Panel",
    moderatorPanel: "Moderatorpanel",
    issuesReported: "Gemeldete Probleme",
    resolutionRate: "Lösungsrate",
    avgResponseTime: "Durchschnittliche Antwortzeit",
    whereVoicesMatter: "Wo Stimmen zählen.",
    whereLeadershipListens: "Wo Führung zuhört.",
    platformImpact: "Plattformauswirkung",
    scrollToExplore: "↓ Scrollen zum Erkunden",
    liveTicker: "🟢 Straßenreparatur – In Arbeit • 🔴 Wasserversorgung – Ausstehend • 🟣 Straßenlampe repariert – Gelöst",
  },
  ja: {
    login: "ログイン",
    logout: "ログアウト",
    citizenPanel: "市民パネル",
    politicianPanel: "政治家パネル",
    adminPanel: "管理者パネル",
    moderatorPanel: "モデレーターパネル",
    issuesReported: "報告された問題",
    resolutionRate: "解決率",
    avgResponseTime: "平均応答時間",
    whereVoicesMatter: "声が届く場所。",
    whereLeadershipListens: "リーダーシップが聴く場所。",
    platformImpact: "プラットフォームの影響",
    scrollToExplore: "↓ 探索するためにスクロール",
    liveTicker: "🟢 道路修理 – 進行中 • 🔴 給水 – 保留中 • 🟣 街灯修理 – 解決済み",
  },
};

interface LanguageContextProps {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps>({
  lang: "en",
  setLang: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    // Load language from localStorage on mount
    const savedLang = localStorage.getItem("language") as Language | null;
    if (savedLang && (["en", "hi", "es", "fr", "zh", "ar", "ru", "pt", "de", "ja"] as Language[]).includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    if (isClient) {
      localStorage.setItem("language", newLang);
    }
  };

  const t = (key: string) => {
    return translations[lang]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
