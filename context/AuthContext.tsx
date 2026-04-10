"use client";

import API from "@/app/api/api";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export type Role = "admin" | "moderator" | "citizen" | "politician";

type User = {
  id: string;
  name: string;
  email: string;
  password: string;  // ✅ Added password field
  role: Role;
};

type Credentials = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

function extractToken(payload: any) {
  return (
    payload?.token ||
    payload?.accessToken ||
    payload?.jwt ||
    payload?.data?.token ||
    payload?.data?.accessToken ||
    payload?.data?.jwt ||
    (typeof payload === "string" ? payload : "")
  );
}

function extractUser(payload: any, credentials: Credentials): User {
  const source = payload?.user || payload?.data?.user || payload?.data || payload || {};

  return {
    id: source.id || source.email || credentials.email,
    name: source.name || credentials.name,
    email: source.email || credentials.email,
    role: (source.role || credentials.role) as Role,
  };
}

async function postWithFallback(endpoints: string[], body: Credentials) {
  let lastError: unknown = null;

  for (const endpoint of endpoints) {
    try {
      return await API.post(endpoint, body);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (credentials: Credentials) => {
    await postWithFallback(["/auth/register", "/auth/signup"], credentials);
  };

  const login = async (credentials: Credentials) => {
    const response = await API.post("/auth/login", credentials);
    const token = extractToken(response.data);
    const authedUser = extractUser(response.data, credentials);

    if (!token) {
      throw new Error("Login succeeded but no token was returned by the backend.");
    }

    localStorage.setItem("token", token);
    localStorage.setItem("authUser", JSON.stringify(authedUser));
    setUser(authedUser);
    window.dispatchEvent(new Event("auth-changed"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUser");
    setUser(null);
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
