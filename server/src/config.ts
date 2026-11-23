import { z } from "zod";

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  DB_USER: z.string().min(1),
  APP_USER_PASSWORD: z.string().min(1),
  DB_CONNECT_STRING: z.string().default("localhost:1521/FREEPDB1"),
});

export const config = schema.parse(process.env);
