import { Request, Response, NextFunction } from "express";
import * as livrosService from "./livros.service";
import { AppError } from "../errors/AppError";
import fs from "fs";
import { isValidId } from "../utils/validators";

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
    if (!isValidId(id)) {
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
      generoId: generoId === undefined || generoId === null ? null : Number(generoId),
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
    if (!isValidId(id)) {
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

    // O multer já salvou a imagem antes de chegar aqui, então qualquer falha precisa apagá-la
  const apagarArquivo = () => {
    if (arquivo) {
      fs.unlink(arquivo.path, () => {});
    }
  };

  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      apagarArquivo();
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
    apagarArquivo();
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return next(new AppError("ID de livro inválido.", 400, "INVALID_ID"));
    }

    const { titulo, autor, totalPaginas, generoId } = req.body;

    const livro = await livrosService.update(id, {
      titulo,
      autor,
      totalPaginas: Number(totalPaginas),
      // generoId não enviado: mantém o gênero atual. null: remove o gênero
      generoId: generoId === undefined || generoId === null ? generoId : Number(generoId),
    });

    res.status(200).json({
      message: "Livro atualizado com sucesso!",
      livro,
    });
  } catch (error) {
    next(error);
  }
}