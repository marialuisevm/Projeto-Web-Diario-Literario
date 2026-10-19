import { pool } from "../db";

export interface LeituraRow {
  id: number;
  user_id: number;
  livro_id: number;
  paginas_lidas: number;
  status: string;
  data_inicio: string | null;
  data_fim: string | null;
  created_at: Date;
  titulo?: string;
  autor?: string;
  total_paginas?: number;
  capa_url?: string | null;
}

export async function findByUser(userId: number, status?: string): Promise<LeituraRow[]> {
  let query = `
    SELECT 
      l.id, l.user_id, l.livro_id, l.paginas_lidas, l.status, 
      l.data_inicio, l.data_fim, l.created_at,
      b.titulo, b.autor, b.total_paginas, b.capa_url
    FROM leituras l
    JOIN livros b ON l.livro_id = b.id
    WHERE l.user_id = $1
  `;
  const values: any[] = [userId];

  if (status) {
    query += " AND l.status = $2";
    values.push(status);
  }

  query += " ORDER BY l.created_at DESC;";

  const result = await pool.query(query, values);
  return result.rows;
}

export async function findById(id: number, userId: number): Promise<LeituraRow | null> {
  const query = `
    SELECT 
      l.id, l.user_id, l.livro_id, l.paginas_lidas, l.status, 
      l.data_inicio, l.data_fim, l.created_at,
      b.titulo, b.autor, b.total_paginas, b.capa_url
    FROM leituras l
    JOIN livros b ON l.livro_id = b.id
    WHERE l.id = $1 AND l.user_id = $2
    LIMIT 1;
  `;
  const result = await pool.query(query, [id, userId]);
  return result.rows[0] ?? null;
}

export async function findByUserAndLivro(userId: number, livroId: number): Promise<LeituraRow | null> {
  const query = "SELECT * FROM leituras WHERE user_id = $1 AND livro_id = $2 LIMIT 1;";
  const result = await pool.query(query, [userId, livroId]);
  return result.rows[0] ?? null;
}

export async function create(
  userId: number,
  livroId: number,
  status = "QUERO_LER",
  paginasLidas = 0
): Promise<LeituraRow> {
  const dataInicio = status === "LENDO" ? "NOW()" : "NULL";
  const query = `
    INSERT INTO leituras (user_id, livro_id, paginas_lidas, status, data_inicio)
    VALUES ($1, $2, $3, $4, ${dataInicio})
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, livroId, paginasLidas, status]);
  return result.rows[0];
}

export async function updateProgress(
  id: number,
  userId: number,
  paginasLidas: number,
  status: string,
  dataFim: string | null
): Promise<LeituraRow | null> {
  const query = `
    UPDATE leituras
    SET paginas_lidas = $1, status = $2, data_fim = $3
    WHERE id = $4 AND user_id = $5
    RETURNING *;
  `;
  const result = await pool.query(query, [paginasLidas, status, dataFim, id, userId]);
  return result.rows[0] ?? null;
}

export async function remove(id: number, userId: number): Promise<boolean> {
  const result = await pool.query(
    "DELETE FROM leituras WHERE id = $1 AND user_id = $2;",
    [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
}
