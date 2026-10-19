-- Habilita criptografia caso necessário
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. Gêneros Literários
CREATE TABLE IF NOT EXISTS generos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(80) NOT NULL UNIQUE
);

-- 3. Catálogo de Livros
CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150) NOT NULL,
    total_paginas INTEGER NOT NULL CHECK (total_paginas > 0),
    genero_id INTEGER REFERENCES generos(id) ON DELETE SET NULL,
    capa_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. Leituras (Acompanhamento e progresso de cada leitor)
CREATE TABLE IF NOT EXISTS leituras (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    livro_id INTEGER NOT NULL REFERENCES livros(id) ON DELETE CASCADE,
    paginas_lidas INTEGER NOT NULL DEFAULT 0 CHECK (paginas_lidas >= 0),
    status VARCHAR(20) NOT NULL DEFAULT 'QUERO_LER' CHECK (status IN ('QUERO_LER', 'LENDO', 'LIDO', 'ABANDONADO')),
    data_inicio DATE,
    data_fim DATE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_livro UNIQUE (user_id, livro_id)
);

-- 5. Resenhas e Avaliações
CREATE TABLE IF NOT EXISTS resenhas (
    id SERIAL PRIMARY KEY,
    leitura_id INTEGER NOT NULL UNIQUE REFERENCES leituras(id) ON DELETE CASCADE,
    avaliacao INTEGER NOT NULL CHECK (avaliacao >= 1 AND avaliacao <= 5),
    comentario TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 6. Metas Literárias Anuais
CREATE TABLE IF NOT EXISTS metas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ano INTEGER NOT NULL,
    meta_livros INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_meta_ano UNIQUE (user_id, ano)
);
