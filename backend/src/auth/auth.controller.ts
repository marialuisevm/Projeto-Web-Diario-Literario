import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { AppError } from "../errors/AppError";

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

      if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return next(new AppError("Campos obrigatórios: email e password.", 400, "VALIDATION_ERROR"));
    }

    const result = await authService.login({ email, password });

    res.status(200).json({
      message: "Login realizado com sucesso!",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
}