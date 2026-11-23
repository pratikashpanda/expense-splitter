import oracledb from "oracledb";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

async function main() {
  const conn = await oracledb.getConnection({
    user: "expense_spliter_app",
    password: process.env.APP_USER_PASSWORD,
    connectString: "localhost:1521/FREEPDB1",
  });

  const res = await conn.execute("SELECT 1 FROM DUAL");
  console.log(res.rows);
  await conn.close();
}

main().catch(console.error);
