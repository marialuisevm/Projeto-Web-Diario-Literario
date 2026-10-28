# 📚 Diário Literário - Backend

API REST desenvolvida para gerenciamento de hábitos de leitura, metas literárias, avaliações e registro de livros lidos.

---

## 🚀 Tecnologias Utilizadas

- **Node.js** com **TypeScript**
- **Express** (Framework Web)
- **PostgreSQL** hospedado na nuvem via **Supabase**
- **pg** (Node-Postgres) com Pooling de conexões
- **bcrypt** e **jsonwebtoken (JWT)** para autenticação e segurança
- **TSX** para execução e hot-reload em desenvolvimento

---

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org/) versão 18 ou superior instalada
- Gerenciador de pacotes **npm**
- Instância do PostgreSQL ativa (ou projeto no [Supabase](https://supabase.com/))

---

## 🛠️ Instalação e Configuração

### 1. Clonar o repositório
\`\`\`bash
git clone https://github.com/marialuisevm/Projeto-Web-Diario-Literario.git
cd Projeto-Web-Diario-Literario/backend
\`\`\`

### 2. Instalar as dependências
\`\`\`bash
npm install
\`\`\`

### 3. Configurar as variáveis de ambiente
Crie um arquivo \`.env\` na raiz da pasta \`backend\` com base no modelo \`.env.example\`:

\`\`\`env
PORT=3000
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[SUA_SENHA]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
JWT_SECRET=seu_segredo_jwt_aqui
\`\`\`

---

## 🗄️ Banco de Dados: Migrações e Seed

### Executar Migrações
Para criar a estrutura de tabelas no banco de dados (\`users\`, \`generos\`, \`livros\`, \`leituras\`, \`resenhas\` e \`metas\`), execute:
\`\`\`bash
npm run migrate
\`\`\`

### Povoamento de Dados (Seed)
Abra o **SQL Editor** do Supabase, cole o conteúdo do arquivo \`seed.sql\` e execute o script para inserir os dados iniciais de teste.

---

## 🏃 Como Executar a Aplicação

Inicie o servidor em modo de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`

O servidor iniciará por padrão em: \`http://localhost:3000\`

---

## 📡 Endpoints Principais da API

| Método | Rota             | Descrição                                 |
| :----- | :--------------- | :---------------------------------------- |
| `GET`  | `/health`        | Checagem do status da API                 |
| `POST` | `/auth/register` | Cadastro de novos usuários                |
| `POST` | `/auth/login`    | Login e obtenção de token JWT             |
| `GET`  | `/livros`        | Listagem do acervo de livros              |
| `GET`  | `/leituras`      | Consulta de registros de leitura          |
