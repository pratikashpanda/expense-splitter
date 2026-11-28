import type { Request, Response } from "express";
import { usersService } from "./users.service.js";

export const usersController = {
  async me(req: Request, res: Response) {
    res.json(await usersService.getById(req.user!.id));
  },
};
