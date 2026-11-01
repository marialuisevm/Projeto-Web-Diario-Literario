import * as livrosRepository from "./livros.repository";
import * as generosRepository from "../generos/generos.repository";
import { AppError } from "../errors/AppError";
import { isValidId } from "../utils/validators";

export interface LivroInput {
  titulo: string;
  autor: string;
  totalPaginas: number;
  generoId?: number | null;
  capaUrl?: string | null;
}

// Valida tipos e tamanhos (os limites seguem as colunas da tabela livros)
function validateLivro(input: LivroInput) {
  if (typeof input.titulo !== "string" || input.titulo.trim() === "") {
    throw new AppError("O título do livro é obrigatório.", 400, "VALIDATION_ERROR");
  }
  if (input.titulo.trim().length > 200) {
    throw new AppError("O título deve ter no máximo 200 caracteres.", 400, "VALIDATION_ERROR");
  }

  if (typeof input.autor !== "string" || input.autor.trim() === "") {
    throw new AppError("O autor do livro é obrigatório.", 400, "VALIDATION_ERROR");
  }
  if (input.autor.trim().length > 150) {
    throw new AppError("O autor deve ter no máximo 150 caracteres.", 400, "VALIDATION_ERROR");
  }

  if (
    !Number.isInteger(input.totalPaginas) ||
    input.totalPaginas <= 0 ||
    input.totalPaginas > 2147483647
  ) {
    throw new AppError("O número total de páginas deve ser um inteiro maior que zero.", 400, "VALIDATION_ERROR");
  }

  if (input.capaUrl !== undefined && input.capaUrl !== null) {
    if (typeof input.capaUrl !== "string" || input.capaUrl.length > 255) {
      throw new AppError("A capaUrl deve ser um texto de até 255 caracteres.", 400, "VALIDATION_ERROR");
    }
  }
}

// Confere o gênero quando ele é informado (não enviado ou null não precisam de conferência)
async function validateGenero(generoId?: number | null) {
  if (generoId === undefined || generoId === null) {
    return;
  }
  if (!isValidId(generoId)) {
    throw new AppError("O generoId deve ser um número inteiro positivo.", 400, "VALIDATION_ERROR");
  }
  const genero = await generosRepository.findById(generoId);
  if (!genero) {
    throw new AppError("Gênero não encontrado.", 404, "GENERO_NOT_FOUND");
  }
}

export async function listAll(busca?: string) {
  return await livrosRepository.findAll(busca);
}

export async function getById(id: number) {
  const livro = await livrosRepository.findById(id);
  if (!livro) {
    throw new AppError("Livro não encontrado no catálogo.", 404, "NOT_FOUND");
  }
  return livro;
}

export async function create(input: LivroInput) {
  validateLivro(input);
  await validateGenero(input.generoId);

  const titulo = input.titulo.trim();
  const autor = input.autor.trim();

  const jaExiste = await livrosRepository.findByTituloAutor(titulo, autor);
  if (jaExiste) {
    throw new AppError("Já existe um livro com este título e autor.", 409, "LIVRO_ALREADY_EXISTS");
  }

  const novoLivro = await livrosRepository.create({
    titulo,
    autor,
    total_paginas: input.totalPaginas,
    genero_id: input.generoId ?? null,
    capa_url: input.capaUrl ?? null,
  });

  return novoLivro;
}

export async function remove(id: number) {
  const emUso = await livrosRepository.countLeituras(id);
  if (emUso > 0) {
    throw new AppError(
      "Este livro está na lista de leituras de algum usuário e não pode ser removido.",
      409,
      "LIVRO_IN_USE"
    );
  }
  
  const removido = await livrosRepository.remove(id);
  if (!removido) {
    throw new AppError("Livro não encontrado para remoção.", 404, "NOT_FOUND");
  }
}

export async function updateCapa(id: number, capaUrl: string) {
  const livro = await livrosRepository.updateCapa(id, capaUrl);
  if (!livro) {
    throw new AppError("Livro não encontrado.", 404, "NOT_FOUND");
  }
  return livro;
}
export async function update(id: number, input: LivroInput) {
  validateLivro(input);

  const atual = await livrosRepository.findById(id);
  if (!atual) {
    throw new AppError("Livro não encontrado.", 404, "NOT_FOUND");
  }

  await validateGenero(input.generoId);

  const titulo = input.titulo.trim();
  const autor = input.autor.trim();

  const duplicado = await livrosRepository.findByTituloAutor(titulo, autor, id);
  if (duplicado) {
    throw new AppError("Já existe um livro com este título e autor.", 409, "LIVRO_ALREADY_EXISTS");
  }

  // Gênero não enviado mantém o atual. Enviado (inclusive null) usa o novo valor
  const generoId = input.generoId === undefined ? atual.genero_id : input.generoId;

  const livro = await livrosRepository.update(id, {
    titulo,
    autor,
    total_paginas: input.totalPaginas,
    genero_id: generoId,
  });

  if (!livro) {
    throw new AppError("Livro não encontrado.", 404, "NOT_FOUND");
  }

  return livro;
}