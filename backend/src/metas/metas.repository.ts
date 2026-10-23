import { pool } from '../db';

export interface MetaRow {
  id: number;
  user_id: number;
  ano: number;
  meta_livros: number;
  created_at: Date;
}

export interface CreateMetaDTO {
  ano: number;
  meta_livros: number;
}

export interface UpdateMetaDTO {
  meta_livros: number;
}

// Lista todas as metas do usuário, da mais recente pra mais antiga
export async function findByUser(userId: number): Promise<MetaRow[]> {
  const query = `
    SELECT id, user_id, ano, meta_livros, created_at
    FROM metas
    WHERE user_id = $1
    ORDER BY ano DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
}

// Busca a meta pelo id exigindo que seja do usuário
export async function findById(id: number, userId: number): Promise<MetaRow | null> {
  const query = `
  SELECT id, user_id, ano, meta_livros, created_at
  FROM metas
  WHERE id = $1 AND user_id = $2
  LIMIT 1;
  `;
  const result = await pool.query(query, [id, userId]);
  return result.rows[0] ?? null;
}

// Busca a meta de um ano específico
export async function findByUserAndAno(userId: number, ano: number): Promise<MetaRow | null> {
  const query = "SELECT * FROM metas WHERE user_id = $1 AND ano = $2 LIMIT 1";
  const result = await pool.query(query, [userId, ano]);
  return result.rows[0] ?? null;
}

export async function create(userId: number, data: CreateMetaDTO): Promise<MetaRow> {
  const query =`
    INSERT INTO metas (user_id, ano, meta_livros)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;
    const result = await pool.query(query, [userId, data.ano, data.meta_livros]);
  return result.rows[0];
}

export async function update(
  id: number,
  userId: number,
  data: UpdateMetaDTO
): Promise<MetaRow | null> {
  const query = `
  UPDATE metas
  SET meta_livros = $1
  WHERE id = $2 AND user_id = $3
  RETURNING *;
  `;
  const result = await pool.query(query, [data.meta_livros, id, userId]);
  return result.rows[0] ?? null;
}

export async function remove(id: number, userId: number): Promise<boolean> {
  const result = await pool.query(
    "DELETE FROM metas WHERE id = $1 AND user_id = $2;",
    [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
}

// Conta os livros concluídos no ano 
export async function countLivrosLidos(userId: number, ano: number): Promise<number> {
  const query = `
    SELECT COUNT(*)::int AS total
    FROM leituras
    WHERE user_id = $1
      AND status = 'LIDO'
      AND EXTRACT(YEAR FROM data_fim) = $2;
    `;
  const result = await pool.query(query, [userId, ano]);
  return result.rows[0].total;
}