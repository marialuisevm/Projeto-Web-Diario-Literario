import { Router } from "express";
import * as usersController from "./users.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Registo de novo utilizador (Público)
router.post("/api/users", usersController.register);

// Perfil do utilizador autenticado (Protegido por Token JWT)
router.get("/api/users/me", requireAuth, usersController.getMe);

export default router;
