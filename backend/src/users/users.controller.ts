import { Request, Response, NextFunction } from "express";
import * as usersService from "./users.service";
import { AppError } from "../errors/AppError";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(new AppError("Campos obrigatórios: name, email e password.", 400, "VALIDATION_ERROR"));
    }

    const newUser = await usersService.register({ name, email, password });

    res.status(201).json({
      message: "Utilizador criado com sucesso!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const user = await usersService.getProfile(userId);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
}
