import * as leiturasRepository from "./leituras.repository";
import { pool } from "../db";
import { AppError } from "../errors/appError";

function formatLeituraComProgresso(item: leiturasRepository.LeituraRow) {
  const total = item.total_paginas ?? 1;
  const lidas = item.paginas_lidas ?? 0;
  const porcentagem = Math.min(100, Math.round((lidas / total) * 100));

  return {
    id: item.id,
    livroId: item.livro_id,
    titulo: item.titulo,
    autor: item.autor,
    totalPaginas: item.total_paginas,
    capaUrl: item.capa_url,
    paginasLidas: lidas,
    porcentagem,
    status: item.status,
    dataInicio: item.data_inicio,
    dataFim: item.data_fim,
    createdAt: item.created_at,
  };
}

export async function listUserLeituras(userId: number, status?: string) {
  const leituras = await leiturasRepository.findByUser(userId, status);
  return leituras.map(formatLeituraComProgresso);
}

export async function getLeituraById(id: number, userId: number) {
  const leitura = await leiturasRepository.findById(id, userId);
  if (!leitura) {
    throw new AppError("Registro de leitura não encontrado.", 404, "NOT_FOUND");
  }
  return formatLeituraComProgresso(leitura);
}

export async function addLivroParaLeitura(userId: number, livroId: number, status = "QUERO_LER") {
  // Verifica se o livro existe no catálogo
  const livroCheck = await pool.query("SELECT id FROM livros WHERE id = $1 LIMIT 1;", [livroId]);
  if (livroCheck.rowCount === 0) {
    throw new AppError("Livro não encontrado no catálogo.", 404, "BOOK_NOT_FOUND");
  }

  // Verifica se o usuário já adicionou esse livro
  const jaExiste = await leiturasRepository.findByUserAndLivro(userId, livroId);
  if (jaExiste) {
    throw new AppError("Este livro já está na sua lista de leituras.", 409, "ALREADY_IN_LIST");
  }

  const novaLeitura = await leiturasRepository.create(userId, livroId, status);
  return novaLeitura;
}

export async function updateProgress(id: number, userId: number, paginasLidas: number) {
  const leituraAtual = await leiturasRepository.findById(id, userId);
  if (!leituraAtual) {
    throw new AppError("Registro de leitura não encontrado.", 404, "NOT_FOUND");
  }

  const total = leituraAtual.total_paginas ?? 0;

  if (paginasLidas < 0 || paginasLidas > total) {
    throw new AppError(
      `O número de páginas lidas deve estar entre 0 e ${total}.`,
      400,
      "INVALID_PAGE_COUNT"
    );
  }

  // Atualização dinâmica de status
  let novoStatus = leituraAtual.status;
  let dataFim: string | null = leituraAtual.data_fim;

  if (paginasLidas === total) {
    novoStatus = "LIDO";
    dataFim = new Date().toISOString();
  } else if (paginasLidas > 0) {
    novoStatus = "LENDO";
  }

  const updated = await leiturasRepository.updateProgress(
    id,
    userId,
    paginasLidas,
    novoStatus,
    dataFim
  );

  return updated;
}

export async function removeLeitura(id: number, userId: number) {
  const removido = await leiturasRepository.remove(id, userId);
  if (!removido) {
    throw new AppError("Registro de leitura não encontrado.", 404, "NOT_FOUND");
  }
}
