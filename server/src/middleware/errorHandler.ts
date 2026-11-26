import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors.js";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }
  req.log.error(err);
  res.status(500).json({
    error: { code: "INTERNAL", message: "Something went wrong" },
  });
};
