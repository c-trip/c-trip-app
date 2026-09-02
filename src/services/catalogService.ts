import { http } from './http'
import type {
  City,
  MarketplacePopular,
  RouteDetail,
  RouteListItem,
  ScheduleDetail,
  ScheduleListItem,
  ScheduleSeats,
  SearchResultItem,
  SearchTripsParams,
} from '@/types/catalog'

/** API pública (tag "Public Consult") — não requer autenticação. */
export const catalogApi = {
  async listCities(): Promise<City[]> {
    const { data } = await http.get<City[]>('/cities/')
    return data
  },

  async getCity(cityId: string): Promise<City> {
    const { data } = await http.get<City>(`/cities/${cityId}`)
    return data
  },

  async listRoutes(): Promise<RouteListItem[]> {
    const { data } = await http.get<RouteListItem[]>('/routes/')
    return data
  },

  async getRoute(routeId: string): Promise<RouteDetail> {
    const { data } = await http.get<RouteDetail>(`/routes/${routeId}`)
    return data
  },

  async listSchedules(routeId: string, departureDate: string): Promise<ScheduleListItem[]> {
    const { data } = await http.get<ScheduleListItem[]>('/schedules/', {
      params: { route_id: routeId, departure_date: departureDate },
    })
    return data
  },

  async getSchedule(scheduleId: string): Promise<ScheduleDetail> {
    const { data } = await http.get<ScheduleDetail>(`/schedules/${scheduleId}`)
    return data
  },

  async getScheduleSeats(scheduleId: string): Promise<ScheduleSeats> {
    const { data } = await http.get<ScheduleSeats>(`/schedules/${scheduleId}/seats`)
    return data
  },

  async searchTrips(params: SearchTripsParams = {}): Promise<SearchResultItem[]> {
    const query = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
    )
    const { data } = await http.get<SearchResultItem[]>('/marketplace/search', {
      params: Object.keys(query).length ? query : undefined,
    })
    return data
  },

  async getPopular(days?: number, limit?: number): Promise<MarketplacePopular> {
    const params: Record<string, number> = {}
    if (days !== undefined) params.days = days
    if (limit !== undefined) params.limit = limit
    const { data } = await http.get<MarketplacePopular>('/marketplace/popular', {
      params: Object.keys(params).length ? params : undefined,
    })
    return data
  },
}
