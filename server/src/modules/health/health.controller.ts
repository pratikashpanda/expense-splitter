import type { Request, Response } from "express";
import { healthService } from "./health.service.js";

export const healthController = {
  check: async (_req: Request, res: Response) => {
    const up = await healthService.isDatabaseUp();
    res.status(up ? 200 : 503).json({ status: up ? "ok" : "error" });
  },
};
