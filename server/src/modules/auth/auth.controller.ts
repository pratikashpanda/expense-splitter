import type { Request, Response } from "express";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";
import { authService } from "./auth.service.js";

export const authController = {
  register: async (req: Request<{}, {}, RegisterInput>, res: Response) => {
    res.status(201).json(await authService.register(req.body));
  },

  login: async(req: Request<{}, {}, LoginInput>, res: Response) => {
    res.json(await authService.login(req.body))
  }
};
