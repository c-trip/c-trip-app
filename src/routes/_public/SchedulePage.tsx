import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { IconBus } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { getScheduleById, getSeatMapBySchedule } from '@/data/mockSeats'
import { Card, CardContent } from '@/components/ui/card'
import { readActiveHeldSeats } from '@/lib/seatHolds'
import RouteDisplay from '@/components/RouteDisplay'
import StickyFooter from '@/components/StickyFooter'
import GradientButton from '@/components/GradientButton'
import PageHeader from '@/components/PageHeader'

function getSeatLabel(seatNum: number): string {
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
  onDoubleClick,
}: {
  label: string
  status: 'available' | 'occupied' | 'reserved' | 'held'
  selected: boolean
  dimmed: boolean
  onClick: () => void
  onDoubleClick: () => void
}) {
  const base = 'h-9 w-9 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center'

  if (status === 'occupied') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Lugar ${label} ocupado`}
        className={`${base} bg-gray-300 text-gray-500 cursor-not-allowed`}
      >
        {label}
      </button>
    )
  }

  if (status === 'reserved') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Lugar ${label} reservado`}
        className={`${base} bg-[#F59E0B] text-white cursor-not-allowed`}
      >
        {label}
      </button>
    )
  }

  if (status === 'held') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Lugar ${label} em retenção`}
        className={`${base} bg-[#C2410C] text-white cursor-not-allowed`}
      >
        {label}
      </button>
    )
  }

  if (selected) {
    return (
      <button
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        aria-pressed
        className={`${base} bg-[#15632F] text-white shadow-lg scale-110 ring-2 ring-white`}
      >
        {label}
      </button>
    )
  }

  if (dimmed) {
    return (
      <button
        onClick={onClick}
        className={`${base} bg-[#1B7A3D] text-white opacity-40 hover:opacity-100`}
      >
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
  const [, setTick] = useState(0)

  const schedule = getScheduleById(scheduleId)
  const seatMap = getSeatMapBySchedule(scheduleId)

  const heldSeats = scheduleId ? readActiveHeldSeats(scheduleId) : []
  const heldSet = new Set(heldSeats)
  const prevScheduleRef = useRef(scheduleId)

  useEffect(() => {
    if (prevScheduleRef.current !== scheduleId) {
      prevScheduleRef.current = scheduleId
      setSelectedSeat(null)
    }
  }, [scheduleId])

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 2000)
    return () => clearInterval(id)
  }, [])

  if (!schedule || !seatMap) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-outfit">
        <PageHeader onBack={() => navigate(-1)} title="Viagem não encontrada" />
      </div>
    )
  }

  const occupiedSet = new Set(seatMap.occupied)
  const reservedSet = new Set(seatMap.reserved)

  const rows = Math.ceil(seatMap.totalSeats / 4)
  const seatGrid: (number | null)[][] = []
  let seatNum = 1
  for (let r = 0; r < rows; r++) {
    const row: (number | null)[] = []
    for (let c = 0; c < 4; c++) {
      row.push(seatNum <= seatMap.totalSeats ? seatNum : null)
      seatNum++
    }
    seatGrid.push(row)
  }

  function getSeatStatus(seat: number): 'available' | 'occupied' | 'reserved' | 'held' {
    if (occupiedSet.has(seat)) return 'occupied'
    if (reservedSet.has(seat)) return 'reserved'
    if (heldSet.has(seat)) return 'held'
    return 'available'
  }

  function handleSeatClick(seat: number) {
    const label = getSeatLabel(seat)
    if (occupiedSet.has(seat)) {
      gooeyToast.error('Lugar ocupado', { description: `O lugar ${label} já está ocupado.` })
      return
    }
    if (reservedSet.has(seat)) {
      gooeyToast.warning('Lugar reservado', { description: `O lugar ${label} já está reservado.` })
      return
    }
    if (heldSet.has(seat)) {
      gooeyToast.warning('Lugar em retenção', { description: `O lugar ${label} está temporariamente retido.` })
      return
    }
    setSelectedSeat(seat === selectedSeat ? null : seat)
  }

  function handleSeatDoubleClick() {
    setSelectedSeat(null)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader
        onBack={() => navigate(-1)}
        title="Escolha o Lugar"
        subtitle={
          <div className="flex gap-1">
            <RouteDisplay origin={schedule.origin} destination={schedule.destination} iconClassName="size-3" />
            <p>• {schedule.operatorName}</p>
            <p>• {schedule.departureTime}</p>
          </div>
        }
      />

      <main className="px-6 py-6 flex flex-col items-center gap-6 mt-4">
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
                const leftSeats = row.slice(0, 2)
                const rightSeats = row.slice(2, 4)
                return (
                  <div key={rowIdx} className="flex items-center gap-4">
                    {leftSeats.map((seat, i) =>
                      seat === null ? (
                        <div key={`empty-l-${rowNum}-${i}`} className="h-9 w-9" aria-hidden="true" />
                      ) : (
                        <SeatButton
                          key={seat}
                          label={`${rowNum}${String.fromCharCode(65 + i)}`}
                          status={getSeatStatus(seat)}
                          selected={seat === selectedSeat}
                          dimmed={selectedSeat !== null && seat !== selectedSeat && getSeatStatus(seat) === 'available'}
                          onClick={() => handleSeatClick(seat)}
                          onDoubleClick={handleSeatDoubleClick}
                        />
                      ),
                    )}

                    <span className="w-10 text-center text-[11px] font-medium text-gray-400">
                      Corredor
                    </span>

                    {rightSeats.map((seat, i) =>
                      seat === null ? (
                        <div key={`empty-r-${rowNum}-${i}`} className="h-9 w-9" aria-hidden="true" />
                      ) : (
                        <SeatButton
                          key={seat}
                          label={`${rowNum}${String.fromCharCode(67 + i)}`}
                          status={getSeatStatus(seat)}
                          selected={seat === selectedSeat}
                          dimmed={selectedSeat !== null && seat !== selectedSeat && getSeatStatus(seat) === 'available'}
                          onClick={() => handleSeatClick(seat)}
                          onDoubleClick={handleSeatDoubleClick}
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
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-[#1B7A3D]" />
            <span>Livre</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded bg-[#C2410C]" />
            <span>Retido</span>
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

      <StickyFooter>
        <GradientButton
          disabled={selectedSeat === null}
          onClick={() => {
            if (selectedSeat === null) return
            const currentHeld = scheduleId ? readActiveHeldSeats(scheduleId) : []
            if (occupiedSet.has(selectedSeat) || reservedSet.has(selectedSeat) || currentHeld.includes(selectedSeat)) {
              gooeyToast.error('Lugar já não disponível', { description: `O lugar ${getSeatLabel(selectedSeat)} foi ocupado ou retido por outro utilizador.` })
              setSelectedSeat(null)
              return
            }
            const routeSlug = encodeURIComponent(schedule.route.replace(/\s*→\s*/g, '-').toLowerCase())
            const companySlug = encodeURIComponent(schedule.operatorName.toLowerCase())
            navigate(`/hold/${schedule.id}/${routeSlug}/${companySlug}?seat=${selectedSeat}`)
          }}
        >
          Continuar (Selecionar Lugar)
        </GradientButton>
      </StickyFooter>
    </div>
  )
}
