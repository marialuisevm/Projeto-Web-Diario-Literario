# 📚 ReadTrack — Gerenciador Pessoal de Leitura

O **ReadTrack** é um aplicativo desenvolvido para ajudar leitores a organizarem suas leituras, acompanharem metas diárias e manterem um registro estruturado de livros lidos e resenhas.

---

## 🚀 Funcionalidades

- **👤 Perfil e Autenticação:** Criação de conta, login seguro e gestão de perfil.
- **📖 Catálogo de Livros:** Cadastro completo de obras (título, autor, gênero e número de páginas) com busca rápida.
- **📊 Progresso Visual:** Atualização de páginas lidas com cálculo automático de porcentagem e barra de progresso.
- **📌 Fluxo e Histórico:** Lista de leitura (*Quero Ler*, *Lendo*, *Lido*) para planejar próximas leituras e arquivar livros terminados.
- **⭐ Resenhas e Métricas:** Avaliação de 1 a 5 estrelas, comentários críticos e resumo estatístico (páginas lidas e livros concluídos).

---

## 🛠️ Tecnologias Recomendadas

- **Front-end:** React / React Native ou Flutter
- **Back-end:** Node.js (Express / Fastify) ou Python (FastAPI)
- **Banco de Dados:** PostgreSQL ou SQLite (para armazenamento local/mobile)
- **Autenticação:** JWT (JSON Web Tokens)

---

## 📦 Estrutura do Projeto

```text
├── src/
│   ├── controllers/      # Regras de negócio e rotas
│   ├── models/           # Modelos de dados (User, Book, Review, Progress)
│   ├── services/         # Cálculos de progresso e estatísticas
│   └── views/            # Telas e componentes da interface
├── tests/                # Testes unitários e de integração
└── README.md
