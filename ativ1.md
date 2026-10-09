# Atividade 1 - Arquitetura de Banco de Dados e Endpoints Iniciais (Diário Literário)

### 1. Quais tabelas você definiu inicialmente?
Defini três tabelas principais para suportar a regra de negócio essencial:
- **`users`:** Armazena as informações dos leitores cadastrados (`id`, `nome`, `email`, `senha_hash` e `created_at`).
- **`books`:** Armazena os livros da biblioteca pessoal (`id`, `user_id` como chave estrangeira, `titulo`, `autor`, `genero`, `total_paginas`, `status` [*"quero_ler"*, *"lendo"*, *"lido"*] e `created_at`).
- **`reading_logs`:** Registra o progresso e avaliações de cada obra (`id`, `book_id` como chave estrangeira, `pagina_atual`, `data_inicio`, `data_conclusao`, `nota` [1 a 5], `resenha` e `updated_at`).

### 2. Você utilizou migrations? Se sim, quantas migrations? Descreva em uma frase o que cada uma faz.
Sim, utilizei 1 migration inicial (`src/database/migrations/001_create_initial_tables.ts`):
- **Migration 1 (`001_create_initial_tables.ts`):** Cria a estrutura relacional inicial das tabelas `users`, `books` e `reading_logs`, configurando chaves primárias, índices, chaves estrangeiras com integridade referencial e valores padrão.

### 3. Qual o caminho do arquivo que gera a seed do seu banco?
`src/database/seeds.ts`

### 4. Quais os endpoints que você irá implementar inicialmente?
- `POST /auth/register` — Criação de conta do usuário/leitor.
- `POST /auth/login` — Autenticação e emissão do token JWT.
- `GET /books` — Listagem dos livros do usuário autenticado (com suporte a filtros por status).
- `POST /books` — Cadastro de um novo livro no acervo pessoal.
- `PATCH /books/:id/progress` — Atualização do progresso de leitura (página atual, alteração de status e datas).

### 5. Você está usando algum framework para escrever os endpoints da sua API? Se sim, qual?
Sim. Utilizei o **Fastify** com **TypeScript**. A escolha pelo ecossistema TypeScript com Fastify se deu pela tipagem estática ponta a ponta, alto desempenho de I/O, segurança em tempo de compilação e integração facilitada com bibliotecas de validação de schemas (como Zod ou TypeBox), além de simplificar a geração de documentação de rotas com Swagger/OpenAPI.
