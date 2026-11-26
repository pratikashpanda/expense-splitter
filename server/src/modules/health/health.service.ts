import { withConnection } from "../../db.js";

export const healthService = {
  async isDatabaseUp(): Promise<boolean> {
    try {
      await withConnection((conn) => conn.execute("select 1 from dual"));
      return true;
    } catch {
      return false;
    }
  },
};
