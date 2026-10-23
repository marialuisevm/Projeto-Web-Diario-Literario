import * as livrosRepository from "./livros.repository";
import { AppError } from "../errors/appError";

export interface LivroInput {
  titulo: string;
  autor: string;
  totalPaginas: number;
  generoId?: number | null;
  capaUrl?: string | null;
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
  if (!input.titulo || input.titulo.trim() === "") {
    throw new AppError("O título do livro é obrigatório.", 400, "VALIDATION_ERROR");
  }

  if (!input.autor || input.autor.trim() === "") {
    throw new AppError("O autor do livro é obrigatório.", 400, "VALIDATION_ERROR");
  }

  if (!input.totalPaginas || input.totalPaginas <= 0) {
    throw new AppError("O número total de páginas deve ser superior a zero.", 400, "VALIDATION_ERROR");
  }

  const novoLivro = await livrosRepository.create({
    titulo: input.titulo.trim(),
    autor: input.autor.trim(),
    total_paginas: input.totalPaginas,
    genero_id: input.generoId ?? null,
    capa_url: input.capaUrl ?? null,
  });

  return novoLivro;
}

export async function remove(id: number) {
  const removido = await livrosRepository.remove(id);
  if (!removido) {
    throw new AppError("Livro não encontrado para remoção.", 404, "NOT_FOUND");
  }
}
