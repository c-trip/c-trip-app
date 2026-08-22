import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import { getScheduleById, getSeatMapBySchedule } from '@/data/mockSeats'
import { Card, CardContent } from '@/components/ui/card'
import { readTimestamp, addHeldSeat, removeHeldSeat, HOLD_TOTAL_SECONDS } from '@/lib/seatHolds'

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
  const seatNum = /^\d+$/.test(seatParam ?? '') ? parseInt(seatParam!, 10) : NaN

  const schedule = getScheduleById(scheduleId)
  const seatMap = getSeatMapBySchedule(scheduleId)

  const seatIsValid =
    Number.isFinite(seatNum) &&
    seatNum > 0 &&
    seatMap !== undefined &&
    seatNum <= seatMap.totalSeats &&
    !seatMap.occupied.includes(seatNum) &&
    !seatMap.reserved.includes(seatNum)

  const holdKey = `hold_${scheduleId}_${seatNum}`
  const totalSeconds = HOLD_TOTAL_SECONDS

  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!seatIsValid) return 0
    const ts = readTimestamp(holdKey)
    if (ts) {
      const elapsed = Math.floor((Date.now() - ts) / 1000)
      return Math.max(totalSeconds - elapsed, 0)
    }
    return totalSeconds
  })

  useEffect(() => {
    if (!seatIsValid || !scheduleId) return

    const sid = scheduleId

    const existing = readTimestamp(holdKey)
    const startedAt = existing ?? Date.now()
    if (!existing) {
      localStorage.setItem(holdKey, String(startedAt))
    }
    addHeldSeat(sid, seatNum, startedAt)

    let restartTimeout: ReturnType<typeof setTimeout> | null = null

    function expire() {
      setSecondsLeft(0)
      removeHeldSeat(sid, seatNum)
      localStorage.removeItem(holdKey)
      if (!restartTimeout) {
        restartTimeout = setTimeout(() => {
          navigate(`/schedules/${sid}`)
        }, 2000)
      }
    }

    const id = setInterval(() => {
      const current = readTimestamp(holdKey)
      if (!current) {
        expire()
        clearInterval(id)
        return
      }
      const elapsed = Math.floor((Date.now() - current) / 1000)
      const remaining = Math.max(totalSeconds - elapsed, 0)
      if (remaining === 0) {
        expire()
        clearInterval(id)
      } else {
        setSecondsLeft(remaining)
      }
    }, 1000)

    return () => {
      clearInterval(id)
      if (restartTimeout) clearTimeout(restartTimeout)
    }
  }, [holdKey, totalSeconds, seatIsValid, scheduleId, seatNum, navigate])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isUrgent = secondsLeft <= 60 && secondsLeft > 0
  const isExpired = secondsLeft === 0

  if (!schedule || !seatIsValid) {
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

  const seatLabel = getSeatLabel(seatNum)

  return (
    <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors
             hover:bg-gray-200"
          >
            <IconArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold">Resumo do Lugar</h1>
            <p className="text-xs text-gray-400">Processo de reserva em andamento</p>
          </div>
        </div>
      </header>

      <div className={`sticky top-[72px] z-10 px-6 py-3 flex items-center
       justify-items-start border-b gap-2 ${isUrgent ? 'bg-red-50 border-red-300' : 'bg-[#FEF3C7] border-gray-200'}`}>
        <div className={`h-7 w-7 border-2 p-0.5 flex border-[#F59E0B] rounded-full
         justify-center items-center bg-white ${isUrgent ? '!border-red-500' : ''}`}>
          <p className={`font-bold text-[11px] ${isUrgent ? '!text-red-500' : 'text-[#F59E0B]'}`}>
            {isExpired ? '0m' : `${minutes}m`}
          </p>
        </div>
        <div className="flex place-items-start flex-col justify-items-start">
          <div className="flex gap-2 items-center justify-center">
            <p className={`text-[14px] font-bold ${isUrgent ? 'text-red-500' : 'text-[#111827]'}`}>
              {isExpired ? '00:00' : timeDisplay}
            </p>
            <span className="text-[10px] text-gray-400">
              {isExpired ? 'Reserva expirada' : 'Restantes'}
            </span>
          </div>
          <p className="text-[12px] text-[#4B5563]">Conclua o pagamento para garantir o seu bilhete.</p>
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {isExpired ? 'A reserva do lugar expirou.' : ''}
      </div>

      <main className="px-6 py-10 flex flex-col items-center gap-6 flex-1">
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
              <span className="font-bold text-gray-900 text-[13px]">{schedule.departureDate} {schedule.departureTime}</span>
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

      <footer className="sticky bottom-0 flex justify-center items-center
       border-t-2 border-[#E5E7EB] bg-white p-6">
        <button
          disabled={isExpired}
          onClick={() => {
            if (isExpired) return
            const current = readTimestamp(holdKey)
            if (!current || Math.floor((Date.now() - current) / 1000) >= totalSeconds) {
              setSecondsLeft(0)
              removeHeldSeat(schedule.id, seatNum)
              localStorage.removeItem(holdKey)
              return
            }
            localStorage.removeItem(holdKey)
            navigate(`/checkout/${schedule.id}?seat=${seatNum}`)
          }}
          className="w-full max-w-[350px] rounded-xl h-12 font-semibold text-[16px] text-white
           bg-[#1B7A3D] hover:bg-[#15632F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Ir para o checkout
        </button>
      </footer>
    </div>
  )
}
