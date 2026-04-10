import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function getMysqlPool() {
  if (pool) return pool;

  const host = process.env.MYSQL_HOST;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;
  const port = process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : undefined;

  if (!host || !user || !database) {
    throw new Error(
      "Missing MySQL env vars. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE (and optional MYSQL_PORT)."
    );
  }

  pool = mysql.createPool({
    host,
    user,
    password,
    database,
    port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

