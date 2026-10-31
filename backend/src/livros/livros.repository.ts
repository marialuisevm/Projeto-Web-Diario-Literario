import { pool } from "../db";

export interface LivroRow {
  id: number;
  titulo: string;
  autor: string;
  total_paginas: number;
  genero_id: number | null;
  genero_nome?: string;
  capa_url: string | null;
  created_at: Date;
}

export interface CreateLivroDTO {
  titulo: string;
  autor: string;
  total_paginas: number;
  genero_id?: number | null;
  capa_url?: string | null;
}

export async function findAll(busca?: string): Promise<LivroRow[]> {
  let query = `
    SELECT l.id, l.titulo, l.autor, l.total_paginas, l.genero_id, l.capa_url, l.created_at,
           g.nome AS genero_nome
    FROM livros l
    LEFT JOIN generos g ON l.genero_id = g.id
  `;
  const values: any[] = [];

  if (busca) {
    query += " WHERE l.titulo ILIKE $1 OR l.autor ILIKE $1";
    values.push(`%${busca}%`);
  }

  query += " ORDER BY l.titulo ASC;";

  const result = await pool.query(query, values);
  return result.rows;
}

export async function findById(id: number): Promise<LivroRow | null> {
  const query = `
    SELECT l.id, l.titulo, l.autor, l.total_paginas, l.genero_id, l.capa_url, l.created_at,
           g.nome AS genero_nome
    FROM livros l
    LEFT JOIN generos g ON l.genero_id = g.id
    WHERE l.id = $1
    LIMIT 1;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function create(data: CreateLivroDTO): Promise<LivroRow> {
  const query = `
    INSERT INTO livros (titulo, autor, total_paginas, genero_id, capa_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const values = [
    data.titulo,
    data.autor,
    data.total_paginas,
    data.genero_id ?? null,
    data.capa_url ?? null,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

export async function remove(id: number): Promise<boolean> {
  const result = await pool.query("DELETE FROM livros WHERE id = $1;", [id]);
  return (result.rowCount ?? 0) > 0;
}
export async function updateCapa(id: number, capaUrl: string): Promise<LivroRow | null> {
  const query = `
    UPDATE livros
    SET capa_url = $1
    WHERE id = $2
    RETURNING *;
  `;
  const result = await pool.query(query, [capaUrl, id]);
  return result.rows[0] ?? null;
}
export async function update(id: number, data: CreateLivroDTO): Promise<LivroRow | null> {
  const query = `
    UPDATE livros
    SET titulo = $1, autor = $2, total_paginas = $3, genero_id = $4
    WHERE id = $5
    RETURNING *;
  `;
  const values = [data.titulo, data.autor, data.total_paginas, data.genero_id ?? null, id];
  const result = await pool.query(query, values);
  return result.rows[0] ?? null;
}