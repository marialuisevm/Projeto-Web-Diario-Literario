import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import { AppError } from "../errors/AppError";

const JWT_SECRET = process.env.JWT_SECRET || "sua_chave_secreta_jwt_padrao";

export class AuthService {
  async register(nome: string, email: string, senha: string) {
    if (!nome || !email || !senha) {
      throw new AppError("Nome, email e senha são obrigatórios.", 400);
    }

    // Verifica se o usuário já existe
    const userExists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      throw new AppError("Já existe um usuário cadastrado com este e-mail.", 409);
    }

    // Criptografa a senha
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);

    // Insere o novo usuário (ajuste 'senha' para 'senha_hash' se for o nome da coluna no seu seed)
    const result = await pool.query(
      "INSERT INTO users (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, created_at",
      [nome, email, senhaHash]
    );

    return result.rows[0];
  }

  async login(email: string, senha: string) {
    if (!email || !senha) {
      throw new AppError("Email e senha são obrigatórios.", 400);
    }

    // Busca o usuário pelo e-mail
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    // Compara a senha informada com a senha criptografada do banco
    const senhaValida = await bcrypt.compare(senha, user.senha || user.senha_hash);

    if (!senhaValida) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
      token,
    };
  }
}

export const authService = new AuthService();