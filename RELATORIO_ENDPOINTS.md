# Relatório de Endpoints — C-Trip App

> Fonte: `api_complete_docs.txt` (OpenAPI 3.1). Âmbito: **Passenger**, **Public Consult** e **Operator**.
> Análise: 2026-09-02 · Branch: `develope`

---

## Estado final

| Grupo | Total | ✅ Ligado | 🟡 Serviço pronto, sem consumidor |
| --- | :-: | :-: | :-: |
| Autenticação | 6 | 5 | 1 |
| Public Consult | 9 | 9 | 0 |
| Passenger | 11 | 11 | 0 |
| Operator | 6 | 6 | 0 |
| **Total** | **32** | **31** | **1** |

_Evolução: batch 0 (início) ✅ 3 · batch 1 (camada serviços/hooks + Notificações) · batch 2 (Operator) · batch 3 (Public Consult + funil do passageiro + Google + perfil)._

O único 🟡 é **`GET /auth/my-permissions`** — `authApi.myPermissions` está pronto mas não há UI de RBAC neste app.

---

## Arquitectura adoptada

- **Camada de acesso:** `src/services/{authService,catalogService,passengerService}.ts` + `src/services/operator/boardingService.ts`. Hooks em `src/hooks/{auth,catalog,passenger,operator}/`. Helpers genéricos `src/hooks/useAsync.ts` (`useAsyncData` / `useAsyncAction`).
- **Token:** persiste em `localStorage` (`c_trip_token`); `authStore.bootstrap` limpa-o se `/auth/me` falhar.
- **Funil de compra:** `src/stores/bookingFlowStore.ts` (zustand + sessionStorage) guarda a viagem escolhida (`SelectedTrip`), o lugar e os dados de pagamento — a API não devolve origem/destino/companhia/preço em `/schedules/{id}` nem em `/bookings/*`.
- **Mocks removidos:** `src/data/*` (todo), `src/lib/bookings.ts`, `src/lib/qr.ts`, `src/components/OperatorCard.tsx`. `src/lib/seatHolds.ts` mantém-se (hold de 10 min é client-side — a API não tem esse conceito).

---

## 1. Autenticação

| Método | Endpoint | Estado | Onde |
| --- | --- | :-: | --- |
| `POST` | `/auth/register` | ✅ | `useRegister` → `RegisterPage` |
| `POST` | `/auth/login` | ✅ | `useLogin` → `LoginPage`, `OperatorLoginPage` |
| `POST` | `/auth/google` | ✅ | `useGoogleSignIn` → botão em `LoginPage`/`RegisterPage`. **Requer `VITE_GOOGLE_CLIENT_ID`** — sem essa env var o botão não aparece. Carrega o SDK Google Identity Services e envia o `id_token` a `/auth/google`. |
| `GET` | `/auth/me` | ✅ | `authStore.bootstrap`, `useProfile` |
| `POST` | `/auth/change-password` | ✅ | `useChangePassword` → secção "Alterar palavra-passe" no `ProfilePage` |
| `GET` | `/auth/my-permissions` | 🟡 | `authApi.myPermissions` pronto; sem UI de RBAC |

---

## 2. Public Consult

| Método | Endpoint | Hook | Tela |
| --- | --- | --- | --- |
| `GET` | `/marketplace/search` | `useSearchTrips` | `SearchPage` (lista todas as viagens + filtro texto), `OperatorsPage` (`/search-results/:origin/:destination`) |
| `GET` | `/marketplace/popular` | `usePopular` | `PopularRoutes` (na `SearchPage`, só sem pesquisa/filtros) |
| `GET` | `/cities/` | `useCities` | `ResultsPage` (agrupado por província), `CitiesSection` (SearchPage), `TripFilterDialog` (selectores) |
| `GET` | `/cities/{city_id}` | `useCity` | disponível; sem uso directo |
| `GET` | `/routes/` | `useRoutes` | disponível |
| `GET` | `/routes/{route_id}` | `useRoute` | disponível |
| `GET` | `/schedules/` | `useSchedules` | disponível |
| `GET` | `/schedules/{schedule_id}` | `useSchedule` | `SchedulePage` (dados do autocarro / cutoff) |
| `GET` | `/schedules/{schedule_id}/seats` | `useScheduleSeats` | `SchedulePage` (grelha de lugares) |

**Notas:**
- `SearchPage` reformulada: barra de pesquisa compacta (`SearchCard` = input + botão de filtro com badge) sobre o carrossel, secções `CitiesSection` (cards com imagem) e `PopularRoutes` só quando não há pesquisa/filtros, e a lista de viagens (`TripList`, scroll infinito de 10 em 10) por baixo — carrega já todas as viagens de `/marketplace/search` sem filtros. Filtro de texto é client-side (companhia/origem/destino); o `TripFilterDialog` (modal centrado) aplica `date`/`origin`/`destination`/`max_price` server-side.
- Componentes partilhados novos: `TripCard`, `TripList`, `TripFilterDialog`, `CityCard`, `CitiesSection`, `ConfirmDialog` (+ `src/lib/tripFilters.ts`, `src/lib/format.ts`, `src/data/cityImages.ts`). `OperatorsPage` também passou a usar `TripList`.
- `ResultsPage` deixou de ser a grelha de províncias mock — agora lista cidades de `/cities/` agrupadas por província.
- `/schedules/{id}/seats` só devolve `available[]`/`occupied[]` (sem `reserved[]`).

---

## 3. Passenger

| Método | Endpoint | Hook | Tela |
| --- | --- | --- | --- |
| `POST` | `/payments/initiate` | `useInitiatePayment` | `CheckoutPage` → cria reserva + inicia pagamento; guarda `reference`/`entity`/`expires_at` no store |
| `GET` | `/payments/booking/{booking_id}` | `usePaymentStatus` | `PaymentPage` — polling 4s até `confirmed`, depois segue para o bilhete |
| `GET` | `/payments/` | `usePayments` | **`PaymentsPage` nova** (`/payments`, link no perfil) |
| `POST` | `/qr/generate` | `useGenerateQr` | `TicketQrPage` — QR desenhado a partir do `qr_hash` do servidor (`qrcode` lib) |
| `GET` | `/bookings/` | `useBookings` | `BookingsPage`, `TicketsPage` |
| `GET` | `/bookings/{booking_id}` | `useBooking` | `BookingDetailPage` |
| `POST` | `/bookings/cancel` | `useCancelBooking` | `BookingDetailPage` |
| `GET` | `/passengers/{user_id}` | `usePassengerProfile` | `ProfilePage` — "Membro desde" (`created_at`) |
| `PATCH` | `/passengers/profile` | `useUpdateProfile` | `ProfilePage` (edição) + best-effort no `CheckoutPage` |
| `GET` | `/notifications/` | `useNotifications` | `NotificationsPage` |
| `PATCH` | `/notifications/{notification_id}/read` | `useNotifications().markRead` | `NotificationsPage` |

**Decisões aplicadas (conforme acordado):**
- **Contexto do funil → store zustand** (`bookingFlowStore`).
- **`ResultsPage` → lista de cidades** (`/cities/`).
- **"Minhas reservas" → mostra o que a API dá:** lugar, valor, data da reserva (`created_at`) e estado. Sem linha de rota — `/bookings/*` não devolve origem/destino. **Pedido de melhoria ao backend:** incluir rota/data de partida na reserva.

**Fluxo:** `SearchPage → OperatorsPage (setTrip) → SchedulePage (setSeat) → HoldPage → CheckoutPage (initiate) → PaymentPage (polling) → TicketQrPage`.

**Notas / simplificações:**
- Rota do hold simplificada: `/hold/:scheduleId` (era `/hold/:scheduleId/:routeSlug/:companySlug`).
- `TicketQrPage` foi enxuta: o gerador de imagem-cartão em canvas e o modal de 5 apps de partilha dependiam de campos mock (matrícula, hora de chegada, operador) que a API não dá. Ficou `navigator.share` + fallback de cópia.
- `CheckoutPage`: nome vem da conta (`/auth/me`); BI/telefone são opcionais e vão via `PATCH /passengers/profile` (a API de `initiate` não os aceita).
- `/ticket/:bookingId` (`TicketPage`) continua `<Placeholder>` e órfão — não é um endpoint, o bilhete é `/ticket-qr`.

---

## 4. Operator — ✅ 100%

| Método | Endpoint | Hook | Tela |
| --- | --- | --- | --- |
| `GET` | `/boarding/schedules` | `useOperatorSchedules(date?)` | `OperatorDayTrips`, `OperatorCalendarPage`, `OperatorWalkIn`, `OperatorReprint`, `OperatorManifest` |
| `POST` | `/boarding/operator/sell` | `useSellTicket` | `OperatorWalkIn` |
| `POST` | `/boarding/qr/reprint` | `useReprintQr` | `OperatorReprint` |
| `POST` | `/boarding/validate` | `boardingApi.validateQr` | `OperatorScan` |
| `POST` | `/boarding/record` | `boardingApi.recordBoarding` | `OperatorScan` (auto após `allowed`) |
| `GET` | `/boarding/manifest` | `useManifest` | `OperatorManifest`, `OperatorWalkIn`/`OperatorReprint` (lugares ocupados) |

**Gaps da API:** manifesto sem nome/telefone (só lugar+estado); `OperatorScheduleItem` sem preço/matrícula → campo "Preço (Kz)" manual no `OperatorWalkIn`. `payment_method` enviado como `'cash'`.

---

## 5. Pendências / pedidos ao backend

1. **`/bookings/*` e `/schedules/{id}`** deviam incluir origem, destino, companhia e data/hora de partida — hoje o app depende do `bookingFlowStore` (perde-se fora do funil; "Minhas reservas" fica sem rota).
2. **`/boarding/manifest`** devia incluir nome do passageiro (para o manifesto e reimpressão do operador).
3. **`OperatorScheduleItem`** devia incluir o preço do lugar (para a venda ao balcão).
4. Confirmar vocabulário de `payment_method` (`cash` / `pos` / `multicaixa_express`).
5. `/auth/my-permissions` — ligar quando existir área de gestor/RBAC.

---

## Anexo — endpoints fora do âmbito

`Administrator` (21), `Company Admin`/`GESTOR` (`fleet/*`, `routes/*` escrita, `schedules/*` escrita, `companies/*`), `Public Register` → `/companies/register`, `Webhooks` → `/webhooks/payments/{gateway}`, `infra` → `/health`.
