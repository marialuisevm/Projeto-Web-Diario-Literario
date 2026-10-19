import bcrypt from "bcrypt";
import * as usersRepository from "./users.repository";
import { AppError } from "../errors/AppError";

export interface RegisterDTO {
  name: string;
  email: string;
  password?: string;
}

export async function register(data: RegisterDTO) {
  if (!data.password || data.password.length < 6) {
    throw new AppError("A palavra-passe deve ter pelo menos 6 caracteres.", 400, "VALIDATION_ERROR");
  }

  const userExists = await usersRepository.findByEmail(data.email);
  if (userExists) {
    throw new AppError("Este e-mail já se encontra registado.", 409, "EMAIL_ALREADY_EXISTS");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(data.password, saltRounds);

  const newUser = await usersRepository.create(data.name, data.email, passwordHash);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    createdAt: newUser.created_at,
  };
}

export async function getProfile(userId: number) {
  const user = await usersRepository.findById(userId);
  if (!user) {
    throw new AppError("Utilizador não encontrado.", 404, "NOT_FOUND");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
  };
}
