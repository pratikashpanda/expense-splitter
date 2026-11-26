import oracledb from "oracledb";
import { config } from "./config.js";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

let pool: oracledb.Pool | undefined;

export async function initPool() {
  pool = await oracledb.createPool({
    user: config.DB_USER,
    password: config.APP_USER_PASSWORD,
    connectString: config.DB_CONNECT_STRING,
    poolMin: 1,
    poolMax: 10,
  });
}

export async function closePool() {
  await pool?.close(10);
}

export async function withConnection<T>(
  fn: (conn: oracledb.Connection) => Promise<T>,
): Promise<T> {
  if (!pool) throw new Error("DB pool not initialized");
  const conn = await pool.getConnection();
  try {
    return await fn(conn);
  } finally {
    conn.close();
  }
}

export const isUniqueViolation = (err: unknown): boolean =>
  (err as { errorNum?: number })?.errorNum === 1;
