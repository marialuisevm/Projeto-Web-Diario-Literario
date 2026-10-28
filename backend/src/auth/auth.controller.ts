import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { nome, email, senha } = req.body;
      const novoUsuario = await authService.register(nome, email, senha);
      return res.status(201).json(novoUsuario);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body;
      const sessao = await authService.login(email, senha);
      return res.status(200).json(sessao);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();