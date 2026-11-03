import { Router } from "express";
import * as authController from "./auth.controller";

const router = Router();

// Login (Público): devolve o token JWT usado nas rotas protegidas
router.post("/api/auth/login", authController.login);

export default router;