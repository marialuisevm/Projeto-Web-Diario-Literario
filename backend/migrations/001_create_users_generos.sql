-- Extensão para funções criptográficas caso necessário
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Tabela de Utilizadores
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Tabela de Géneros Literários
CREATE TABLE IF NOT EXISTS generos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE
);
