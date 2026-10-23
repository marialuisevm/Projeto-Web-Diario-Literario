import { Router } from "express";
import * as metasController from "./metas.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Todas as rotas de metas requerem utilizador autenticado
router.use(requireAuth);

router.get("/api/metas", metasController.getAll);
router.get("/api/metas/ano/:ano/progresso", metasController.getProgresso);
router.get("/api/metas/:id", metasController.getById);
router.post("/api/metas", metasController.create);
router.put("/api/metas/:id", metasController.update);
router.delete("/api/metas/:id", metasController.remove);

export default router;