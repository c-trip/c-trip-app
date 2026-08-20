import type { Operator } from '@/types'

const luandaBenguela: Operator[] = [
  {
    id: 'macon-1',
    name: 'Macon',
    price: '3 500 Kz',
    departureTime: '08:00',
    arrivalTime: '12:30',
    duration: '4h 30min',
    vehicleType: 'VIP',
    availableSeats: 12,
    rating: 4.8,
  },
  {
    id: 'angorreal-1',
    name: 'Angorreal',
    price: '3 200 Kz',
    departureTime: '09:30',
    arrivalTime: '14:30',
    duration: '5h',
    vehicleType: 'Normal',
    availableSeats: 8,
    rating: 4.5,
  },
  {
    id: 'labarca-1',
    name: 'Labarca',
    price: '4 000 Kz',
    departureTime: '07:00',
    arrivalTime: '11:00',
    duration: '4h',
    vehicleType: 'Executive',
    availableSeats: 6,
    rating: 4.9,
  },
]

const benguelaHuambo: Operator[] = [
  {
    id: 'macon-2',
    name: 'Macon',
    price: '2 800 Kz',
    departureTime: '10:00',
    arrivalTime: '13:00',
    duration: '3h',
    vehicleType: 'VIP',
    availableSeats: 15,
    rating: 4.7,
  },
  {
    id: 'angorreal-2',
    name: 'Angorreal',
    price: '2 500 Kz',
    departureTime: '11:00',
    arrivalTime: '14:30',
    duration: '3h 30min',
    vehicleType: 'Normal',
    availableSeats: 20,
    rating: 4.3,
  },
]

const luandaHuambo: Operator[] = [
  {
    id: 'macon-3',
    name: 'Macon',
    price: '4 500 Kz',
    departureTime: '06:00',
    arrivalTime: '13:00',
    duration: '7h',
    vehicleType: 'VIP',
    availableSeats: 10,
    rating: 4.8,
  },
  {
    id: 'labarca-2',
    name: 'Labarca',
    price: '5 000 Kz',
    departureTime: '07:30',
    arrivalTime: '14:00',
    duration: '6h 30min',
    vehicleType: 'Executive',
    availableSeats: 4,
    rating: 4.9,
  },
  {
    id: 'angorreal-3',
    name: 'Angorreal',
    price: '4 000 Kz',
    departureTime: '08:00',
    arrivalTime: '15:30',
    duration: '7h 30min',
    vehicleType: 'Normal',
    availableSeats: 18,
    rating: 4.4,
  },
]

const operatorsByRoute: Record<string, Operator[]> = {
  'luanda-benguela': luandaBenguela,
  'benguela-huambo': benguelaHuambo,
  'luanda-huambo': luandaHuambo,
}

export function getOperatorsByRoute(origin?: string, destination?: string): Operator[] {
  if (!origin || !destination) {
    return Object.values(operatorsByRoute).flat()
  }
  const key = `${origin.toLowerCase()}-${destination.toLowerCase()}`
  return operatorsByRoute[key] ?? []
}
