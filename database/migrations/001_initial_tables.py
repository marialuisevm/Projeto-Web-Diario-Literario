/**
 * Migration inicial - Criação das tabelas base do Diário Literário
 * Arquivo: src/database/migrations/001_create_initial_tables.ts
 */
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Tabela de Usuários/Leitores
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('nome', 100).notNullable();
    table.string('email', 150).notNullable().unique();
    table.string('senha_hash', 255).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // 2. Tabela de Livros (Usuário)
  await knex.schema.createTable('books', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('titulo', 150).notNullable();
    table.string('autor', 100).notNullable();
    table.string('genero', 50).nullable();
    table.integer('total_paginas').notNullable();
    table.string('status', 20).notNullable().defaultTo('quero_ler'); // 'quero_ler', 'lendo', 'lido'
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // 3. Tabela de Registros de Leitura e Avaliações (Livro)
  await knex.schema.createTable('reading_logs', (table) => {
    table.increments('id').primary();
    table
      .integer('book_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('books')
      .onDelete('CASCADE');
    table.integer('pagina_atual').notNullable().defaultTo(0);
    table.date('data_inicio').nullable();
    table.date('data_conclusao').nullable();
    table.integer('nota').nullable(); // 1 a 5
    table.text('resenha').nullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('reading_logs');
  await knex.schema.dropTableIfExists('books');
  await knex.schema.dropTableIfExists('users');
}
