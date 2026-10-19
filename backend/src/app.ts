import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { loadConfig } from "./config";
import { errorHandler } from "./errors/errorHandler";
import { AppError } from "./errors/AppError";

const config = loadConfig();
const app = express();

app.use(express.json());

// Rota de teste/saúde
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "API Diário Literário online!" });
});

// Tratamento de rota inexistente (404)
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError("A rota solicitada não existe.", 404, "ROUTE_NOT_FOUND"));
});

// Middleware central de erros (sempre por último)
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Servidor rodando em http://localhost:${config.port}`);
});

export default app;
