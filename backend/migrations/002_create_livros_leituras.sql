-- 3. Tabela do Catálogo de Livros
CREATE TABLE IF NOT EXISTS livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150) NOT NULL,
    total_paginas INTEGER NOT NULL CHECK (total_paginas > 0),
    genero_id INTEGER REFERENCES generos(id) ON DELETE SET NULL,
    capa_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 4. Tabela de Leituras (Progresso pessoal do leitor)
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
