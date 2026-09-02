import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { IconBus, IconRefresh } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { Card, CardContent } from '@/components/ui/card'
import { readActiveHeldSeats } from '@/lib/seatHolds'
import { useSchedule, useScheduleSeats } from '@/hooks/catalog/useCatalog'
import { useBookingFlowStore } from '@/stores/bookingFlowStore'
import RouteDisplay from '@/components/RouteDisplay'
import StickyFooter from '@/components/StickyFooter'
import GradientButton from '@/components/GradientButton'
import PageHeader from '@/components/PageHeader'

type SeatStatus = 'available' | 'occupied' | 'held'

function seatLabel(seatNum: number): string {
  const row = Math.ceil(seatNum / 4)
  const col = String.fromCharCode(65 + ((seatNum - 1) % 4))
  return `${row}${col}`
}

function SeatButton({
  label,
  status,
  selected,
  dimmed,
  onClick,
}: {
  label: string
  status: SeatStatus
  selected: boolean
  dimmed: boolean
  onClick: () => void
}) {
  const base =
    'h-9 w-9 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center'

  if (status === 'occupied') {
    return (
      <button type="button" onClick={onClick} aria-label={`Lugar ${label} ocupado`}
        className={`${base} bg-gray-300 text-gray-500 cursor-not-allowed`}>
        {label}
      </button>
    )
  }
  if (status === 'held') {
    return (
      <button type="button" onClick={onClick} aria-label={`Lugar ${label} em retenção`}
        className={`${base} bg-[#C2410C] text-white cursor-not-allowed`}>
        {label}
      </button>
    )
  }
  if (selected) {
    return (
      <button onClick={onClick} aria-pressed
        className={`${base} bg-[#15632F] text-white shadow-lg scale-110 ring-2 ring-white`}>
        {label}
      </button>
    )
  }
  return (
    <button onClick={onClick}
      className={`${base} bg-[#1B7A3D] text-white ${dimmed ? 'opacity-40 hover:opacity-100' : 'hover:scale-105'}`}>
      {label}
    </button>
  )
}

function formatKz(value: number): string {
  return `${Math.round(value).toLocaleString('pt-PT')} Kz`
}

export default function SchedulePage() {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const navigate = useNavigate()
  const trip = useBookingFlowStore((s) => s.trip)
  const setSeat = useBookingFlowStore((s) => s.setSeat)
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null)
  const [, setTick] = useState(0)

  const { data: schedule } = useSchedule(scheduleId)
  const { data: seats, isLoading, error, refetch } = useScheduleSeats(scheduleId)

  const tripForSchedule = trip?.scheduleId === scheduleId ? trip : null

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000)
    return () => clearInterval(id)
  }, [])

  const totalSeats = seats?.total_seats ?? schedule?.total_seats ?? 0
  const occupiedSet = new Set(seats?.occupied ?? [])
  const availableSet = new Set(seats?.available ?? [])
  const heldSet = new Set(scheduleId ? readActiveHeldSeats(scheduleId) : [])

  function seatStatus(seat: number): SeatStatus {
    if (occupiedSet.has(seat)) return 'occupied'
    if (heldSet.has(seat)) return 'held'
    if (availableSet.size > 0 && !availableSet.has(seat)) return 'occupied'
    return 'available'
  }

  function handleSeatClick(seat: number) {
    const status = seatStatus(seat)
    if (status === 'occupied') {
      gooeyToast.error('Lugar ocupado', { description: `O lugar ${seatLabel(seat)} já está ocupado.` })
      return
    }
    if (status === 'held') {
      gooeyToast.warning('Lugar em retenção', { description: `O lugar ${seatLabel(seat)} está temporariamente retido.` })
      return
    }
    setSelectedSeat(seat === selectedSeat ? null : seat)
  }

  const rows = Math.ceil(totalSeats / 4)
  const seatGrid: (number | null)[][] = []
  let n = 1
  for (let r = 0; r < rows; r++) {
    const row: (number | null)[] = []
    for (let c = 0; c < 4; c++) {
      row.push(n <= totalSeats ? n : null)
      n++
    }
    seatGrid.push(row)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader
        onBack={() => navigate(-1)}
        title="Escolha o Lugar"
        subtitle={
          <div className="flex flex-wrap gap-1">
            {tripForSchedule && (
              <RouteDisplay origin={tripForSchedule.origin} destination={tripForSchedule.destination} iconClassName="size-3" />
            )}
            {tripForSchedule?.company && <p>• {tripForSchedule.company}</p>}
            {(tripForSchedule?.departureTime ?? schedule?.departure_time) && (
              <p>• {tripForSchedule?.departureTime ?? schedule?.departure_time}</p>
            )}
          </div>
        }
      />

      <main className="px-6 py-6 flex flex-col items-center gap-6 mt-4">
        {isLoading && <div className="h-72 w-[280px] animate-pulse rounded-2xl bg-gray-100" />}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-[#4B5563]">{error}</p>
            <button type="button" onClick={() => void refetch()}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#1B7A3D]">
              <IconRefresh className="size-4" />
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && totalSeats > 0 && (
          <>
            <Card className="rounded-2xl border border-gray-200 bg-white w-[280px]">
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center gap-2 justify-between">
                  <IconBus className="size-5 text-[#4B5563]" />
                  <h2 className="text-sm font-semibold text-[#9CA3AF]">Frente do Autocarro</h2>
                  <div className="h-6 w-6 rounded-xs bg-[#E5E7EB]" />
                </div>
                <div className="border-t border-[#E5E7EB]" />

                <div className="flex flex-col items-center gap-4">
                  {seatGrid.map((row, rowIdx) => {
                    const rowNum = rowIdx + 1
                    return (
                      <div key={rowIdx} className="flex items-center gap-4">
                        {row.slice(0, 2).map((seat, i) =>
                          seat === null ? (
                            <div key={`el-${rowNum}-${i}`} className="h-9 w-9" aria-hidden="true" />
                          ) : (
                            <SeatButton
                              key={seat}
                              label={`${rowNum}${String.fromCharCode(65 + i)}`}
                              status={seatStatus(seat)}
                              selected={seat === selectedSeat}
                              dimmed={selectedSeat !== null && seat !== selectedSeat && seatStatus(seat) === 'available'}
                              onClick={() => handleSeatClick(seat)}
                            />
                          ),
                        )}
                        <span className="w-10 text-center text-[11px] font-medium text-gray-400">Corredor</span>
                        {row.slice(2, 4).map((seat, i) =>
                          seat === null ? (
                            <div key={`er-${rowNum}-${i}`} className="h-9 w-9" aria-hidden="true" />
                          ) : (
                            <SeatButton
                              key={seat}
                              label={`${rowNum}${String.fromCharCode(67 + i)}`}
                              status={seatStatus(seat)}
                              selected={seat === selectedSeat}
                              dimmed={selectedSeat !== null && seat !== selectedSeat && seatStatus(seat) === 'available'}
                              onClick={() => handleSeatClick(seat)}
                            />
                          ),
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-8 text-[10px] text-gray-500 flex-wrap">
              <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-[#1B7A3D]" /><span>Livre</span></div>
              <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-[#C2410C]" /><span>Retido</span></div>
              <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-gray-300" /><span>Ocupado</span></div>
            </div>
          </>
        )}
      </main>

      <StickyFooter>
        {tripForSchedule && (
          <div className="flex justify-between w-full">
            <span className="text-sm text-[#4B5563]">Preço por lugar</span>
            <span className="text-base font-extrabold text-[#1B7A3D]">{formatKz(tripForSchedule.price)}</span>
          </div>
        )}
        <GradientButton
          disabled={selectedSeat === null}
          onClick={() => {
            if (selectedSeat === null || !scheduleId) return
            if (readActiveHeldSeats(scheduleId).includes(selectedSeat) || occupiedSet.has(selectedSeat)) {
              gooeyToast.error('Lugar já não disponível', {
                description: `O lugar ${seatLabel(selectedSeat)} foi ocupado ou retido.`,
              })
              setSelectedSeat(null)
              return
            }
            setSeat(selectedSeat)
            navigate(`/hold/${scheduleId}?seat=${selectedSeat}`)
          }}
        >
          Continuar
        </GradientButton>
      </StickyFooter>
    </div>
  )
}
