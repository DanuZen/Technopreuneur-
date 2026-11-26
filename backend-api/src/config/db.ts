import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:password@localhost:5432/careermatch_db",
  connectionTimeoutMillis: 2500,
});

pool.on("error", (err) => {
  console.warn("[Database] PostgreSQL idle client warning:", err.message);
});

export async function isPostgresAvailable(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export const query = (text: string, params?: unknown[]) =>
  pool.query(text, params);
