import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. Registro interno no terminal para depuração
  console.error("LOG INTERNO DO SERVIDOR:", err);

  // 2. Erro conhecido/controlado da aplicação (família 4xx)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  // JSON malformado enviado pelo cliente (erro do express.json)
  if ((err as any).type === "entity.parse.failed") {
    return res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "O corpo da requisição não é um JSON válido.",
      },
    });
  }
  
  // 3. Erro inesperado ou do banco de dados (família 5xx)
  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Ocorreu um erro interno inesperado no servidor.",
    },
  });
}
