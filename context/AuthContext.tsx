"use client";

import API from "@/app/api/api";
import {
  createLocalToken,
  findUserByEmail,
  getActiveUser,
  getPendingEmailUpdate,
  getUsers,
  nowIso,
  saveActiveUser,
  savePendingEmailUpdate,
  saveUsers,
  type PendingEmailUpdate,
  type Role as StoredRole,
  type StoredUser,
  type Zone,
  upsertUser,
  ZONES,
} from "@/app/api/storage";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = StoredRole;

export type User = StoredUser;

type SignupCredentials = {
  name: string;
  email: string;
  password: string;
  role: Role;
  zone: Zone;
};

type LoginCredentials = {
  name: string;
  email: string;
  password: string;
  role: Role;
  zone?: Zone;
};

type ProfileUpdate = {
  name?: string;
  password?: string;
  zone?: Zone;
};

type EmailChangeResult = {
  message: string;
  emailSent: boolean;
  devOtp?: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: SignupCredentials) => Promise<User>;
  updateProfile: (updates: ProfileUpdate) => Promise<User>;
  requestEmailChange: (nextEmail: string, updates?: ProfileUpdate) => Promise<EmailChangeResult>;
  completeEmailChange: (nextEmail: string) => Promise<User>;
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

function extractUser(payload: any, credentials: LoginCredentials | SignupCredentials): User {
  const source = payload?.user || payload?.data?.user || payload?.data || payload || {};
  const zone = (source.zone || credentials.zone || ZONES[0]) as Zone;
  const token = extractToken(payload) || createLocalToken();

  return {
    id: source.id || source.email || credentials.email,
    name: source.name || credentials.name,
    email: source.email || credentials.email,
    password: source.password || credentials.password,
    role: (source.role || credentials.role) as Role,
    zone,
    token,
    createdAt: source.createdAt || nowIso(),
    updatedAt: source.updatedAt || nowIso(),
  };
}

function normalizeLocalUser(user: User): User {
  return {
    ...user,
    zone: (user.zone || ZONES[0]) as Zone,
    token: user.token || createLocalToken(),
    createdAt: user.createdAt || nowIso(),
    updatedAt: nowIso(),
  };
}

function readSessionUser() {
  const active = getActiveUser();
  return active ? normalizeLocalUser(active) : null;
}

function persistSession(user: User | null) {
  if (!user) {
    saveActiveUser(null);
    return;
  }

  const normalized = normalizeLocalUser(user);
  saveActiveUser(normalized);
}

async function requestOtp(email: string, purpose: string) {
  const res = await fetch("/api/otp/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, purpose }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Failed to request OTP");
  }

  return data as { message?: string; emailSent?: boolean; devOtp?: string };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sessionUser = readSessionUser();
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (sessionUser) {
      setUser(sessionUser);
      setToken(storedToken || sessionUser.token || null);
    }

    setLoading(false);
  }, []);

  const refreshUsersFromStorage = () => {
    const users = getUsers().map(normalizeLocalUser);
    saveUsers(users);
  };

  const register = async (credentials: SignupCredentials) => {
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const existing = findUserByEmail(normalizedEmail);
    const nextUser: User = normalizeLocalUser({
      id: existing?.id || normalizedEmail,
      name: credentials.name.trim(),
      email: normalizedEmail,
      password: credentials.password,
      role: credentials.role,
      zone: credentials.zone,
      token: existing?.token || createLocalToken(),
      createdAt: existing?.createdAt || nowIso(),
      updatedAt: nowIso(),
    });

    upsertUser(nextUser);
    refreshUsersFromStorage();
    return nextUser;
  };

  const login = async (credentials: LoginCredentials) => {
    const normalizedEmail = credentials.email.trim().toLowerCase();
    const normalizedName = credentials.name.trim();
    const matchingUser =
      getUsers().find(
        (storedUser) =>
          storedUser.email.toLowerCase() === normalizedEmail &&
          storedUser.password === credentials.password &&
          storedUser.role === credentials.role &&
          storedUser.name.toLowerCase() === normalizedName.toLowerCase()
      ) || null;

    if (matchingUser) {
      const sessionUser = normalizeLocalUser(matchingUser);
      persistSession(sessionUser);
      setUser(sessionUser);
      setToken(sessionUser.token);
      window.dispatchEvent(new Event("auth-changed"));
      return;
    }

    try {
      const response = await API.post("/auth/login", credentials);
      const apiToken = extractToken(response.data);

      if (!apiToken) {
        throw new Error("Login succeeded but no token was returned by the backend.");
      }

      const sessionUser = normalizeLocalUser(extractUser(response.data, credentials));
      sessionUser.token = apiToken;

      persistSession(sessionUser);
      setUser(sessionUser);
      setToken(apiToken);
      upsertUser(sessionUser);
      window.dispatchEvent(new Event("auth-changed"));
      return;
    } catch (error) {
      const hasKnownAccount = Boolean(findUserByEmail(normalizedEmail));

      if (!hasKnownAccount) {
        throw new Error("Please sign up first, then log in.");
      }

      throw error instanceof Error ? error : new Error("Invalid credentials");
    }
  };

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!user) {
      throw new Error("You must be signed in to update your profile.");
    }

    const nextUser: User = normalizeLocalUser({
      ...user,
      ...updates,
      zone: (updates.zone || user.zone) as Zone,
      updatedAt: nowIso(),
    });

    upsertUser(nextUser);
    persistSession(nextUser);
    setUser(nextUser);
    setToken(nextUser.token);
    window.dispatchEvent(new Event("auth-changed"));
    return nextUser;
  };

  const requestEmailChange = async (nextEmail: string, updates?: ProfileUpdate) => {
    if (!user) {
      throw new Error("You must be signed in to change your email.");
    }

    const normalizedEmail = nextEmail.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error("Email is required");
    }

    const pending: PendingEmailUpdate = {
      userId: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      zone: user.zone,
      nextEmail: normalizedEmail,
      profileUpdates: updates,
      createdAt: nowIso(),
    };

    savePendingEmailUpdate(pending);
    const data = await requestOtp(normalizedEmail, "email-update");

    return {
      message: data.message || "OTP sent",
      emailSent: Boolean(data.emailSent),
      devOtp: data.devOtp,
    };
  };

  const completeEmailChange = async (nextEmail: string) => {
    if (!user) {
      throw new Error("You must be signed in to change your email.");
    }

    const normalizedEmail = nextEmail.trim().toLowerCase();
    const pending = getPendingEmailUpdate();

    if (!pending || pending.userId !== user.id || pending.nextEmail !== normalizedEmail) {
      throw new Error("Email verification details were not found. Please request a new code.");
    }

    const nextUser: User = normalizeLocalUser({
      ...user,
      ...(pending.profileUpdates || {}),
      email: normalizedEmail,
      updatedAt: nowIso(),
    });

    upsertUser(nextUser);
    savePendingEmailUpdate(null);
    persistSession(nextUser);
    setUser(nextUser);
    setToken(nextUser.token);
    window.dispatchEvent(new Event("auth-changed"));
    return nextUser;
  };

  const logout = () => {
    persistSession(null);
    setUser(null);
    setToken(null);
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/login");
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      updateProfile,
      requestEmailChange,
      completeEmailChange,
      logout,
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
