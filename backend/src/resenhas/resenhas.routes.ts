import { Router } from "express";
import * as resenhasController from "./resenhas.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Todas as rotas de resenhas requerem utilizador autenticado
router.use(requireAuth);

router.get("/api/resenhas", resenhasController.getAll);
router.get("/api/resenhas/:id", resenhasController.getById);
router.post("/api/resenhas", resenhasController.create);
router.put("/api/resenhas/:id", resenhasController.update);
router.delete("/api/resenhas/:id", resenhasController.remove);

export default router;