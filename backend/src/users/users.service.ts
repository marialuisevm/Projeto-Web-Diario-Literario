import bcrypt from "bcrypt";
import * as usersRepository from "./users.repository";
import { User, UserProps } from "./users.entity";
import { AppError } from "../errors/AppError";

export async function register(props: UserProps) {
  if (!props.password || props.password.length < 6) {
    throw new AppError("A palavra-passe deve ter pelo menos 6 caracteres.", 400, "VALIDATION_ERROR");
  }

  const existingUser = await usersRepository.findByEmail(props.email);
  if (existingUser) {
    throw new AppError("Este e-mail já se encontra registado.", 409, "EMAIL_ALREADY_EXISTS");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(props.password, saltRounds);

  const createdRow = await usersRepository.create(props.name, props.email, passwordHash);

  return new User(
    { name: createdRow.name, email: createdRow.email },
    createdRow.id,
    createdRow.created_at
  );
}

export async function getProfile(id: number) {
  const row = await usersRepository.findById(id);
  if (!row) {
    throw new AppError("Utilizador não encontrado.", 404, "NOT_FOUND");
  }

  return new User(
    { name: row.name, email: row.email },
    row.id,
    row.created_at
  );
}
