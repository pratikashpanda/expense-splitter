import type { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ValidationError } from "../errors.js";

export const validate =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError(
        result.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        );
    }

    req.body = result.data;
    next();
  };
