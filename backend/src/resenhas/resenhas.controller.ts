import { Request, Response, NextFunction } from "express";
import * as resenhasService from "./resenhas.service";
import { AppError } from "../errors/AppError";

// Lista as resenhas do usuário
export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const avaliacao = req.query.avaliacao !== undefined ? Number(req.query.avaliacao) : undefined;

    const resenhas = await resenhasService.listUserResenhas(userId, avaliacao);
    res.status(200).json(resenhas);
  } catch (error) {
    next(error);
  }
}

// Converte req.params.id para número. Se não for número, apresenta status 400
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(new AppError("ID de resenha inválido.", 400, "INVALID_ID"));
    }

    const resenha = await resenhasService.getResenhaById(id, userId);
    res.status(200).json(resenha);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const { leituraId, avaliacao, comentario } = req.body;

    if (!leituraId || avaliacao === undefined) {
      return next(
        new AppError("Campos obrigatórios: leituraId e avaliacao.", 400, "VALIDATION_ERROR")
      );
    }

    const novaResenha = await resenhasService.create(userId, {
      leituraId: Number(leituraId),
      avaliacao: Number(avaliacao),
      comentario: comentario ?? null,
    });

    res.status(201).json({
      message: "Resenha criada com sucesso!",
      resenha: novaResenha,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const { avaliacao, comentario } = req.body;

    if (isNaN(id) || avaliacao === undefined) {
      return next(
        new AppError("Informe o ID da resenha e a avaliacao.", 400, "VALIDATION_ERROR")
      );
    }

    const atualizada = await resenhasService.update(id, userId, {
      avaliacao: Number(avaliacao),
      comentario: comentario ?? null,
    });

    res.status(200).json({
      message: "Resenha atualizada com sucesso!",
      resenha: atualizada,
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
      return next(new AppError("ID de resenha inválido.", 400, "INVALID_ID"));
    }

    await resenhasService.remove(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}