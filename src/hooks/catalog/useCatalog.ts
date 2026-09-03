import { catalogApi } from '@/services/catalogService'
import { useAsyncData } from '@/hooks/useAsync'
import type { SearchTripsParams } from '@/types/catalog'

export function useCities() {
  return useAsyncData(() => catalogApi.listCities(), 'cities', {
    fallbackError: 'Não foi possível carregar as cidades.',
  })
}

export function useCity(cityId?: string) {
  return useAsyncData(() => catalogApi.getCity(cityId!), `city:${cityId}`, {
    enabled: Boolean(cityId),
    fallbackError: 'Não foi possível carregar a cidade.',
  })
}

export function useRoutes() {
  return useAsyncData(() => catalogApi.listRoutes(), 'routes', {
    fallbackError: 'Não foi possível carregar as rotas.',
  })
}

export function useRoute(routeId?: string) {
  return useAsyncData(() => catalogApi.getRoute(routeId!), `route:${routeId}`, {
    enabled: Boolean(routeId),
    fallbackError: 'Não foi possível carregar a rota.',
  })
}

export function useSchedules(routeId?: string, departureDate?: string) {
  return useAsyncData(
    () => catalogApi.listSchedules(routeId!, departureDate!),
    `schedules:${routeId}:${departureDate}`,
    {
      enabled: Boolean(routeId && departureDate),
      fallbackError: 'Não foi possível carregar as viagens.',
    },
  )
}

export function useSchedule(scheduleId?: string) {
  return useAsyncData(() => catalogApi.getSchedule(scheduleId!), `schedule:${scheduleId}`, {
    enabled: Boolean(scheduleId),
    fallbackError: 'Não foi possível carregar a viagem.',
  })
}

export function useScheduleSeats(scheduleId?: string) {
  return useAsyncData(
    () => catalogApi.getScheduleSeats(scheduleId!),
    `schedule-seats:${scheduleId}`,
    {
      enabled: Boolean(scheduleId),
      fallbackError: 'Não foi possível carregar os lugares.',
    },
  )
}

export function useSearchTrips(params: SearchTripsParams, enabled = true) {
  return useAsyncData(() => catalogApi.searchTrips(params), `search:${JSON.stringify(params)}`, {
    enabled,
    fallbackError: 'Não foi possível pesquisar viagens.',
  })
}

export function usePopular(days?: number, limit?: number) {
  return useAsyncData(() => catalogApi.getPopular(days, limit), `popular:${days}:${limit}`, {
    fallbackError: 'Não foi possível carregar as rotas populares.',
  })
}
