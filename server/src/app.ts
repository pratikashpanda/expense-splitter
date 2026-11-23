import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { withConnection } from "./db.js";

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(pinoHttp());

app.get("/health", async (req, res) => {
  try {
    await withConnection((conn) => conn.execute("SELECT 1 FROM DUAL"));
    res.json({ status: "OK" });
  } catch (err) {
    req.log.error(err);
    res.status(503).json({ status: "error" });
  }
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  req.log.error(err);
  res.status(500).json({
    error: { code: "INTERNAL", message: "Something went wrong" },
  });
});
