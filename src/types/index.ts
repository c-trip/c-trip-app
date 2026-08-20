export interface Route {
  origin: string
  destination: string
  price: string
  gradient?: string
}

export type VehicleType = 'Normal' | 'VIP' | 'Executive'

export interface Operator {
  id: string
  name: string
  logo?: string
  price: string
  departureTime: string
  duration: string
  vehicleType: VehicleType
  availableSeats: number
  rating: number
}
