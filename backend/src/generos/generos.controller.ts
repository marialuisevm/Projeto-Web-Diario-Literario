import { Request, Response, NextFunction } from "express";
import * as generosService from "./generos.service";
import { AppError } from "../errors/AppError";
import { isValidId } from "../utils/validators";

// Lê o parâmetro opcional da query string, passa pro service e responde
export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const busca = req.query.busca as string | undefined;
    const generos = await generosService.listAll(busca);
    res.status(200).json(generos);
  } catch (error) {
    next(error);
  }
}

// Converte req.params.id para número. Se não for número, apresenta status 400
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return next(new AppError("ID de gênero inválido.", 400, "INVALID_ID"));
    }

    const genero = await generosService.getById(id);
    res.status(200).json(genero);
  } catch (error) {
    next(error);
  }
}

// Extrai nome do corpo, chama o service (que valida) e responde status 201 se criado o gênero
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const { nome } = req.body;

    const novoGenero = await generosService.create({ nome });

    res.status(201).json({
      message: "Gênero criado com sucesso!",
      genero: novoGenero,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return next(new AppError("ID de gênero inválido.", 400, "INVALID_ID"));
    }

    const { nome } = req.body;

    const atualizado = await generosService.update(id, { nome });

    res.status(200).json({
      message: "Gênero atualizado com sucesso!",
      genero: atualizado,
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    if (!isValidId(id)) {
      return next(new AppError("ID de gênero inválido.", 400, "INVALID_ID"));
    }

    await generosService.remove(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}