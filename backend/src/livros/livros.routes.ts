import { Router } from "express";
import * as livrosController from "./livros.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { uploadCapa } from "../middlewares/upload.middleware";

const router = Router();

// Rotas públicas de consulta ao catálogo
router.get("/api/livros", livrosController.getAll);
router.get("/api/livros/:id", livrosController.getById);

// Rotas protegidas (apenas usuários cadastrados e autenticados)
router.post("/api/livros", requireAuth, livrosController.create);
router.put("/api/livros/:id", requireAuth, livrosController.update);
router.delete("/api/livros/:id", requireAuth, livrosController.remove);
router.post("/api/livros/:id/capa", requireAuth, uploadCapa, livrosController.uploadCapa);

export default router;
