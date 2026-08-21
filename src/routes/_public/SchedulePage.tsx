import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { IconArrowLeft, IconXboxX } from '@tabler/icons-react'
import { getScheduleById, getSeatMapBySchedule } from '../../data/mockSeats'
import { Card, CardContent } from '../../components/ui/card'

function SeatButton({
  label,
  status,
  selected,
  onClick,
}: {
  label: string
  status: 'available' | 'occupied' | 'reserved'
  selected: boolean
  onClick: () => void
}) {
  const base = 'h-9 w-9 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center'

  if (status === 'occupied') {
    return (
      <div className={`${base} bg-gray-300 text-gray-500 cursor-not-allowed`}>
        {label}
      </div>
    )
  }

  if (status === 'reserved') {
    return (
      <div className={`${base} bg-[#F59E0B] text-white cursor-not-allowed`}>
        {label}
      </div>
    )
  }

  if (selected) {
    return (
      <button onClick={onClick} className={`${base} bg-[#1B7A3D] text-white shadow-md scale-110`}>
        {label}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`${base} bg-[#1B7A3D] text-white hover:scale-105`}
    >
      {label}
    </button>
  )
}

export default function SchedulePage() {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const navigate = useNavigate()
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null)

  const schedule = getScheduleById(scheduleId)
  const seatMap = getSeatMapBySchedule(scheduleId)

  if (!schedule || !seatMap) {
    return (
      <div className="min-h-screen bg-gray-50 font-outfit">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Voltar"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            >
              <IconArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Viagem não encontrada</h1>
          </div>
        </header>
      </div>
    )
  }

  const occupiedSet = new Set(seatMap.occupied)
  const reservedSet = new Set(seatMap.reserved)

  const rows = Math.ceil(seatMap.total_seats / 4)
  const seatGrid: (number | null)[][] = []
  let seatNum = 1
  for (let r = 0; r < rows; r++) {
    const row: (number | null)[] = []
    for (let c = 0; c < 4; c++) {
      row.push(seatNum <= seatMap.total_seats ? seatNum : null)
      seatNum++
    }
    seatGrid.push(row)
  }

  function getSeatStatus(seat: number | null): 'available' | 'occupied' | 'reserved' {
    if (seat === null) return 'available'
    if (occupiedSet.has(seat)) return 'occupied'
    if (reservedSet.has(seat)) return 'reserved'
    return 'available'
  }

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <IconArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{schedule.route}</h1>
            <p className="text-xs text-gray-400">{schedule.departureDate}</p>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 flex flex-col items-center gap-6 mt-4">
        <Card className="rounded-2xl border border-gray-200 bg-white w-[280px]">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2 justify-between">
              <IconXboxX className="size-5 text-[#4B5563]" />
              <h2 className="text-sm font-semibold text-[#9CA3AF]">Frente do Autocarro</h2>
              <div className="h-6 w-6 rounded-xs bg-[#E5E7EB]" />
            </div>
            <div className="border-t border-[#E5E7EB]" />

            <div className="flex flex-col items-center gap-4">
              {seatGrid.map((row, rowIdx) => {
                const rowNum = rowIdx + 1
                const leftSeats = row.slice(0, 2)
                const rightSeats = row.slice(2, 4)
                return (
                  <div key={rowIdx} className="flex items-center gap-2">
                    {leftSeats.map((seat, i) => (
                      <SeatButton
                        key={seat}
                        label={seat !== null ? `${rowNum}${String.fromCharCode(65 + i)}` : ''}
                        status={getSeatStatus(seat)}
                        selected={seat === selectedSeat}
                        onClick={() => {
                          if (seat !== null && !occupiedSet.has(seat) && !reservedSet.has(seat)) {
                            setSelectedSeat(seat === selectedSeat ? null : seat)
                          }
                        }}
                      />
                    ))}

                    <span className="w-10 text-center text-[11px] font-medium text-gray-400">
                      Corredor
                    </span>

                    {rightSeats.map((seat, i) => (
                      <SeatButton
                        key={seat}
                        label={seat !== null ? `${rowNum}${String.fromCharCode(67 + i)}` : ''}
                        status={getSeatStatus(seat)}
                        selected={seat === selectedSeat}
                        onClick={() => {
                          if (seat !== null && !occupiedSet.has(seat) && !reservedSet.has(seat)) {
                            setSelectedSeat(seat === selectedSeat ? null : seat)
                          }
                        }}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-4 text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-[#1B7A3D]" />
            <span>Livre</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-gray-300" />
            <span>Ocupado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-[#F59E0B]" />
            <span>Reservado</span>
          </div>
        </div>
      </main>
    </div>
  )
}
