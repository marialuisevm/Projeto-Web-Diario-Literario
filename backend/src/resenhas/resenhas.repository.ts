import { pool } from "../db";

export interface ResenhaRow {
  id: number;
  leitura_id: number;
  avaliacao: number;
  comentario: string | null;
  created_at: Date;
  livro_id?: number;
  titulo?: string;
  autor?: string;
  capa_url?: string | null;
}

export interface CreateResenhaDTO {
  leitura_id: number;
  avaliacao: number;
  comentario?: string | null;
}

export interface UpdateResenhaDTO {
  avaliacao: number;
  comentario?: string | null;
}

// Busca as resenhas do usuário da mais rcente pra mais antiga
export async function findByUser(userId: number, avaliacao?: number): Promise<ResenhaRow[]> {
  let query = `
    SELECT
      r.id, r.leitura_id, r.avaliacao, r.comentario, r.created_at,
      l.livro_id, b.titulo, b.autor, b.capa_url
    FROM resenhas r
    JOIN leituras l ON r.leitura_id = l.id
    JOIN livros b ON l.livro_id = b.id
    WHERE l.user_id = $1
  `;
  const values: any[] = [userId];

  if (avaliacao) {
    query += " AND r.avaliacao = $2";
    values.push(avaliacao);
  }

  query += " ORDER BY r.created_at DESC;";

  const result = await pool.query(query, values);
  return result.rows;
}

// Busca uma resenha específica, exigindo que pertença ao usuário
export async function findById(id: number, userId: number): Promise<ResenhaRow | null> {
  const query = `
    SELECT
      r.id, r.leitura_id, r.avaliacao, r.comentario, r.created_at,
      l.livro_id, b.titulo, b.autor, b.capa_url
    FROM resenhas r
    JOIN leituras l ON r.leitura_id = l.id
    JOIN livros b ON l.livro_id = b.id
    WHERE r.id = $1 AND l.user_id = $2
    LIMIT 1;
  `;
  const result = await pool.query(query, [id, userId]);
  return result.rows[0] ?? null;
}

export async function findByLeitura(leituraId: number): Promise<ResenhaRow | null> {
  const query = "SELECT * FROM resenhas WHERE leitura_id = $1 LIMIT 1;";
  const result = await pool.query(query, [leituraId]);
  return result.rows[0] ?? null;
}

export async function create(data: CreateResenhaDTO): Promise<ResenhaRow> {
  const query = `
    INSERT INTO resenhas (leitura_id, avaliacao, comentario)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [data.leitura_id, data.avaliacao, data.comentario ?? null];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function update(
  id: number,
  userId: number,
  data: UpdateResenhaDTO
): Promise<ResenhaRow | null> {
  const query = `
    UPDATE resenhas 
    SET avaliacao = $1, comentario = $2
    WHERE id = $3 
      AND leitura_id IN ( SELECT id FROM leituras WHERE user_id = $4)
    RETURNING *;
  `;
  const result = await pool.query(query, [data.avaliacao, data.comentario ?? null, id, userId]);
  return result.rows[0] ?? null;
}

export async function remove(id: number, userId: number): Promise<boolean> {
  const result = await pool.query(  
    `DELETE FROM resenhas
    WHERE id = $1 
      AND leitura_id IN (SELECT id FROM leituras WHERE user_id = $2);`, 
      [id, userId]
  );
  return (result.rowCount ?? 0) > 0;
}