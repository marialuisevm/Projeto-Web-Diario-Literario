-- 5. Tabela de Resenhas e Avaliações
CREATE TABLE IF NOT EXISTS resenhas (
    id SERIAL PRIMARY KEY,
    leitura_id INTEGER NOT NULL UNIQUE REFERENCES leituras(id) ON DELETE CASCADE,
    avaliacao INTEGER NOT NULL CHECK (avaliacao >= 1 AND avaliacao <= 5),
    comentario TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 6. Tabela de Metas de Leitura Anuais
CREATE TABLE IF NOT EXISTS metas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ano INTEGER NOT NULL,
    meta_livros INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_meta_ano UNIQUE (user_id, ano)
);
