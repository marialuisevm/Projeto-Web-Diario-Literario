import express from "express";
import cors from "cors";
import { config } from "./config";
import { errorHandler } from "./errors/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Servidor rodando na porta ${config.port}`);
});