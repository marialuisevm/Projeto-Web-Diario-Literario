import { Request, Response, NextFunction } from "express";
import * as usersService from "./users.service";
import { AppError } from "../errors/appError";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new AppError("Campos obrigatórios: name, email e password.", 400, "VALIDATION_ERROR"));
    }

    const createdUser = await usersService.register({ name, email, password });

    res.status(201).json({
      message: "Conta criada com sucesso!",
      user: createdUser,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const profile = await usersService.getProfile(userId);

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
}
