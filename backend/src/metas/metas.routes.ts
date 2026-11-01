import { Router } from "express";
import * as metasController from "./metas.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Todas as rotas de metas requerem usuário autenticado
router.get("/api/metas", requireAuth, metasController.getAll);
router.get("/api/metas/ano/:ano/progresso", requireAuth, metasController.getProgresso);
router.get("/api/metas/:id", requireAuth, metasController.getById);
router.post("/api/metas", requireAuth, metasController.create);
router.put("/api/metas/:id", requireAuth, metasController.update);
router.delete("/api/metas/:id", requireAuth, metasController.remove);

export default router;