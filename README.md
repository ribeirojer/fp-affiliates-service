# Affiliate API

Sistema de afiliados para o FlashcardsPro. Gerencia códigos de afiliado, cliques, comissões, indicações e saques.

## Stack

- **Deno** + **Oak** (HTTP)
- **Supabase** (Banco de dados)
- **djwt** (JWT com HMAC-SHA512)
- **Zod** (Validação)
- Deploy: **Deno Deploy** (`ribeirojer/teste`)

## Começar

```bash
cp .env.example .env   # ou edite o .env existente
deno task dev          # servidor em http://localhost:8000
```

Variáveis obrigatórias no `.env`: `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`.

## Comandos

| Comando | Descrição |
|---------|-----------|
| `deno task dev` | Servidor com watch |
| `deno task test` | Todos os testes |
| `deno task test:schemas` | Testes de schema (unitários) |
| `deno task test:routes` | Testes de rota (integração) |

## Endpoints

### Público

```
POST /affiliates/click
```

Registra um clique em link de afiliado.

```json
{ "affiliateCode": "ABC12345", "landingPage": "/flashcards", "referrer": "https://..." }
```

### Autenticados (Bearer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/affiliates/generate` | Gera código de afiliado |
| `GET` | `/affiliates/stats` | Estatísticas do afiliado |
| `GET` | `/affiliates/referrals` | Indicações realizadas |
| `POST` | `/affiliates/pix-key` | Salva chave PIX |
| `POST` | `/affiliates/request-payout` | Solicita saque (mín. R$ 30,00) |
| `GET` | `/affiliates/payouts` | Histórico de saques |

### Health

```
GET /health
→ { "status": "ok", "service": "affiliates" }
```

## Estrutura

```
src/
  server.ts               — entrypoint
  app.ts                  — setup Oak, CORS, rotas
  config/                 — env, Supabase, JWT
  middleware/             — auth (JWT), requestId
  routes/                 — definição de rotas
  handlers/               — request handlers
  services/               — lógica de negócio
  repositories/           — queries Supabase
  schemas/                — validação Zod
  types.ts                — interfaces compartilhadas
test/
  schemas.test.ts         — testes unitários de schema
  routes-*.test.ts        — testes de integração por domínio
  test-utils.ts           — helper de geração de JWT
```

## Convenções

- Mensagens para o usuário em **português**
- Código e identificadores em **inglês**
- Respostas de erro: `{ "error": "mensagem" }`
- Logger JSON estruturado (`@std/log`)

## Testes

Os testes de schema são puramente unitários. Os testes de rota usam superoak e conectam no Supabase real — geram JWTs válidos com a chave do projeto e criam/limpam registros de teste automaticamente.

```bash
deno task test          # 59 testes
deno task test:schemas  # só schemas
deno task test:routes   # só rotas
```
