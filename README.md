# C-Trip App

Plataforma de bilhética para transportes coletivos (Viagem Lda). Frontend web construído com **React 19 + Vite + TypeScript + Tailwind CSS v4** + **Zustand** + **React Router**.

## Funcionalidades

- **Reserva de passageiro**: pesquisa por rota, horários com mapa de lugares, hold de assento, checkout, bilhete com QR, as minhas reservas e bilhetes.
- **Área do operador**: login por código, viagens do dia, venda ao balcão (walk-in) com seleção de lugar, scanner de QR para validação de embarque, reimpressão de bilhetes, manifesto e tarefas.
- **Área do gestor**: está a ser desenvolvida num **projeto separado** — não vive neste repositório.

## Estrutura de pastas

```text
src/
├── app/                 # Núcleo de arranque global (providers, router)
│   ├── providers.tsx    # Providers de topo (RouterProvider, etc.)
│   └── router.tsx       # Árvore de rotas da aplicação
├── api/                 # Camada de API (mock por agora)
│   └── mock/            # Simulações de endpoints (a substituir pela API real)
├── assets/              # Recursos estáticos
├── components/          # Componentes de UI reutilizáveis (Button, Card, Tabs, ...)
│   └── ui/              # Componentes base (shadcn/ui)
├── data/                # Dados mock (viagens, lugares, operadores, rotas populares)
├── hooks/               # Hooks de lógica reutilizável
├── i18n/                # Internacionalização — fase de integração
├── lib/                 # Utilitários (bookings, qr, seats, seatHolds, utils)
├── routes/              # Páginas, organizadas por área (ver mapa de rotas)
│   ├── _public/         # Rotas públicas (sem autenticação)
│   ├── _auth/           # Autenticação (login, registo)
│   ├── _passenger/      # Área do passageiro
│   └── _operator/       # Área do operador
├── stores/              # Estado global (Zustand) — fase de integração
├── styles/              # Estilos globais (Tailwind)
├── test/                # Setup de testes (jsdom)
└── types/               # Tipos partilhados
```

> **Convenção `_`**: pastas em `routes/` com prefixo `_` são **apenas organização de ficheiros** — não entram na URL. Os paths reais estão definidos em `src/app/router.tsx`.

## Mapa de rotas

| Área | Pasta | Rotas |
|---|---|---|
| Público | `_public` | `/welcome`, `/search`, `/search/results`, `/search-results/:origin`, `/search-results/:origin/:destination`, `/schedules/:scheduleId`, `/hold/:scheduleId/:routeSlug/:companySlug` |
| Autenticação | `_auth` | `/auth/login`, `/auth/register` |
| Passageiro | `_passenger` | `/checkout/:scheduleId`, `/ticket-qr/:scheduleId`, `/payment/:bookingId`, `/ticket/:bookingId`, `/bookings`, `/bookings/:bookingId`, `/tickets`, `/profile`, `/notifications` |
| Operador | `_operator` | `/operator/login`, `/operator`, `/operator/walkin`, `/operator/reprint`, `/operator/manifest`, `/operator/scan`, `/operator/tasks`, `/operator/calendar` |

## Estado atual

- **Fluxo de operador completo** (UI): login por código, dashboard de viagens, venda walk-in com mapa de lugares, scanner QR (marcado como protótipo), reimpressão, manifesto e tarefas.
- **Fluxo de passageiro**: pesquisa, horários, hold, checkout, bilhete com QR, reservas e perfil.
- **Páginas ainda como placeholder**: `/ticket/:bookingId`, `/payment/:bookingId` e `/notifications`.
- **Dados mock**: todos os dados vêm de `src/data/` e `src/api/mock/` — sem integração com API real ainda. Os comentários no código indicam os endpoints a consumir (ex. `POST /boarding/operator/sell`, `POST /auth/login`).

## CI/CD (GitHub Actions)

O workflow `CI/CD` (`.github/workflows/ci.yml`) roda no push para `main`, em **cada PR** para `main` e **quando uma review é submetida**. Todos os runs usam a mesma `concurrency` (um cancela o anterior).

- **Lint, Test & Build** (job `quality`) — obrigatório para o merge:
  - `pnpm lint` (ESLint)
  - `pnpm test` (Vitest + jsdom)
  - `pnpm build` (typecheck `tsc -b` + `vite build`)
- **Deploy to GitHub Pages** (job `deploy`) — só em push para `main`: build e publicação do `dist/` na branch `gh-pages`.
- **Auto-merge approved PRs** (job `auto-merge`) — quando um PR para `main` está aprovado e os checks passam, o merge é feito em modo **squash** automaticamente.

## CodeRabbit (review automática)

Review de código com IA, configurada em `.coderabbit.yaml`:

- **Perfil `chill`** e comentários em PT-BR, revendo cada PR e novo commit.
- **`request_changes_workflow: true`** — o bot pode bloquear (REQUEST_CHANGES) ou **aprovar** o PR formalmente; `@coderabbitai approve` resolve os threads e submete aprovação.
- **Instruções por caminho**: segurança reforçada em `src/lib/**` e `src/**` (XSS, CSRF, injection, sanitização, secrets hardcoded, tratamento de erros) e boas práticas nas rotas, componentes e workflows.
- O `main` está protegido e **exige a aprovação do CodeRabbit** para permitir o merge (proteção de branch: 1 review obrigatório, conversas resolvidas, check `Lint, Test & Build`).

## Como correr

```bash
pnpm install
pnpm dev        # dev server (http://localhost:5173)
pnpm build      # build de produção + typecheck
pnpm lint       # eslint
pnpm test       # testes (vitest)
pnpm preview    # pré-visualizar o build
```

## Como contribuir (workflow de PRs)

`main` é a branch de produção (protegida, com CI + CodeRabbit + auto-merge). Cada funcionalidade é desenvolvida numa **branch própria** e integrada via PR.

1. Sincroniza `main` e cria uma branch a partir dela: `feature/<nome-curto>`, `fix/<nome-curto>`, `chore/<nome-curto>` ou `docs/<nome-curto>`
2. Desenvolve o UI nessa branch (dados mock; sem integração com API)
3. Abre um **Pull Request para `main`**
4. O CodeRabbit revê e aprova; os checks correm; o **auto-merge** fecha com **squash** quando está tudo verde
5. Após o merge, elimina a branch

### Convenções

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`
- **Nome de ficheiros**: `PascalCase.tsx` para componentes/páginas, `camelCase.ts` para utilitários/stores
- **Sem comentários desnecessários** no código
- **Segurança**: ler obrigatoriamente [`agents.md`](./agents.md) antes de escrever código (XSS, sanitização, sessão)