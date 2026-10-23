import { pool } from "../db";

export interface GeneroRow {
  id: number;
  nome: string;
}

export interface CreateGeneroDTO {
  nome: string
}

// Lista os gêneros ordenados por nome
export async function findAll(busca?: string): Promise<GeneroRow[]> {
  let query = "SELECT id, nome FROM generos";
  const values: any[] = [];

  // Não diferencia maiúsculas de minúsculas e busca por trecho
  if (busca) {
    query += " WHERE nome ILIKE $1";
    values.push(`%${busca}%`);
  }

  query += " ORDER BY nome ASC;";

  const result = await pool.query(query, values);
  return result.rows
}

// Faz a busca pelo id
export async function findById(id: number): Promise<GeneroRow | null> {
  const query = "SELECT id, nome FROM generos WHERE id = $1 LIMIT 1;";
  const result = await pool.query(query, [id]);
  return result.rows[0] ?? null;
}

// Usada pelo service para impedir gênero duplicado antes de criar ou atualizar
export async function findByNome(nome: string): Promise<GeneroRow | null> {
  const query =  "SELECT id, nome FROM generos WHERE nome ILIKE $1 LIMIT 1;";
  const result = await pool.query(query, [nome]);
  return result.rows[0] ?? null;
}

export async function create(data: CreateGeneroDTO): Promise<GeneroRow> {
  const query = `
    INSERT INTO generos (nome)
    VALUES ($1)
    RETURNING *;
  `;
  const result = await pool.query(query, [data.nome]);
  return result.rows[0];
}

// Altera o nome do gênero
export async function update(id: number, data: CreateGeneroDTO): Promise<GeneroRow | null> {
  const query = `
    UPDATE generos
    SET nome = $1
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [data.nome, id]);
  return result.rows[0] ?? null;
}

export async function remove(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM generos WHERE id = $1;", [id]);
  return (result.rowCount ?? 0) > 0;
}