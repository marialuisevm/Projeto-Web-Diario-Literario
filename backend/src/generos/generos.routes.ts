import { Router } from "express";
import * as generosController from "./generos.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Rotas públicas de consulta aos géneros literários
router.get("/api/generos", generosController.getAll);
router.get("/api/generos/:id", generosController.getById);

// Rotas protegidas (apenas usuários cadastrados e autenticados)
router.post("/api/generos", requireAuth, generosController.create);
router.put("/api/generos/:id", requireAuth, generosController.update);
router.delete("/api/generos/:id", requireAuth, generosController.remove);

export default router;