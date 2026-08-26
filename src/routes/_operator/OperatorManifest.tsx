import { useSearchParams, useNavigate } from 'react-router'
import { IconArrowLeft, IconUser, IconBus } from '@tabler/icons-react'
import { getOperatorTodaySchedules } from '@/data/mockOperatorSchedules'
import { Card, CardContent } from '@/components/ui/card'

interface ManifestPassenger {
  bookingId: string
  seat: number
  name: string
  status: 'confirmed' | 'cancelled'
}

/** Mock de passageiros para uma viagem (simula GET /boarding/manifest). */
function getMockPassengers(): ManifestPassenger[] {
  return [
    { bookingId: 'bk-001', seat: 1, name: 'Ana Silva', status: 'confirmed' },
    { bookingId: 'bk-002', seat: 2, name: 'Carlos Mendes', status: 'confirmed' },
    { bookingId: 'bk-003', seat: 5, name: 'Maria Fernandes', status: 'confirmed' },
    { bookingId: 'bk-004', seat: 8, name: 'João Santos', status: 'cancelled' },
    { bookingId: 'bk-005', seat: 10, name: 'Pedro Almeida', status: 'confirmed' },
    { bookingId: 'bk-006', seat: 12, name: 'Lucia Torres', status: 'confirmed' },
    { bookingId: 'bk-007', seat: 15, name: 'Ricardo Neto', status: 'confirmed' },
  ]
}

export default function OperatorManifest() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const scheduleId = searchParams.get('schedule')

  const schedules = getOperatorTodaySchedules()
  const schedule = schedules.find((s) => s.id === scheduleId)

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gray-50 font-outfit flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Nenhuma viagem selecionada</p>
          <button
            type="button"
            onClick={() => navigate('/operator')}
            className="text-[#1B7A3D] font-semibold text-sm"
          >
            Voltar ao painel
          </button>
        </div>
      </div>
    )
  }

  const passengers = getMockPassengers()
  const confirmed = passengers.filter((p) => p.status === 'confirmed')
  const cancelled = passengers.filter((p) => p.status === 'cancelled')

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <header className="sticky top-0 z-40 bg-gray-50 px-5 pt-3 pb-4 border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-1">
          <button
            type="button"
            onClick={() => navigate('/operator')}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <IconArrowLeft className="size-5 text-gray-600" />
          </button>
          <h1 className="text-[22px] font-bold text-[#111827]">Manifesto de Embarque</h1>
        </div>
        <p className="text-sm text-gray-500 ml-10">Lista de passageiros da viagem</p>
      </header>

      <main className="px-5 py-6 pb-28">
        <Card className="border-[#E5E7EB] mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <IconBus className="size-5 text-[#1B7A3D]" />
              <div>
                <p className="text-sm font-bold text-[#111827]">{schedule.route}</p>
                <p className="text-[11px] text-gray-500">
                  {schedule.departureTime} · {schedule.busPlate}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-[#047857] font-semibold">{confirmed.length} confirmados</span>
              {cancelled.length > 0 && (
                <span className="text-[#4B5563] font-semibold">{cancelled.length} cancelados</span>
              )}
              <span className="text-gray-400 ml-auto">{schedule.availableSeats}/{schedule.totalSeats} disponíveis</span>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-sm font-bold text-[#111827] mb-3">Passageiros</h3>

        <div className="flex flex-col gap-2">
          {passengers.map((passenger) => (
            <Card
              key={passenger.bookingId}
              className={`p-0 border-[#E5E7EB] ${passenger.status === 'cancelled' ? 'opacity-50' : ''}`}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <div className="size-8 rounded-full bg-[#1B7A3D]/10 flex items-center justify-center">
                  <IconUser className="size-4 text-[#1B7A3D]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#111827]">{passenger.name}</p>
                  <p className="text-[11px] text-gray-500">Lugar {passenger.seat}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  passenger.status === 'confirmed'
                    ? 'bg-[#D1FAE5] text-[#047857]'
                    : 'bg-[#F3F4F6] text-[#4B5563]'
                }`}>
                  {passenger.status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
