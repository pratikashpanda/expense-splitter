import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import { UnauthorizedError } from "../errors.js";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("MISSING_TOKEN", "Missing token");
  }
  req.user = { id: verifyAccessToken(authHeader.slice(7)) };
  next();
};
