import { Router } from "express";
import * as leiturasController from "./leituras.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Todas as rotas de leituras requerem usuário autenticado
router.get("/api/leituras", requireAuth, leiturasController.getAll);
router.get("/api/leituras/:id", requireAuth, leiturasController.getById);
router.post("/api/leituras", requireAuth, leiturasController.create);
router.patch("/api/leituras/:id/progresso", requireAuth, leiturasController.updateProgresso);
router.delete("/api/leituras/:id", requireAuth, leiturasController.remove);

export default router;
