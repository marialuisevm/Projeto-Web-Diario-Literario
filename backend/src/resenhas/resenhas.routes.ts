import { Router } from "express";
import * as resenhasController from "./resenhas.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Todas as rotas de resenhas requerem usuário autenticado
router.get("/api/resenhas", requireAuth, resenhasController.getAll);
router.get("/api/resenhas/:id", requireAuth, resenhasController.getById);
router.post("/api/resenhas", requireAuth, resenhasController.create);
router.put("/api/resenhas/:id", requireAuth, resenhasController.update);
router.delete("/api/resenhas/:id", requireAuth, resenhasController.remove);

export default router;