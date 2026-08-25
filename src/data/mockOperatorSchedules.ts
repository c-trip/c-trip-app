import type { Schedule } from '@/types'

export interface OperatorSchedule extends Schedule {
  availableSeats: number
  totalSeats: number
  status: 'scheduled' | 'boarding' | 'departed'
}

export function getOperatorTodaySchedules(): OperatorSchedule[] {
  const today = new Date().toISOString().split('T')[0]
  const allSchedules: OperatorSchedule[] = [
    {
      id: 'macon-1',
      operatorName: 'Macon',
      route: 'Luanda → Benguela',
      origin: 'Luanda',
      destination: 'Benguela',
      departureDate: today,
      departureTime: '08:00',
      arrivalTime: '12:30',
      duration: '4h 30min',
      price: '3 500 Kz',
      busModel: 'Mercedes Sprinter',
      busPlate: 'LD-34-56-B',
      driverName: 'Carlos Silva',
      vehicleType: 'VIP',
      boardingCutoffMinutes: 30,
      boardingPoint: 'Terminal de Viana',
      availableSeats: 25,
      totalSeats: 40,
      status: 'scheduled',
    },
    {
      id: 'macon-2',
      operatorName: 'Macon',
      route: 'Benguela → Huambo',
      origin: 'Benguela',
      destination: 'Huambo',
      departureDate: today,
      departureTime: '10:00',
      arrivalTime: '13:00',
      duration: '3h',
      price: '2 800 Kz',
      busModel: 'Mercedes Sprinter',
      busPlate: 'BE-78-23-D',
      driverName: 'António Ferreira',
      vehicleType: 'VIP',
      boardingCutoffMinutes: 30,
      boardingPoint: 'Terminal Rodoviário de Benguela',
      availableSeats: 40,
      totalSeats: 40,
      status: 'scheduled',
    },
    {
      id: 'macon-3',
      operatorName: 'Macon',
      route: 'Luanda → Huambo',
      origin: 'Luanda',
      destination: 'Huambo',
      departureDate: today,
      departureTime: '06:00',
      arrivalTime: '13:00',
      duration: '7h',
      price: '4 500 Kz',
      busModel: 'Mercedes Sprinter',
      busPlate: 'LD-90-34-F',
      driverName: 'Ricardo Almeida',
      vehicleType: 'VIP',
      boardingCutoffMinutes: 30,
      boardingPoint: 'Rodoviária do Zango',
      availableSeats: 30,
      totalSeats: 40,
      status: 'departed',
    },
  ]

  return allSchedules.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
}
