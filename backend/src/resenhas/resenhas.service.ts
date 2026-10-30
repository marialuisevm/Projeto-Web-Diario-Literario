import * as resenhasRepository from "./resenhas.repository";
import * as leiturasRepository from "../leituras/leituras.repository";
import { AppError } from "../errors/AppError";

export interface ResenhaInput {
  leituraId: number;
  avaliacao: number;
  comentario?: string | null;
}

export interface UpdateResenhaInput {
  avaliacao: number;
  comentario?: string | null;
}

function formatResenha(item: resenhasRepository.ResenhaRow) {
  return {
    id: item.id,
    leituraId: item.leitura_id,
    livroId: item.livro_id,
    titulo: item.titulo,
    autor: item.autor,
    capaUrl: item.capa_url,
    avaliacao: item.avaliacao,
    comentario: item.comentario,
    createdAt: item.created_at,
  };
}

// Garante que a nota seja inteira e entre 1 e 5
function validateAvaliacao(avaliacao: number) {
  if (!Number.isInteger(avaliacao) || avaliacao < 1 || avaliacao > 5) {
    throw new AppError("A avaliação deve ser um número inteiro entre 1 e 5.", 400, "INVALID_RATING");
  }
}

function cleanComentario(comentario?: string | null): string | null {
  if (comentario === undefined || comentario === null) {
    return null;
  }
  const limpo = comentario.trim();
  return limpo === "" ? null : limpo;
}

// Lista as resenhas do usuário
export async function listUserResenhas(userId: number, avaliacao?: number) {
  if (avaliacao !== undefined) {
    validateAvaliacao(avaliacao);
  }

  const resenhas = await resenhasRepository.findByUser(userId, avaliacao);
  return resenhas.map(formatResenha);
}

// Busca uma resenha do usuário
export async function getResenhaById(id: number, userId: number) {
  const resenha = await resenhasRepository.findById(id, userId);
  if (!resenha) {
    throw new AppError("Resenha não encontrada.", 404, "NOT_FOUND");
  }
  return formatResenha(resenha);
}

export async function create(userId: number, input: ResenhaInput) {
  validateAvaliacao(input.avaliacao);

  // Verifica se a leitura existe e pertence ao usuário
  const leitura = await leiturasRepository.findById(input.leituraId, userId);
  if (!leitura) {
    throw new AppError("Registro de leitura não encontrado.", 404, "NOT_FOUND");
  }

  // Só permite resenhar livros já concluídos
  if (leitura.status !== "LIDO") {
    throw new AppError(
      "Só é possível fazer a resenha de um livro que você já terminou de ler.",
      400,
      "LEITURA_NOT_FINISHED"
    );
  }

  // Verifica se essa leitura já tem resenha
  const jaExiste = await resenhasRepository.findByLeitura(input.leituraId);
  if (jaExiste) {
    throw new AppError("Esta leitura já possui uma resenha.", 409, "RESENHA_ALREADY_EXISTS");
  }

  const novaResenha = await resenhasRepository.create({
    leitura_id: input.leituraId,
    avaliacao: input.avaliacao,
    comentario: cleanComentario(input.comentario),
  });

  return formatResenha(novaResenha);
}

export async function update(id: number, userId: number, input: UpdateResenhaInput) {
  validateAvaliacao(input.avaliacao);

  const atualizada = await resenhasRepository.update(id, userId, {
    avaliacao: input.avaliacao,
    comentario: cleanComentario(input.comentario),
  });

  if (!atualizada) {
    throw new AppError("Resenha não encontrada.", 404, "NOT_FOUND");
  }

  return formatResenha(atualizada);
}

export async function remove(id: number, userId: number) {
  const removido = await resenhasRepository.remove(id, userId);
  if (!removido) {
    throw new AppError("Resenha não encontrada para remoção.", 404, "NOT_FOUND");
  }
}