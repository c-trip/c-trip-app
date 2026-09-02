import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import { Card, CardContent } from '@/components/ui/card'
import { readTimestamp, addHeldSeat, removeHeldSeat, HOLD_TOTAL_SECONDS } from '@/lib/seatHolds'
import { useBookingFlowStore } from '@/stores/bookingFlowStore'
import RouteDisplay from '@/components/RouteDisplay'
import StickyFooter from '@/components/StickyFooter'
import GradientButton from '@/components/GradientButton'
import PageHeader from '@/components/PageHeader'

function getSeatLabel(seatNum: number): string {
  const row = Math.ceil(seatNum / 4)
  const col = String.fromCharCode(65 + ((seatNum - 1) % 4))
  return `${row}${col}`
}

function formatKz(value: number): string {
  return `${Math.round(value).toLocaleString('pt-PT')} Kz`
}

export default function HoldPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const trip = useBookingFlowStore((s) => s.trip)

  const seatParam = searchParams.get('seat')
  const seatNum = /^\d+$/.test(seatParam ?? '') ? parseInt(seatParam!, 10) : NaN
  const seatIsValid = Number.isFinite(seatNum) && seatNum > 0

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
    if (!existing) localStorage.setItem(holdKey, String(startedAt))
    addHeldSeat(sid, seatNum, startedAt)

    let restartTimeout: ReturnType<typeof setTimeout> | null = null

    function expire() {
      setSecondsLeft(0)
      removeHeldSeat(sid, seatNum)
      localStorage.removeItem(holdKey)
      if (!restartTimeout) {
        restartTimeout = setTimeout(() => navigate(`/schedules/${sid}`), 2000)
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

  if (!seatIsValid || !scheduleId) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-outfit flex flex-col">
        <PageHeader onBack={() => navigate(-1)} title="Reserva não encontrada" />
      </div>
    )
  }

  const seatLabel = getSeatLabel(seatNum)
  const tripForSchedule = trip?.scheduleId === scheduleId ? trip : null

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit flex flex-col">
      <PageHeader onBack={() => navigate(-1)} title="Resumo do Lugar" subtitle="Processo de reserva em andamento" />

      <div className={`sticky top-[72px] z-10 px-6 py-3 flex items-center border-b gap-2 ${
        isUrgent ? 'bg-red-50 border-red-300' : 'bg-[#FEF3C7] border-gray-200'
      }`}>
        <div className={`h-7 w-7 border-2 p-0.5 flex border-[#F59E0B] rounded-full justify-center items-center bg-white ${
          isUrgent ? '!border-red-500' : ''
        }`}>
          <p className={`font-bold text-[11px] font-inter ${isUrgent ? '!text-red-500' : 'text-[#F59E0B]'}`}>
            {isExpired ? '0m' : `${minutes}m`}
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <p className={`text-[14px] font-bold ${isUrgent ? 'text-red-500' : 'text-[#111827]'}`}>
              {isExpired ? '00:00' : timeDisplay}
            </p>
            <span className="text-[10px] text-gray-400">{isExpired ? 'Reserva expirada' : 'Restantes'}</span>
          </div>
          <p className="text-[12px] text-[#4B5563]">Conclua o pagamento para garantir o seu bilhete.</p>
        </div>
      </div>

      <main className="px-5 py-10 flex flex-col items-center gap-6 flex-1">
        <Card className="rounded-2xl border border-[#E5E7EB] bg-white w-full max-w-[350px]">
          <CardContent className="flex flex-col gap-3">
            {tripForSchedule && (
              <>
                <h2 className="text-lg font-bold text-gray-900">
                  <RouteDisplay origin={tripForSchedule.origin} destination={tripForSchedule.destination} iconClassName="size-5" />
                </h2>
                <div className="border-t border-[#E5E7EB]" />
                {tripForSchedule.company && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-400 font-inter">Companhia</span>
                    <span className="font-semibold font-inter text-gray-900">{tripForSchedule.company}</span>
                  </div>
                )}
                {(tripForSchedule.departureDate || tripForSchedule.departureTime) && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-gray-400 font-inter">Data e Hora</span>
                    <span className="font-semibold font-inter text-gray-900">
                      {tripForSchedule.departureDate} {tripForSchedule.departureTime}
                    </span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between text-[13px]">
              <span className="text-gray-400 font-inter">Lugar Escolhido</span>
              <span className="font-bold bg-[#1B7A3D1A] py-0.5 px-2 font-inter rounded-xl text-[#1B7A3D]">
                Lugar {seatLabel}
              </span>
            </div>

            {tripForSchedule && (
              <>
                <div className="border-t border-[#E5E7EB]" />
                <div className="flex justify-between">
                  <span className="text-sm font-normal text-[#4B5563]">Total a Pagar</span>
                  <span className="text-xl font-inter font-extrabold text-[#1B7A3D]">
                    {formatKz(tripForSchedule.price)}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>

      <StickyFooter>
        <GradientButton
          disabled={isExpired}
          onClick={() => {
            if (isExpired) return
            const current = readTimestamp(holdKey)
            if (!current || Math.floor((Date.now() - current) / 1000) >= totalSeconds) {
              setSecondsLeft(0)
              removeHeldSeat(scheduleId, seatNum)
              localStorage.removeItem(holdKey)
              return
            }
            navigate(`/checkout/${scheduleId}?seat=${seatNum}`)
          }}
          className="max-w-[350px]"
        >
          Ir para o checkout
        </GradientButton>
      </StickyFooter>
    </div>
  )
}
