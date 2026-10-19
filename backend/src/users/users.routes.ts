import { Router } from "express";
import * as usersController from "./users.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Rota pública: Registo de conta
router.post("/api/users", usersController.register);

// Rota protegida: Consultar dados do próprio utilizador logado
router.get("/api/users/me", requireAuth, usersController.getMe);

export default router;
