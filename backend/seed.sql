-- 1. Limpa dados antigos e reseta os contadores de ID para 1
TRUNCATE TABLE resenhas, metas, leituras, livros, generos, users RESTART IDENTITY CASCADE;

-- 2. Gêneros Literários
INSERT INTO generos (nome) VALUES 
('Ficção Científica'),
('Fantasia'),
('Romance'),
('Não-Ficção'),
('Terror');

-- 3. Usuários de Teste (Senha: '123456')
INSERT INTO users (name, email, password) VALUES 
('Mallu Leitora', 'mallu@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Maria Fernanda', 'maria@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'),
('Ellen Silva', 'ellen@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy');

-- 4. Catálogo de Livros
INSERT INTO livros (titulo, autor, total_paginas, genero_id, capa_url) VALUES 
('Duna', 'Frank Herbert', 680, 1, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'),
('O Hobbit', 'J.R.R. Tolkien', 310, 2, 'https://images.unsplash.com/photo-1512820790803-83ca734da794'),
('Orgulho e Preconceito', 'Jane Austen', 424, 3, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e'),
('Sapiens: Uma Breve História da Humanidade', 'Yuval Noah Harari', 464, 4, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6'),
('O Iluminado', 'Stephen King', 464, 5, 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5');

-- 5. Leituras dos Usuários
INSERT INTO leituras (user_id, livro_id, paginas_lidas, status, data_inicio) 
VALUES (1, 1, 340, 'LENDO', '2026-10-01');

INSERT INTO leituras (user_id, livro_id, paginas_lidas, status, data_inicio, data_fim) 
VALUES (1, 2, 310, 'LIDO', '2026-09-10', '2026-09-25');

INSERT INTO leituras (user_id, livro_id, paginas_lidas, status) 
VALUES (1, 3, 0, 'QUERO_LER');

-- 6. Resenha
INSERT INTO resenhas (leitura_id, avaliacao, comentario) 
VALUES (2, 5, 'História incrível e leitura muito fluida!');

-- 7. Metas Literárias Anuais
INSERT INTO metas (user_id, ano, meta_livros) 
VALUES 
(1, 2026, 12),
(2, 2026, 15),
(3, 2026, 10);