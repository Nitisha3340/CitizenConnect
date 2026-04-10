import { getMysqlPool } from "@/app/api/mysql";
import { promises as fs } from "fs";
import path from "path";

type OtpRow = {
  id: number;
  email: string;
  purpose: string;
  otpHash: string;
  expiresAtMs: number;
  used: boolean;
};

const FALLBACK_FILE = path.join(process.cwd(), ".otp-fallback.json");

function keyOf(email: string, purpose: string) {
  return `${email}::${purpose}`;
}

async function readFallbackRows() {
  try {
    const raw = await fs.readFile(FALLBACK_FILE, "utf-8");
    const parsed = JSON.parse(raw) as { rows?: OtpRow[]; nextId?: number };
    return {
      rows: Array.isArray(parsed.rows) ? parsed.rows : [],
      nextId: typeof parsed.nextId === "number" ? parsed.nextId : 1,
    };
  } catch {
    return { rows: [], nextId: 1 };
  }
}

async function writeFallbackRows(rows: OtpRow[], nextId: number) {
  await fs.writeFile(FALLBACK_FILE, JSON.stringify({ rows, nextId }), "utf-8");
}

export async function saveOtp(email: string, purpose: string, otpHash: string) {
  try {
    const pool = getMysqlPool();
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS otp_requests (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        purpose VARCHAR(50) NOT NULL,
        otp_hash CHAR(64) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        used TINYINT(1) NOT NULL DEFAULT 0
      )
    `);
    await pool.execute(
      `INSERT INTO otp_requests (email, purpose, otp_hash, expires_at, used)
       VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), 0)`,
      [email, purpose, otpHash]
    );
    return { backend: "mysql" as const };
  } catch {
    const snapshot = await readFallbackRows();
    const row: OtpRow = {
      id: snapshot.nextId,
      email,
      purpose,
      otpHash,
      expiresAtMs: Date.now() + 10 * 60 * 1000,
      used: false,
    };
    const k = keyOf(email, purpose);
    const rowsWithoutPrevious = snapshot.rows.filter((r) => keyOf(r.email, r.purpose) !== k);
    const nextRows = [...rowsWithoutPrevious, row];
    await writeFallbackRows(nextRows, snapshot.nextId + 1);
    return { backend: "memory" as const };
  }
}

export async function getLatestOtp(email: string, purpose: string) {
  try {
    const pool = getMysqlPool();
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS otp_requests (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL,
        purpose VARCHAR(50) NOT NULL,
        otp_hash CHAR(64) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        used TINYINT(1) NOT NULL DEFAULT 0
      )
    `);
    const [rows] = await pool.execute(
      `SELECT id, otp_hash, expires_at, used
       FROM otp_requests
       WHERE email = ? AND purpose = ?
       ORDER BY id DESC
       LIMIT 1`,
      [email, purpose]
    );
    const typedRows = rows as Array<{
      id: number;
      otp_hash: string;
      expires_at: string;
      used: number;
    }>;
    const row = typedRows[0];
    if (!row) return null;
    return {
      id: row.id,
      otpHash: row.otp_hash,
      expiresAtMs: new Date(row.expires_at).getTime(),
      used: Boolean(row.used),
      backend: "mysql" as const,
    };
  } catch {
    const snapshot = await readFallbackRows();
    const row = snapshot.rows.find((r) => keyOf(r.email, r.purpose) === keyOf(email, purpose));
    if (!row) return null;
    return {
      id: row.id,
      otpHash: row.otpHash,
      expiresAtMs: row.expiresAtMs,
      used: row.used,
      backend: "memory" as const,
    };
  }
}

export async function markOtpUsed(
  id: number,
  email: string,
  purpose: string,
  backend: "mysql" | "memory"
) {
  if (backend === "mysql") {
    const pool = getMysqlPool();
    await pool.execute(`UPDATE otp_requests SET used = 1 WHERE id = ?`, [id]);
    return;
  }
  const k = keyOf(email, purpose);
  const snapshot = await readFallbackRows();
  const nextRows = snapshot.rows.map((r) => (keyOf(r.email, r.purpose) === k ? { ...r, used: true } : r));
  await writeFallbackRows(nextRows, snapshot.nextId);
}

