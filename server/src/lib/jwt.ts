import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { UnauthorizedError } from "../errors.js";

export const signAccessToken = (userId: number): string => {
  return jwt.sign({}, config.JWT_SECRET, {
    subject: String(userId),
    expiresIn: "15m",
  });
};

export const verifyAccessToken = (token: string): number => {
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    const sub = typeof payload === "string" ? payload : payload.sub;
    const id = Number(sub);
    if (!Number.isInteger(id)) throw new Error("bad subject");
    return id;
  } catch {
    throw new UnauthorizedError("INVALID_TOKEN", "Invalid or expired token");
  }
};
