# 📚 Diário Literário

API REST para gerenciar hábitos de leitura: catálogo de livros, leituras com progresso, resenhas e metas anuais.
Projeto da disciplina **Programação B** (UFS) — Parte 1 / Entrega 1.

**Equipe:** Maria Luíse ([@marialuisevm](https://github.com/marialuisevm)), Ellen ([@ellenkms](https://github.com/ellenkms)) e Maria Fernanda ([@mfernandasantos1307-prog](https://github.com/mfernandasantos1307-prog)).

---

## 🧩 Modelo conceitual (UML)

![UML do Diário Literário](docs/uml-diario-literario.png)

- 6 entidades: **Users, Generos, Livros, Leituras, Resenhas, Metas**.
- **Leituras** é a classe associativa da relação N:N entre Users e Livros (guarda status, páginas lidas e datas).
- Cada leitura pode ter no máximo uma **Resenha** (nota de 1 a 5).
- **Dado não estruturado:** a capa do livro (imagem), enviada por upload e guardada em `uploads/`.
- **Cálculos no backend:** porcentagem de progresso da leitura e progresso da meta anual (livros lidos, faltam, %).

---

## 🚀 Tecnologias

- Node.js + TypeScript, Express 5
- PostgreSQL (Supabase na nuvem, ou local)
- `pg`, `bcrypt`, `jsonwebtoken` (JWT), `multer` (upload), `cors`
- Swagger UI (`swagger-ui-express` + `yaml`) para documentação interativa
- `tsx` para desenvolvimento

Arquitetura em camadas: **routes → controller → service → repository**, com tratamento central de erros.

---

## 🛠️ Como rodar

Pré-requisitos: [Node.js](https://nodejs.org/) 18+, npm e um banco PostgreSQL (ou um projeto no [Supabase](https://supabase.com/)).

### 1. Clonar e instalar
```bash
git clone https://github.com/marialuisevm/Projeto-Web-Diario-Literario.git
cd Projeto-Web-Diario-Literario/backend
npm install
```

### 2. Configurar o `.env`
Copie `backend/.env.exemplo` para `backend/.env` e preencha:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:senha@host:5432/postgres
JWT_SECRET=uma_chave_secreta_sua
NODE_ENV=production
```

- `DATABASE_URL`: a connection string do banco (no Supabase, use a **Session pooler**).
- `NODE_ENV=production`: necessário para o **Supabase** (ativa a conexão SSL). Em banco local, deixe essa linha de fora.
- O `.env` **não** vai para o GitHub. Nunca publique senhas.

### 3. Criar as tabelas
```bash
npm run migrate
```
Deve aparecer: `Todas as tabelas foram criadas com sucesso!`

### 4. (Opcional) Dados de exemplo
O arquivo `backend/seed.sql` cria gêneros, livros, usuários e leituras de exemplo.

> ⚠️ **O seed APAGA todos os dados do banco antes de inserir.** Use só em banco local de testes, nunca no Supabase compartilhado sem avisar o grupo.

Usuários de exemplo (senha de todos: `123456`): `mallu@email.com`, `maria@email.com`, `ellen@email.com`.

### 5. Iniciar o servidor
```bash
npm run dev          # desenvolvimento (reinicia ao salvar)
```
ou, para a versão compilada:
```bash
npm run build
npm start
```

Servidor em `http://localhost:3000`. Teste: `http://localhost:3000/health`.

---

## 📖 Documentação da API (Swagger)

Com o servidor rodando, abra **http://localhost:3000/api-docs**.
Para testar rotas protegidas: faça login em `POST /api/auth/login`, copie o `token`, clique em **Authorize** e cole o token.

Também há uma coleção do Postman em `backend/diario_literario.postman_collection.json` (importe no Postman).

---

## 🔐 Autenticação

- Cadastro: `POST /api/users` com `name`, `email`, `password`.
- Login: `POST /api/auth/login` com `email` e `password` — retorna um **token JWT** (válido por 1 dia).
- Envie o token nas rotas protegidas: `Authorization: Bearer <token>`.
- As senhas são guardadas com hash (bcrypt).

---

## 🗺️ Rotas principais

| Recurso | Rotas |
|---|---|
| Usuários | `POST /api/users`, `GET /api/users/me` 🔒 |
| Login | `POST /api/auth/login` |
| Livros | `GET /api/livros`, `GET /api/livros/:id`, `POST /api/livros` 🔒, `PUT /api/livros/:id` 🔒, `DELETE /api/livros/:id` 🔒, `POST /api/livros/:id/capa` 🔒 (upload) |
| Gêneros | `GET /api/generos`, `GET /api/generos/:id`, `POST` 🔒, `PUT /:id` 🔒, `DELETE /:id` 🔒 |
| Leituras | `GET /api/leituras` 🔒, `GET /api/leituras/:id` 🔒, `POST` 🔒, `PATCH /api/leituras/:id/progresso` 🔒, `DELETE /:id` 🔒 |
| Resenhas | `GET /api/resenhas` 🔒, `GET /:id` 🔒, `POST` 🔒, `PUT /:id` 🔒, `DELETE /:id` 🔒 |
| Metas | `GET /api/metas` 🔒, `GET /api/metas/ano/:ano/progresso` 🔒, `GET /:id` 🔒, `POST` 🔒, `PUT /:id` 🔒, `DELETE /:id` 🔒 |
| Saúde | `GET /health` |

🔒 = exige token JWT. Os `GET` de livros e gêneros são públicos (catálogo aberto); leituras, resenhas e metas são sempre do usuário logado. A lista completa, com exemplos de corpo e respostas, está no Swagger (`/api-docs`).

### 🖼️ Upload de capa
`POST /api/livros/:id/capa` com `multipart/form-data`, campo **`capa`**. Aceita JPEG, PNG e WEBP até **2 MB**.
A imagem fica em `backend/uploads/` e é servida em `/uploads/<arquivo>`; o caminho é salvo em `livros.capa_url`.

### 🧮 Cálculos
- **Progresso da leitura:** `paginas_lidas / total_paginas` em porcentagem.
- **Progresso da meta:** `GET /api/metas/ano/:ano/progresso` retorna livros lidos, quantos faltam, porcentagem e se a meta foi concluída.

---

## ❗ Formato de erros

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```
Rotas inexistentes retornam `404 ROUTE_NOT_FOUND`.

---

## 📁 Estrutura

```
backend/
  migrations/        scripts SQL das tabelas
  migrate.ts         executa as migrations
  seed.sql           dados de exemplo (⚠️ apaga o banco)
  src/
    app.ts           servidor, Swagger e rotas
    docs/            arquivos OpenAPI (.yaml)
    users/ auth/ livros/ generos/ leituras/ resenhas/ metas/
    middlewares/     autenticação, upload, erros
docs/
  uml-diario-literario.png
```

## 🌿 Fluxo de trabalho (Git)

Cada pessoa trabalha em uma branch própria e abre Pull Request. A branch `entrega-1` reúne a Entrega 1; a `main` só recebe o projeto na entrega final.