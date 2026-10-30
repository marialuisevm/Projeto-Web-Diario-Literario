import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { loadConfig } from "./config";
import { errorHandler } from "./errors/errorHandler";
import { AppError } from "./errors/AppError";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import YAML from "yaml";

// Importação das rotas dos módulos
import authRoutes from "./auth/auth.routes";
import usersRoutes from "./users/users.routes";
import livrosRoutes from "./livros/livros.routes";
import generosRoutes from "./generos/generos.routes";
import leiturasRoutes from "./leituras/leituras.routes";
import resenhasRoutes from "./resenhas/resenhas.routes";
import metasRoutes from "./metas/metas.routes";

const config = loadConfig();
const app = express();

// Permite que o front-end (outro endereço) acesse a API
app.use(cors());

// Middleware para interpretar requisições em formato JSON
app.use(express.json());

// Deixa as imagens da pasta uploads acessíveis por URL (antes das rotas protegidas)
app.use("/uploads", express.static("uploads"));

// Rota de verificação do estado da API
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "API Diário Literário online!" });
});

// Documentação Swagger
const docsDir = path.join(__dirname, "docs");
const spec = YAML.parse(fs.readFileSync(path.join(docsDir, "openapi.yaml"), "utf8"));

spec.paths = {};
for (const file of fs.readdirSync(docsDir)) {
  if (file === "openapi.yaml" || !file.endsWith(".yaml")) continue;
  const mod = YAML.parse(fs.readFileSync(path.join(docsDir, file), "utf8"));
  Object.assign(spec.paths, mod.paths);
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

// Registo dos módulos de rotas
// Módulos com rotas públicas 
app.use(authRoutes);
app.use(usersRoutes);
app.use(livrosRoutes);
app.use(generosRoutes);

// Módulos em que todas as rotas exigem autenticação (router.use(requireAuth))
app.use(leiturasRoutes);
app.use(resenhasRoutes);
app.use(metasRoutes);

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
