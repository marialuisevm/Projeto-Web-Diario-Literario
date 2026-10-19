import { Router } from "express";
import * as livrosController from "./livros.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Rotas públicas de consulta ao catálogo
router.get("/api/livros", livrosController.getAll);
router.get("/api/livros/:id", livrosController.getById);

// Rotas protegidas (apenas utilizadores registados e autenticados)
router.post("/api/livros", requireAuth, livrosController.create);
router.delete("/api/livros/:id", requireAuth, livrosController.remove);

export default router;
