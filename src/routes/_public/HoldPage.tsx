import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import { IconArrowLeft, IconClock } from '@tabler/icons-react'
import { getScheduleById } from '@/data/mockSeats'
import { Card, CardContent } from '@/components/ui/card'

const HOLD_MINUTES = 5

function getSeatLabel(seatNum: number): string {
  const row = Math.ceil(seatNum / 4)
  const col = String.fromCharCode(65 + ((seatNum - 1) % 4))
  return `${row}${col}`
}

export default function HoldPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const seatParam = searchParams.get('seat')
  const seatNum = seatParam ? parseInt(seatParam, 10) : null
  const seatLabel = seatNum !== null ? getSeatLabel(seatNum) : '?'

  const schedule = getScheduleById(scheduleId)

  const [secondsLeft, setSecondsLeft] = useState(HOLD_MINUTES * 60)

  const tick = useCallback(() => {
    setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
  }, [])

  useEffect(() => {
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tick])

  const expired = secondsLeft === 0
  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeDisplay = `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`
  const isUrgent = secondsLeft <= 60 && !expired

  if (!schedule || seatNum === null) {
    return (
    <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              aria-label="Voltar"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            >
              <IconArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Reserva não encontrada</h1>
          </div>
        </header>
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
          >
            <IconArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Resumo do Lugar </h1>
            <p className="text-xs text-gray-400">Processo de reserva em andamento</p>
          </div>
        </div>
      </header>

      <div className={`sticky top-[72px] z-10 bg-gray-50 px-6 py-3 bg-[#FEF3C7]
        border-b ${isUrgent ? 'border-red-300' : 'border-gray-200'}`}>
        <div className="flex items-center justify-center gap-2">
          <IconClock className={`h-4 w-4 ${isUrgent ? 'text-red-500' : 'text-[#9CA3AF]'}`} />
          <p className={`text-lg font-bold ${isUrgent ? 'text-red-500' : 'text-gray-900'}`}>
            {expired ? '00 : 00' : timeDisplay}
          </p>
          <span className="text-[10px] text-gray-400">
            {expired ? 'Reserva expirada' : 'Tempo restante'}
          </span>
        </div>
      </div>

      <main className="px-6 py-6 flex flex-col items-center gap-6 flex-1">
        <Card className="rounded-2xl border border-gray-200 bg-white w-full max-w-[350px]">
          <CardContent className="flex flex-col gap-3">
            <h2 className="text-lg font-bold text-gray-900">{schedule.route}</h2>
            <div className="border-t border-[#E5E7EB]" />

            <div className="flex justify-between text-xs">
              <span className="text-gray-400 text-[13px]">Companhia</span>
              <span className="font-bold text-gray-900 text-[13px]">{schedule.operatorName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 text-[13px]">Data e Hora</span>
              <span className="font-bold text-gray-900 text-[13px]">{schedule.departureDate}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-gray-400 text-[13px]">Lugar Escolhido</span>
              <span className="font-bold bg-[#1B7A3D1A] py-0.5 px-2
             rounded-xl text-[#1B7A3D] text-[13px]">Lugar {seatLabel}</span>
            </div>

            <div className="border-t border-[#E5E7EB]" />

            <div className="flex justify-between">
              <span className="text-sm font-normal text-[#4B5563]">Total</span>
              <span className="text-xl font-inter font-extrabold text-[#1B7A3D]">{schedule.price}</span>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className='sticky bottom-0 flex justify-center items-center
      border-t-2 border-[#E5E7EB] p-6'>
         <button
          disabled={expired}
          onClick={() => navigate(`/checkout/${schedule.id}?seat=${seatNum}`)}
          className={`w-full max-w-[350px] rounded-xl h-12 font-semibold text-[16px] text-white transition-colors ${
            expired
              ? 'bg-[#9CA3AF] cursor-not-allowed'
              : 'bg-[#1B7A3D] hover:bg-[#15632F]'
          }`}
        >
          {expired ? 'Reserva expirada' : 'Ir para o checkout'}
        </button>
      </footer>
    </div>
  )
}
