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
  arrivalTime: string
  duration: string
  vehicleType: VehicleType
  availableSeats: number
  rating: number
}

export interface Schedule {
  id: string
  operatorName: string
  route: string
  origin: string
  destination: string
  departureDate: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: string
  busModel: string
  busPlate: string
  driverName: string
  vehicleType: VehicleType
  boardingCutoffMinutes: number
  boardingPoint: string
}

export interface SeatMap {
  totalSeats: number
  available: number[]
  occupied: number[]
  reserved: number[]
}

export type BookingStatus = 'confirmada' | 'pendente' | 'cancelada' | 'concluida'

export type PaymentMethod = 'mcx'

export interface Booking {
  id: string
  scheduleId: string
  seat: number
  seatLabel: string
  passengerName: string
  passengerBI: string
  passengerPhone: string
  status: BookingStatus
  price: string
  createdAt: number
  paymentMethod: PaymentMethod
}
