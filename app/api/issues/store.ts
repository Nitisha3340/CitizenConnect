import { getMysqlPool } from "@/app/api/mysql";
import { promises as fs } from "fs";
import path from "path";

export type IssueRecord = {
  id: number;
  title: string;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  severity: "Low" | "Medium" | "High";
  zone: string;
  region: string;
  createdBy: string;
  createdById: string;
  email: string;
  assignedPolitician?: string;
  createdAt: string;
  updatedAt: string;
};

type FallbackData = {
  rows: IssueRecord[];
  nextId: number;
};

const FALLBACK_FILE = path.join(process.cwd(), ".issues-fallback.json");

async function ensureTable() {
  const pool = getMysqlPool();
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS issues (
      id BIGINT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      status VARCHAR(20) NOT NULL,
      severity VARCHAR(20) NOT NULL,
      zone VARCHAR(100) NOT NULL,
      region VARCHAR(100) NOT NULL,
      created_by VARCHAR(255) NOT NULL,
      created_by_id VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      assigned_politician VARCHAR(255) NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  return pool;
}

async function readFallback(): Promise<FallbackData> {
  try {
    const raw = await fs.readFile(FALLBACK_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<FallbackData>;
    return {
      rows: Array.isArray(parsed.rows) ? parsed.rows : [],
      nextId: typeof parsed.nextId === "number" ? parsed.nextId : 1,
    };
  } catch {
    return { rows: [], nextId: 1 };
  }
}

async function writeFallback(data: FallbackData) {
  await fs.writeFile(FALLBACK_FILE, JSON.stringify(data), "utf-8");
}

function toIssueRecord(row: any): IssueRecord {
  return {
    id: Number(row.id),
    title: row.title,
    description: row.description,
    status: normalizeStatus(row.status),
    severity: normalizeSeverity(row.severity),
    zone: row.zone,
    region: row.region || row.zone,
    createdBy: row.created_by || row.createdBy,
    createdById: row.created_by_id || row.createdById,
    email: row.email,
    assignedPolitician: row.assigned_politician || row.assignedPolitician || "",
    createdAt: new Date(row.created_at || row.createdAt).toISOString(),
    updatedAt: new Date(row.updated_at || row.updatedAt).toISOString(),
  };
}

function normalizeStatus(value: string): IssueRecord["status"] {
  const normalized = String(value || "").toUpperCase();
  if (normalized === "RESOLVED") return "Resolved";
  if (normalized === "IN_PROGRESS" || normalized === "IN PROGRESS") return "In Progress";
  return "Pending";
}

function normalizeSeverity(value: string): IssueRecord["severity"] {
  const normalized = String(value || "").toLowerCase();
  if (normalized === "high") return "High";
  if (normalized === "medium") return "Medium";
  return "Low";
}

function normalizeStatusForDb(value: IssueRecord["status"]) {
  if (value === "In Progress") return "IN_PROGRESS";
  if (value === "Resolved") return "RESOLVED";
  return "PENDING";
}

export async function listIssues(zone?: string) {
  try {
    const pool = await ensureTable();
    const [rows] = zone
      ? await pool.execute("SELECT * FROM issues WHERE zone = ? ORDER BY id DESC", [zone])
      : await pool.execute("SELECT * FROM issues ORDER BY id DESC");

    return { backend: "mysql" as const, rows: (rows as any[]).map(toIssueRecord) };
  } catch {
    const data = await readFallback();
    const rows = zone ? data.rows.filter((row) => row.zone === zone) : data.rows;
    return { backend: "fallback" as const, rows };
  }
}

export async function createIssue(issue: Omit<IssueRecord, "id" | "createdAt" | "updatedAt">) {
  const now = new Date().toISOString();

  try {
    const pool = await ensureTable();
    const [result] = await pool.execute(
      `INSERT INTO issues
        (title, description, status, severity, zone, region, created_by, created_by_id, email, assigned_politician)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        issue.title,
        issue.description,
        normalizeStatusForDb(issue.status),
        issue.severity,
        issue.zone,
        issue.region || issue.zone,
        issue.createdBy,
        issue.createdById,
        issue.email,
        issue.assignedPolitician || null,
      ]
    );

    const insertId = Number((result as any).insertId);
    const [rows] = await pool.execute("SELECT * FROM issues WHERE id = ? LIMIT 1", [insertId]);
    return { backend: "mysql" as const, row: toIssueRecord((rows as any[])[0]) };
  } catch {
    const data = await readFallback();
    const row: IssueRecord = {
      id: data.nextId,
      title: issue.title,
      description: issue.description,
      status: issue.status,
      severity: issue.severity,
      zone: issue.zone,
      region: issue.region || issue.zone,
      createdBy: issue.createdBy,
      createdById: issue.createdById,
      email: issue.email,
      assignedPolitician: issue.assignedPolitician || "",
      createdAt: now,
      updatedAt: now,
    };

    const nextData = {
      rows: [row, ...data.rows],
      nextId: data.nextId + 1,
    };

    await writeFallback(nextData);
    return { backend: "fallback" as const, row };
  }
}

export async function updateIssueStatus(id: number, status: IssueRecord["status"], assignedPolitician?: string) {
  try {
    const pool = await ensureTable();
    await pool.execute(
      "UPDATE issues SET status = ?, assigned_politician = ? WHERE id = ?",
      [normalizeStatusForDb(status), assignedPolitician || null, id]
    );

    const [rows] = await pool.execute("SELECT * FROM issues WHERE id = ? LIMIT 1", [id]);
    const row = (rows as any[])[0];
    if (!row) return null;
    return { backend: "mysql" as const, row: toIssueRecord(row) };
  } catch {
    const data = await readFallback();
    let updated: IssueRecord | null = null;

    const rows = data.rows.map((row) => {
      if (row.id !== id) return row;
      updated = {
        ...row,
        status,
        assignedPolitician: assignedPolitician || row.assignedPolitician || "",
        updatedAt: new Date().toISOString(),
      };
      return updated;
    });

    await writeFallback({ rows, nextId: data.nextId });
    return updated ? { backend: "fallback" as const, row: updated } : null;
  }
}

export async function removeIssue(id: number) {
  try {
    const pool = await ensureTable();
    const [result] = await pool.execute("DELETE FROM issues WHERE id = ?", [id]);
    return Number((result as any).affectedRows) > 0;
  } catch {
    const data = await readFallback();
    const nextRows = data.rows.filter((row) => row.id !== id);
    await writeFallback({ rows: nextRows, nextId: data.nextId });
    return nextRows.length !== data.rows.length;
  }
}
