import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { IconArrowLeft, IconBus, IconArmchair } from '@tabler/icons-react'
import { getScheduleById, getSeatMapBySchedule } from '../../data/mockSeats'
import { Card, CardContent } from '../../components/ui/card'

function SeatButton({
  seat,
  occupied,
  selected,
  onClick,
}: {
  seat: number | null
  occupied: boolean
  selected: boolean
  onClick: () => void
}) {
  if (seat === null) {
    return <div className="h-8 w-8" />
  }

  const base = 'h-8 w-8 rounded-lg text-[10px] font-semibold transition-all flex items-center justify-center'

  if (occupied) {
    return (
      <div className={`${base} bg-gray-300 text-gray-500 cursor-not-allowed`}>
        {seat}
      </div>
    )
  }

  if (selected) {
    return (
      <button onClick={onClick} className={`${base} bg-[#1B7A3D] text-white shadow-md scale-110`}>
        {seat}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`${base} border border-gray-300 bg-white text-gray-700 hover:border-[#1B7A3D] hover:text-[#1B7A3D]`}
    >
      {seat}
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

      <main className="px-5 py-5 space-y-4">
        <Card className="rounded-2xl border border-gray-200 bg-white">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-gradient-start/10">
                  <IconBus className="h-5 w-5 text-green-gradient-end" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{schedule.operatorName}</p>
                  <p className="text-[10px] text-gray-400">{schedule.vehicleType}</p>
                </div>
              </div>
              <span className="text-lg font-extrabold text-[#1B7A3D]">{schedule.price}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{schedule.departureTime}</p>
                <p className="text-[10px] text-gray-400">{schedule.origin}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="text-[10px] text-gray-400">{schedule.duration}</p>
                <div className="h-0.5 w-16 bg-gray-200" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900">{schedule.arrivalTime}</p>
                <p className="text-[10px] text-gray-400">{schedule.destination}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 text-xs text-gray-500 space-y-1">
              <p>Motorista: <span className="font-medium text-gray-700">{schedule.driverName}</span></p>
              <p>Autocarro: <span className="font-medium text-gray-700">{schedule.busModel}</span></p>
              <p>Matricula: <span className="font-medium text-gray-700">{schedule.busPlate}</span></p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <IconArmchair className="h-4 w-4 text-gray-500" />
              <h2 className="text-sm font-bold text-gray-900">Mapa de Lugares</h2>
            </div>

            <div className="flex justify-center gap-4 mb-4 text-[10px] text-gray-500">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded border border-gray-300 bg-white" />
                <span>Disponivel</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded bg-gray-300" />
                <span>Ocupado</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded bg-[#1B7A3D]" />
                <span>Seleccionado</span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[9px] font-medium text-gray-400 w-4 text-center">A</span>
                <span className="text-[9px] font-medium text-gray-400 w-4 text-center">B</span>
                <span className="w-6" />
                <span className="text-[9px] font-medium text-gray-400 w-4 text-center">C</span>
                <span className="text-[9px] font-medium text-gray-400 w-4 text-center">D</span>
              </div>

              {seatGrid.map((row, rowIdx) => (
                <div key={rowIdx} className="flex items-center gap-1.5">
                  <span className="text-[9px] font-medium text-gray-400 w-4 text-right">
                    {rowIdx + 1}
                  </span>

                  {row.slice(0, 2).map((seat) => (
                    <SeatButton
                      key={seat}
                      seat={seat}
                      occupied={seat !== null && occupiedSet.has(seat)}
                      selected={seat === selectedSeat}
                      onClick={() => {
                        if (seat !== null && !occupiedSet.has(seat)) {
                          setSelectedSeat(seat === selectedSeat ? null : seat)
                        }
                      }}
                    />
                  ))}

                  <div className="w-6" />

                  {row.slice(2, 4).map((seat) => (
                    <SeatButton
                      key={seat}
                      seat={seat}
                      occupied={seat !== null && occupiedSet.has(seat)}
                      selected={seat === selectedSeat}
                      onClick={() => {
                        if (seat !== null && !occupiedSet.has(seat)) {
                          setSelectedSeat(seat === selectedSeat ? null : seat)
                        }
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {selectedSeat !== null && (
          <Card className="rounded-2xl border-2 border-[#1B7A3D] bg-white">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Resumo</h3>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Lugar</span>
                  <span className="font-bold text-[#1B7A3D]">#{selectedSeat}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rota</span>
                  <span className="font-medium text-gray-900">{schedule.route}</span>
                </div>
                <div className="flex justify-between">
                  <span>Operador</span>
                  <span className="font-medium text-gray-900">{schedule.operatorName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Partida</span>
                  <span className="font-medium text-gray-900">{schedule.departureTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chegada</span>
                  <span className="font-medium text-gray-900">{schedule.arrivalTime}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-extrabold text-[#1B7A3D] text-base">{schedule.price}</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/checkout/${schedule.id}?seat=${selectedSeat}`)}
                className="w-full rounded-full bg-[#1B7A3D] py-3 text-sm font-bold text-white transition-colors hover:bg-[#15632F]"
              >
                Confirmar Lugar
              </button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
