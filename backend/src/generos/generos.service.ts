import * as generosRepository from "./generos.repository";
import { AppError } from "../errors/AppError";

export interface GeneroInput {
  nome: string;
}

// Rejeita nome vazio ou só com espaços, valida o nome
function validateNome(nome: string): string {
  if (!nome || nome.trim() === "") {
    throw new AppError("O nome do gênero é obrigatório.", 400, "VALIDATION_ERROR");
  }

  const nomeLimpo = nome.trim();

  if (nomeLimpo.length > 80) {
    throw new AppError("O nome do gênero deve ter no máximo 80 caracteres.", 400, "VALIDATION_ERROR");
  }

  return nomeLimpo;
}

// Repassa a busca opcional ao repository
export async function listAll(busca?: string) {
  return await generosRepository.findAll(busca);
}

// Busca o gênero e manda 404 se o repository devolver null
export async function getById(id: number) {
  const genero = await generosRepository.findById(id);
  if (!genero) {
    throw new AppError("Gênero não encontrado.", 404, "NOT_FOUND");
  }
  return genero;
}

// Verifica se já existe um gênero igual e depois chama o create do repository
export async function create(input: GeneroInput) {
  const nome = validateNome(input.nome);

  const jaExiste = await generosRepository.findByNome(nome);
  if (jaExiste) {
    throw new AppError("Já existe um gênero com este nome.", 409, "GENERO_ALREADY_EXISTS");
  }

  const novoGenero = await generosRepository.create({ nome });
  return novoGenero;
}

// Valida o nome, confirma se existe e verifica duplicação
export async function update(id: number, input: GeneroInput) {
  const nome = validateNome(input.nome);

  const generoAtual = await generosRepository.findById(id);
  if (!generoAtual) {
    throw new AppError("Gênero não encontrado.", 404, "NOT_FOUND");
  }

  const jaExiste = await generosRepository.findByNome(nome);
  if (jaExiste && jaExiste.id !== id) {
    throw new AppError("Já existe um gênero com este nome.", 409, "GENERO_ALREADY_EXISTS");
  }

  const atualizado = await generosRepository.update(id, { nome });
  return atualizado;
}

export async function remove(id: number) {
  const removido = await generosRepository.remove(id);
  if (!removido) {
    throw new AppError("Gênero não encontrado para remoção.", 404, "NOT_FOUND");
  }
}