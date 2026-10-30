import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. Registo interno no terminal para depuração
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

  // 3. Erro inesperado ou do banco de dados (família 5xx)
  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Ocorreu um erro interno inesperado no servidor.",
    },
  });
}
