import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../errors/AppError";

// Pasta onde as imagens serão guardadas (backend/uploads)
const pastaUploads = path.resolve("uploads");
fs.mkdirSync(pastaUploads, { recursive: true });

// Onde e com que nome o arquivo é salvo
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUploads);
  },
  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname).toLowerCase();
    const nomeUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extensao}`;
    cb(null, nomeUnico);
  },
});

// Só aceita imagens
const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError("Envie uma imagem JPG, PNG ou WEBP.", 400, "INVALID_FILE_TYPE"));
    }
  },
});

// Middleware usado na rota: espera um arquivo no campo "capa"
export function uploadCapa(req: Request, res: Response, next: NextFunction) {
  upload.single("capa")(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new AppError("A imagem deve ter no máximo 2 MB.", 400, "FILE_TOO_LARGE"));
      }
      return next(new AppError("Erro ao enviar o arquivo.", 400, "UPLOAD_ERROR"));
    }
    if (err) {
      return next(err);
    }
    next();
  });
}