import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { loadConfig } from "./config";
import { errorHandler } from "./errors/errorHandler";
import { AppError } from "./errors/AppError";

// Importação das rotas dos módulos
import authRoutes from "./auth/auth.routes";
import usersRoutes from "./users/users.routes";
import livrosRoutes from "./livros/livros.routes";
import leiturasRoutes from "./leituras/leituras.routes";

const config = loadConfig();
const app = express();

// Middleware para interpretar requisições em formato JSON
app.use(express.json());

// Rota de verificação do estado da API
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "API Diário Literário online!" });
});

// Registo dos módulos de rotas
app.use(authRoutes);
app.use(usersRoutes);
app.use(livrosRoutes);
app.use(leiturasRoutes);

// Tratamento de rota não encontrada (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError("A rota solicitada não existe.", 404, "ROUTE_NOT_FOUND"));
});

// Middleware centralizado de tratamento de erros (sempre na última posição)
app.use(errorHandler);

// Inicialização do servidor
app.listen(config.port, () => {
  console.log(`Servidor rodando em http://localhost:${config.port}`);
});

export default app;
