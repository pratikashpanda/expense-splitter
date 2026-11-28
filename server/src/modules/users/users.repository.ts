import oracledb from "oracledb";
import { withConnection } from "../../db.js";
import type { NewUser, User, UserWithHash } from "./users.types.js";

interface UserRow {
  ID: number;
  NAME: string;
  EMAIL: string;
  PASSWORD_HASH: string;
}

const toUser = (row: UserRow): User => {
  return {
    id: row.ID,
    name: row.NAME,
    email: row.EMAIL,
  };
};

export const userRepository = {
  async create(data: NewUser): Promise<number> {
    return withConnection(async (conn) => {
      const sql = await conn.execute(
        `insert into app_user (name, email, password_hash)
                values (:name, :email, :password_hash)
                returning id into :id`,
        {
          name: data.name,
          email: data.email,
          password_hash: data.passwordHash,
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        },
        { autoCommit: true },
      );
      const id = (sql.outBinds as { id: number[] }).id[0];
      if (id === undefined) {
        throw new Error("Failed to retrieve generated user ID");
      }
      return id;
    });
  },

  async findByEmail(email: string): Promise<UserWithHash | null> {
    const result = await withConnection((conn) =>
      conn.execute<UserRow>(
        `select id, name, email, password_hash from app_user where email = :email`,
        { email },
      ),
    );
    const row = result.rows?.[0];
    return row ? { ...toUser(row), passwordHash: row.PASSWORD_HASH } : null;
  },

  async findById(id: number): Promise<User | null> {
    const result = await withConnection((conn) =>
      conn.execute<UserRow>(
        `select id, name, email from app_user where id = :id`,
        { id },
      ),
    );
    const row = result.rows?.[0];
    return row ? toUser(row) : null;
  },
};
