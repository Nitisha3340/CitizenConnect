"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Theme = "default" | "ocean" | "sunset" | "forest" | "midnight" | "pastel";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextProps | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("default");
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme && ["default", "ocean", "sunset", "forest", "midnight", "pastel"].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (isClient) {
      localStorage.setItem("theme", newTheme);
    }
  };

  const themes: Theme[] = ["default", "ocean", "sunset", "forest", "midnight", "pastel"];

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
