import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { loadConfig } from "../config";
import { AppError } from "../errors/appError";

const config = loadConfig();

interface TokenPayload {
  userId: number;
  email: string;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Token de autenticação não fornecido.", 401, "UNAUTHORIZED"));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Formato de token inválido. Use 'Bearer <token>'.", 401, "UNAUTHORIZED"));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    next(new AppError("Token expirado ou inválido.", 401, "UNAUTHORIZED"));
  }
}
