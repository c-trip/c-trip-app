# Resumo — Endpoints do Operador

> Fonte: `api_complete_docs.txt` (OpenAPI). Âmbito: tag `Operator` (`/boarding/*`),
> os `auth` que o operador consome, e as tarefas (`/fleet/tasks`).
> Atualizado: 2026-09-03 · Branch `develope`.

---

## Contagem

| Estado | Nº |
| --- | :-: |
| ✅ Implementado | 16 |
| 🟡 Implementado mas por completar | 1 |
| 🔴 Não consumido | 0 |
| **Total no âmbito** | **17** |

---

## ✅ Implementados

### Auth
| Método | Endpoint | Onde |
| --- | --- | --- |
| `POST` | `/auth/login` | `OperatorLoginPage` → `useLogin` |
| `GET` | `/auth/me` | `OperatorProfile` → `useProfile` |
| `GET` | `/auth/my-permissions` | `OperatorProfile` → `useMyPermissions` |
| `POST` | `/auth/change-password` | `OperatorProfile` → `useChangePassword` |

### Boarding
| Método | Endpoint | Onde | Notas |
| --- | --- | --- | --- |
| `GET` | `/boarding/schedules` | `useOperatorSchedules` → `OperatorDayTrips`, `OperatorCalendarPage`, `OperatorWalkIn`, `OperatorReprint`, `OperatorManifest` | tipo `OperatorSchedule` atualizado com `route_id` + `price` |
| `GET` | `/boarding/my-sales` | `OperatorDayTrips` — cartão **"As minhas vendas de hoje"** (`useMySales`) | — |
| `POST` | `/boarding/operator/sell` | `OperatorWalkIn` (modo "Emitir bilhete") → `useSellTicket` | **preço automático** a partir da viagem (campo manual removido) |
| `POST` | `/boarding/walk-in` | `OperatorWalkIn` (modo **"Embarque à porta"**) → `useWalkInBoarding` | venda + embarque imediato, sem QR |
| `POST` | `/boarding/qr/reprint` | `OperatorReprint` → `useReprintQr` | lista mostra **nomes reais**; pesquisa por nome ou lugar |
| `GET` | `/boarding/manifest` | `OperatorManifest` (+ lugares ocupados no `WalkIn`/`Reprint`) | `ManifestItem` atualizado (`passenger`, `phone`, `boarded`, `boarded_at`); serviço aceita `status`; pesquisa por nome |
| `POST` | `/boarding/scan` | `OperatorScan` → `boardingApi.scan` | valida **+ regista** num passo (substituiu `validate` + `record`) |
| `POST` | `/boarding/board/{booking_id}` | `OperatorManifest` — botão **"Embarcar"** por linha (`useBoardFromManifest`) | embarcar sem QR |
| `GET` | `/boarding/summary` | `OperatorManifest` — painel de resumo (vendidos / embarcados / no-shows / walk-ins / receita) (`useBoardingSummary`) | — |

### Frota
| Método | Endpoint | Onde |
| --- | --- | --- |
| `GET` | `/fleet/tasks` | `OperatorTasks` → `useFleetTasks` (era `MOCK_TASKS`) |
| `PATCH` | `/fleet/tasks/{task_id}` | `OperatorTasks` — avançar estado da tarefa (`pending → in_progress → done`) |

---

## 🟡 Implementado mas por completar

| Método | Endpoint | Estado |
| --- | --- | --- |
| `POST` | `/boarding/validate` + `POST /boarding/record` | Já não são usados — `OperatorScan` passou a usar `/boarding/scan` (1 passo). Os hooks `useValidateQr` / `useRecordBoarding` ficaram **código morto**; manter só se for preciso um fluxo de "validar sem registar" (ex.: pré-verificação antes do embarque). |

---

## Fora do âmbito

- `POST /fleet/tasks` (criar tarefa) — **[GESTOR]**, não operador.
- `GET /boarding/schedules?days=N` — o serviço suporta o parâmetro, mas nenhum ecrã do operador precisa dele por agora.

---

## Camada criada / alterada

| Ficheiro | Mudança |
| --- | --- |
| `src/types/operator.ts` | `OperatorSchedule` (+`route_id`,`price`), `ManifestItem` (+`passenger`,`phone`,`id_doc`,`boarded`,`boarded_at`), + `BoardFromManifestResponse`, `BoardingSummary`, `OperatorSalesTotal`, `WalkInBoardingPayload/Response`, `FleetTask`, `ManifestFilter` |
| `src/services/operator/boardingService.ts` | +`scan`, `boardFromManifest`, `getSummary`, `getMySales`, `walkIn`; `getSchedules(date?, days?)`, `getManifest(id, status?)` |
| `src/services/operator/fleetService.ts` | **novo** — `listTasks`, `updateTaskStatus` |
| `src/hooks/operator/useBoarding.ts` | **novo** — `useScan`, `useBoardFromManifest`, `useBoardingSummary`, `useMySales`, `useWalkInBoarding` |
| `src/hooks/operator/useFleetTasks.ts` | **novo** — lista + `updateStatus` |
