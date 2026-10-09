/**
 * Script de Seed - Dados Iniciais para o Diário Literário
 * Arquivo: src/database/seeds.ts
 */
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_PATH = './diario_literario.db';

async function runSeeds() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  console.log('Inserindo dados iniciais (seeds)...');

  // 1. Usuário de teste inicial
  await db.run(`
    INSERT OR IGNORE INTO users (id, nome, email, senha_hash)
    VALUES (1, 'Leitor Teste', 'demo@diarioliterario.app', 'hash_senha_teste_123')
  `);

  // 2. Livros de exemplo com diferentes status
  const books = [
    [1, 1, 'O Hobbit', 'J.R.R. Tolkien', 'Fantasia', 310, 'lido'],
    [2, 1, 'O Sol é Para Todos', 'Harper Lee', 'Ficção Clássica', 364, 'lendo'],
    [3, 1, 'Percy Jackson e o Ladrão de Raios', 'Rick Riordan', 'Aventura', 400, 'quero_ler'],
  ];

  for (const book of books) {
    await db.run(
      `INSERT OR IGNORE INTO books (id, user_id, titulo, autor, genero, total_paginas, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      book
    );
  }

  // 3. Registros de leitura e avaliações de exemplo
  // Livro concluído com nota e resenha
  await db.run(`
    INSERT OR IGNORE INTO reading_logs (id, book_id, pagina_atual, data_inicio, data_conclusao, nota, resenha)
    VALUES (1, 1, 310, '2026-09-01', '2026-09-15', 5, 'Livro muito divertido e leitura fluida.')
  `);

  // Livro em andamento (sem nota ou data de conclusão)
  await db.run(`
    INSERT OR IGNORE INTO reading_logs (id, book_id, pagina_atual, data_inicio, data_conclusao, nota, resenha)
    VALUES (2, 2, 180, '2026-10-01', NULL, NULL, NULL)
  `);

  await db.close();
  console.log('Seeds inseridas com sucesso!');
}

runSeeds().catch((err) => {
  console.error('Erro ao executar seeds:', err);
});
