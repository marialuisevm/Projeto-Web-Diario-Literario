import { Request, Response, NextFunction } from "express";
import * as livrosService from "./livros.service";
import { AppError } from "../errors/appError";
import fs from "fs";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const busca = req.query.busca as string | undefined;
    const livros = await livrosService.listAll(busca);
    res.status(200).json(livros);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new AppError("ID de livro inválido.", 400, "INVALID_ID"));
    }

    const livro = await livrosService.getById(id);
    res.status(200).json(livro);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { titulo, autor, totalPaginas, generoId, capaUrl } = req.body;

    const novoLivro = await livrosService.create({
      titulo,
      autor,
      totalPaginas: Number(totalPaginas),
      generoId: generoId ? Number(generoId) : null,
      capaUrl: capaUrl ?? null,
    });

    res.status(201).json({
      message: "Livro adicionado ao catálogo com sucesso!",
      livro: novoLivro,
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new AppError("ID de livro inválido.", 400, "INVALID_ID"));
    }

    await livrosService.remove(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function uploadCapa(req: Request, res: Response, next: NextFunction) {
  const arquivo = req.file;
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return next(new AppError("ID de livro inválido.", 400, "INVALID_ID"));
    }

    if (!arquivo) {
      return next(new AppError("Envie uma imagem no campo 'capa'.", 400, "FILE_REQUIRED"));
    }

    const livro = await livrosService.updateCapa(id, `/uploads/${arquivo.filename}`);
    res.status(200).json({
      message: "Capa enviada com sucesso!",
      livro,
    });
  } catch (error) {
    // Se deu erro depois de salvar a imagem, apaga o arquivo para não ficar lixo na pasta
    if (arquivo) {
      fs.unlink(arquivo.path, () => {});
    }
    next(error);
  }
}