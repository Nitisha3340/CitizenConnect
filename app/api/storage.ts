export const ZONES = ["North Zone", "South Zone", "East Zone", "West Zone"] as const;

export type Zone = (typeof ZONES)[number];

export type Role = "admin" | "moderator" | "citizen" | "politician";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  zone: Zone;
  token: string;
  createdAt: string;
  updatedAt: string;
};

export type PendingSignup = {
  name: string;
  email: string;
  password: string;
  role: Role;
  zone: Zone;
};

export type PendingEmailUpdate = {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  zone: Zone;
  nextEmail: string;
  profileUpdates?: {
    name?: string;
    password?: string;
    zone?: Zone;
  };
  createdAt: string;
};

export type IssueStatus = "Pending" | "In Progress" | "Resolved";
export type IssueSeverity = "Low" | "Medium" | "High";

export type StoredIssue = {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  severity: IssueSeverity;
  zone: Zone;
  region?: string;
  createdBy: string;
  createdById: string;
  email: string;
  assignedPolitician?: string;
  createdAt: string;
  updatedAt: string;
  deleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
  deleteReason?: string;
};

const PREFIX = "citizenconnect";

export const STORAGE_KEYS = {
  token: `${PREFIX}.token`,
  activeUser: `${PREFIX}.authUser`,
  users: `${PREFIX}.users`,
  pendingSignup: `${PREFIX}.pendingSignup`,
  pendingEmailUpdate: `${PREFIX}.pendingEmailUpdate`,
  issues: `${PREFIX}.issues`,
} as const;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: string) {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(key);
}

export function createLocalToken() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `token-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function getUsers() {
  return readJson<StoredUser[]>(STORAGE_KEYS.users, []);
}

export function saveUsers(users: StoredUser[]) {
  writeJson(STORAGE_KEYS.users, users);
}

export function getActiveUser() {
  return readJson<StoredUser | null>(STORAGE_KEYS.activeUser, null);
}

export function saveActiveUser(user: StoredUser | null) {
  if (!user) {
    removeStorage(STORAGE_KEYS.activeUser);
    removeStorage(STORAGE_KEYS.token);
    return;
  }

  writeJson(STORAGE_KEYS.activeUser, user);
  window.localStorage.setItem(STORAGE_KEYS.token, user.token);
}

export function getToken() {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(STORAGE_KEYS.token);
}

export function getPendingSignup() {
  return readJson<PendingSignup | null>(STORAGE_KEYS.pendingSignup, null);
}

export function savePendingSignup(pending: PendingSignup | null) {
  if (!pending) {
    removeStorage(STORAGE_KEYS.pendingSignup);
    return;
  }

  writeJson(STORAGE_KEYS.pendingSignup, pending);
}

export function getPendingEmailUpdate() {
  return readJson<PendingEmailUpdate | null>(STORAGE_KEYS.pendingEmailUpdate, null);
}

export function savePendingEmailUpdate(pending: PendingEmailUpdate | null) {
  if (!pending) {
    removeStorage(STORAGE_KEYS.pendingEmailUpdate);
    return;
  }

  writeJson(STORAGE_KEYS.pendingEmailUpdate, pending);
}

export function getIssues() {
  return readJson<StoredIssue[]>(STORAGE_KEYS.issues, []);
}

export function saveIssues(issues: StoredIssue[]) {
  writeJson(STORAGE_KEYS.issues, issues);
}

export function upsertIssue(issue: StoredIssue) {
  const issues = getIssues();
  const index = issues.findIndex((item) => item.id === issue.id);

  if (index >= 0) {
    issues[index] = issue;
  } else {
    issues.unshift(issue);
  }

  saveIssues(issues);
  return issue;
}

export function upsertUser(user: StoredUser) {
  const users = getUsers();
  const index = users.findIndex((item) => item.email.toLowerCase() === user.email.toLowerCase());

  if (index >= 0) {
    users[index] = user;
  } else {
    users.unshift(user);
  }

  saveUsers(users);
  return user;
}

export function findUserByEmail(email: string) {
  return getUsers().find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
}
