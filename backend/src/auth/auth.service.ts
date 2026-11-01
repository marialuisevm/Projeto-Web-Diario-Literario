import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as usersRepository from "../users/users.repository";
import { loadConfig } from "../config";
import { AppError } from "../errors/AppError";

export interface LoginDTO {
  email: string;
  password: string;
}

export async function login(data: LoginDTO) {
  if (!data.email || !data.password) {
    throw new AppError("E-mail e senha são obrigatórios.", 400, "VALIDATION_ERROR");
  }

  const user = await usersRepository.findByEmail(data.email.trim());
  if (!user) {
    throw new AppError("E-mail ou senha inválidos.", 401, "INVALID_CREDENTIALS");
  }

  const passwordOk = await bcrypt.compare(data.password, user.password);
  if (!passwordOk) {
    throw new AppError("E-mail ou senha inválidos.", 401, "INVALID_CREDENTIALS");
  }

  const config = loadConfig();
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    },
  };
}