import { pool } from "../db";

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export async function findByEmail(email: string): Promise<UserRow | null> {
  const query = "SELECT * FROM users WHERE email = $1 LIMIT 1;";
  const result = await pool.query(query, [email]);
  return result.rows[0] ?? null;
}

export async function findById(id: number): Promise<UserRow | null> {
  const query = "SELECT id, name, email, created_at FROM users WHERE id = $1 LIMIT 1;";
  const result = await pool.query(query, [id]);
  return result.rows[0] ?? null;
}

export async function create(name: string, email: string, passwordHash: string): Promise<UserRow> {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, name, email, created_at;
  `;
  const result = await pool.query(query, [name, email, passwordHash]);
  return result.rows[0];
}
