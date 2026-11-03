import { Request, Response, NextFunction } from "express";
import * as leiturasService from "./leituras.service";
import { AppError } from "../errors/AppError";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const status = req.query.status as string | undefined;

    const leituras = await leiturasService.listUserLeituras(userId, status);
    res.json(leituras);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return next(new AppError("ID de leitura inválido.", 400, "INVALID_ID"));
    }

    const leitura = await leiturasService.getLeituraById(id, userId);
    res.json(leitura);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const { livroId, status } = req.body;

    if (!livroId) {
      return next(new AppError("O campo 'livroId' é obrigatório.", 400, "VALIDATION_ERROR"));
    }

    const novaLeitura = await leiturasService.addLivroParaLeitura(
      userId,
      Number(livroId),
      status
    );

    res.status(201).json({
      message: "Livro adicionado à sua lista!",
      leitura: novaLeitura,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProgresso(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as any).userId;
    const id = Number(req.params.id);
    const { paginasLidas } = req.body;

    if (isNaN(id) || paginasLidas === undefined) {
      return next(new AppError("Informe o ID e a quantidade de paginasLidas.", 400, "VALIDATION_ERROR"));
    }

    const atualizado = await leiturasService.updateProgress(id, userId, Number(paginasLidas));

    res.json({
      message: "Progresso atualizado com sucesso!",
      leitura: atualizado,
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
      return next(new AppError("ID de leitura inválido.", 400, "INVALID_ID"));
    }

    await leiturasService.removeLeitura(id, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
