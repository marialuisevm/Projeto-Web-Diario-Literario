import * as metasRepository from "./metas.repository";
import { AppError } from "../errors/AppError";

export interface MetaInput {
  ano: number;
  metaLivros: number;
}

export interface UpdateMetaInput {
  metaLivros: number;
}

// Recebe a meta e a quantidade de livros lidos e devolve o progresso da meta
function formatMetaComProgresso(item: metasRepository.MetaRow, livrosLidos: number) {
  const meta = item.meta_livros;
  const porcentagem = meta > 0 ? Math.min(100, Math.round((livrosLidos / meta) * 100)) : 0;
  const faltam = Math.max(0, meta - livrosLidos);

  return {
    id: item.id,
    ano: item.ano,
    metaLivros: meta,
    livrosLidos,
    faltam,
    porcentagem,
    concluida: livrosLidos >= meta,
    createdAt: item.created_at,
  };
}

async function buildProgresso(item: metasRepository.MetaRow) {
  const livrosLidos = await metasRepository.countLivrosLidos(item.user_id, item.ano);
  return formatMetaComProgresso(item, livrosLidos);
}

// Aceita inteiros entre 2000 e o ano atual + 1, permitindo criar a meta do próximo ano
function validateAno(ano: number) {
  const anoAtual = new Date().getFullYear();

  if (!Number.isInteger(ano) || ano < 2000 || ano > anoAtual + 1) {
    throw new AppError(
      `O ano da meta deve ser um número inteiro entre 2000 e ${anoAtual + 1}.`,
      400,
      "INVALID_YEAR"
    );
  }
}

function validateMetaLivros(metaLivros: number) {
  if (!Number.isInteger(metaLivros) || metaLivros < 1) {
    throw new AppError(
      "A meta de livros deve ser um número inteiro maior que zero.",
      400,
      "INVALID_GOAL"
    );
  }
}

// Busca as metas do usuário e calcula o progresso de cada uma
export async function listUserMetas(userId: number) {
  const metas = await metasRepository.findByUser(userId);
  return await Promise.all(metas.map(buildProgresso));
}

// Busca uma meta do usuário e devolve o progresso
export async function getMetaById(id: number, userId: number) {
  const meta = await metasRepository.findById(id, userId);
  if (!meta) {
    throw new AppError("Meta não encontrada.", 404, "NOT_FOUND");
  }
  return await buildProgresso(meta);
}

// Busca a meta de um ano específico
export async function getProgressoByAno(userId: number, ano: number) {
  validateAno(ano);

  const meta = await metasRepository.findByUserAndAno(userId, ano);
  if (!meta) {
    throw new AppError("Você não definiu uma meta para este ano.", 404, "NOT_FOUND");
  }
  return await buildProgresso(meta);
}

export async function create(userId: number, input: MetaInput) {
  validateAno(input.ano);
  validateMetaLivros(input.metaLivros);

  // Verifica se o usuário já tem meta para esse ano
  const jaExiste = await metasRepository.findByUserAndAno(userId, input.ano);
  if (jaExiste) {
    throw new AppError("Você já possui uma meta para este ano.", 409, "META_ALREADY_EXISTS");
  }

  const novaMeta = await metasRepository.create(userId, {
    ano: input.ano,
    meta_livros: input.metaLivros,
  });

  return await buildProgresso(novaMeta);
}

export async function update(id: number, userId: number, input: UpdateMetaInput) {
  validateMetaLivros(input.metaLivros);

  const atualizada = await metasRepository.update(id, userId, {
    meta_livros: input.metaLivros,
  });

  if (!atualizada) {
    throw new AppError("Meta não encontrada.", 404, "NOT_FOUND");
  }

  return await buildProgresso(atualizada);
}

export async function remove(id: number, userId: number) {
  const removido = await metasRepository.remove(id, userId);
  if (!removido) {
    throw new AppError("Meta não encontrada para remoção.", 404, "NOT_FOUND");
  }
}