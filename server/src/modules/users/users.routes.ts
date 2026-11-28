import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { usersController } from "./users.controller.js";

export const usersRouter = Router();

usersRouter.get("/me", requireAuth, usersController.me);
