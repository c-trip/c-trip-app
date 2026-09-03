// Tipos da API pública (tag "Public Consult") — consulta sem autenticação.

export interface City {
  id: string
  name: string
  province: string
}

export interface RouteStop {
  city: string
  price: number
}

export interface RouteListItem {
  id: string
  company_name: string
  origin_city: string
  origin_province: string
  destination_city: string
  destination_province: string
  is_active: boolean
  total_price: number
  stops: RouteStop[]
}

export interface RouteDetail {
  id: string
  origin_city: string
  destination_city: string
  is_active: boolean
  total_price: number
  stops: RouteStop[]
}

export type ScheduleStatus = 'scheduled' | 'boarding' | 'departed' | 'cancelled' | string

export interface ScheduleListItem {
  id: string
  bus_model: string
  bus_plate: string
  driver_name: string
  departure_date: string
  departure_time: string
  status: ScheduleStatus
  total_seats: number
  boarding_cutoff_minutes: number
}

export type ScheduleDetail = ScheduleListItem

export interface ScheduleSeats {
  total_seats: number
  available: number[]
  occupied: number[]
}

export interface SearchTripsParams {
  date?: string
  origin?: string
  destination?: string
  origin_city_id?: string
  destination_city_id?: string
  max_price?: number
}

export interface SearchResultItem {
  schedule_id: string
  route_id: string
  company: string
  origin: string
  destination: string
  departure_time: string
  price: number
  available_seats: number
}

export interface PopularRoute {
  origin: string
  destination: string
  booking_count: number
  avg_price: number
  company_count: number
}

export interface PopularDestination {
  city: string
  province: string
  booking_count: number
}

export interface MarketplacePopular {
  popular_routes: PopularRoute[]
  popular_destinations: PopularDestination[]
  total_bookings: number
  total_routes: number
  total_companies: number
  period_days: number
}
