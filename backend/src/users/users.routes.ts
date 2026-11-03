import { Router } from "express";
import * as usersController from "./users.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Registro de novo usuário (Público)
router.post("/api/users", usersController.register);

// Perfil do usuário autenticado (Protegido por Token JWT)
router.get("/api/users/me", requireAuth, usersController.getMe);

export default router;
