"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export type Role =
  | "admin"
  | "moderator"
  | "citizen"
  | "politician";

type User = {
  id: string;        // ✅ Added unique ID
  name: string;
  email: string;
  password: string;  // ✅ Added password field
  role: Role;
};

type AuthContextType = {
  user: User | null;
  login: (user: Omit<User, "id">) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: Omit<User, "id">) => {
    const userWithId: User = {
      ...userData,
      id: userData.email, // ✅ Use email as unique ID
    };

    localStorage.setItem("authUser", JSON.stringify(userWithId));
    setUser(userWithId);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within AuthProvider");
  return context;
}