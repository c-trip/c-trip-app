# C-Trip App

Plataforma de bilhética para transportes coletivos (Viagem Lda). Frontend web construído com **React 19 + Vite + TypeScript + Tailwind CSS v4**.

## Estrutura de pastas

```
src/
├── app/                 # Núcleo de arranque global (providers, router)
│   ├── providers.tsx    # Providers de topo (BrowserRouter, futuramente i18n/tema)
│   └── router.tsx       # Árvore de rotas da aplicação
├── components/          # Componentes de UI reutilizáveis (Button, Input, Card, ...)
├── hooks/               # Hooks de lógica reutilizável
├── i18n/                # Traduções (pt/en) — fase de integração
├── lib/                 # Utilitários (format, qr, área/acesso) — fase de integração
├── routes/              # Páginas, organizadas por área (ver mapa de rotas)
│   ├── _public/         # Rotas públicas (sem autenticação)
│   ├── _auth/           # Autenticação (login, registo)
│   ├── _passenger/      # Área do passageiro
│   ├── _gestor/         # Área do gestor
│   └── _operator/       # Área do operador
├── stores/              # Estado global (Zustand) — fase de integração
├── styles/              # Estilos globais (Tailwind)
└── types/               # Tipos partilhados — fase de integração
```

> **Convenção `_`**: pastas em `routes/` com prefixo `_` são **apenas organização de ficheiros** — não entram na URL. Os paths reais estão definidos em `src/app/router.tsx`.

## Mapa de rotas

| Área | Pasta | Rotas |
|---|---|---|
| Público | `_public` | `/welcome`, `/search`, `/search/results`, `/schedules/:scheduleId` |
| Autenticação | `_auth` | `/login`, `/register`, `/register/company` |
| Passageiro | `_passenger` | `/checkout/:scheduleId`, `/payment/:bookingId`, `/ticket/:bookingId`, `/bookings`, `/bookings/:bookingId`, `/profile`, `/notifications` |
| Gestor | `_gestor` | `/gestor`, `/gestor/routes`, `/gestor/schedules`, `/gestor/fleet`, `/gestor/team`, `/gestor/payments` |
| Operador | `_operator` | `/operator`, `/operator/scan`, `/operator/walkin`, `/operator/reprint`, `/operator/manifest`, `/operator/tasks` |

## Ordem de desenvolvimento do UI

1. **Público** — `WelcomePage`, `SearchPage`, `ResultsPage`, `SchedulePage` (define identidade visual + componentes partilhados)
2. **Autenticação** — `LoginPage`, `RegisterPage`, `RegisterCompanyPage`
3. **Passageiro** → 4. **Gestor** → 5. **Operador**

Cada página está criada como placeholder (`.tsx` vazio que renderiza `Placeholder`). Troca o placeholder pelo UI real no ficheiro respetivo.

## Como correr

```bash
pnpm install
pnpm dev        # dev server (http://localhost:5173)
pnpm build      # build de produção + typecheck
pnpm lint       # eslint
pnpm preview    # pré-visualizar o build
```

## Como contribuir (workflow de PRs)

Estratégia de branches: **`main`** (produção/releases, protegida) e **`develop`** (integração).

1. Cria uma branch a partir de `develop`: `feature/<nome-curto>` ou `fix/<nome-curto>`
2. Desenvolve o UI nessa branch (dados fixos no ficheiro; sem integração com API)
3. Abre um **Pull Request para `develop`** (nunca para `main`)
4. Preenche o template de PR e pede review
5. Após merge, elimina a branch

### Convenções

- **Commits**: [Conventional Commits](https://www.conventionalcommits.org/) — `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `chore:`
- **Nome de ficheiros**: `PascalCase.tsx` para componentes/páginas, `camelCase.ts` para utilitários/stores
- **Sem comentários desnecessários** no código
- **Segurança**: ler obrigatoriamente [`agents.md`](./agents.md) antes de escrever código (XSS, sanitização, sessão)

## Estado atual

Fase **UI em desenvolvimento**: router montado sem guards/lógica, páginas como placeholders. Integração (API, stores, i18n, tipos, guards por perfil) acontece numa fase seguinte.
