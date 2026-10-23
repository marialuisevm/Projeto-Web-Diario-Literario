import { Request, Response, NextFunction } from "express";
import * as metasService from "./metas.service";
import { AppError } from "../errors/appError";

// Lista todas as metas do usuário cada uma com seu progresso
export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;

    const metas = await metasService.listUserMetas(userId);
    res.status(200).json(metas);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(new AppError("ID de meta inválido.", 400, "INVALID_ID"));
    }

    const meta = await metasService.getMetaById(id, userId);
    res.status(200).json(meta);
  } catch (error) {
    next(error);
  }
}

// Recebe o ano, converte para número e chama uma função do service
export async function getProgresso(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const ano = Number(req.params.ano);

    if (isNaN(ano)) {
      return next(new AppError("Ano inválido.", 400, "INVALID_YEAR"));
    }

    const progresso = await metasService.getProgressoByAno(userId, ano);
    res.status(200).json(progresso);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const { ano, metaLivros } = req.body;

    if (!ano || metaLivros === undefined) {
      return next(new AppError("Campos obrigatórios: ano e metaLivros.", 400, "VALIDATION_ERROR"));
    }

    const novaMeta = await metasService.create(userId, {
      ano: Number(ano),
      metaLivros: Number(metaLivros),
    });

    res.status(201).json({
      message: "Meta de leitura criada com sucesso!",
      meta: novaMeta,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const { metaLivros } = req.body;

    if (isNaN(id) || metaLivros === undefined) {
      return next(new AppError("Informe o ID da meta e o campo metaLivros.", 400, "VALIDATION_ERROR"));
    }

    const atualizada = await metasService.update(id, userId, {
      metaLivros: Number(metaLivros),
    });

    res.status(200).json({
      message: "Meta atualizada com sucesso!",
      meta: atualizada,
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(new AppError("ID de meta inválido.", 400, "INVALID_ID"));
    }

    await metasService.remove(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}