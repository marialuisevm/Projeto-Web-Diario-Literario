import { Router } from "express";
import * as leiturasController from "./leituras.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Todas as rotas de leituras requerem utilizador autenticado
router.use(requireAuth);

router.get("/api/leituras", leiturasController.getAll);
router.get("/api/leituras/:id", leiturasController.getById);
router.post("/api/leituras", leiturasController.create);
router.patch("/api/leituras/:id/progresso", leiturasController.updateProgresso);
router.delete("/api/leituras/:id", leiturasController.remove);

export default router;
