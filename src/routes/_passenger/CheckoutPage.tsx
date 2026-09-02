import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import { IconId, IconPhone, IconClock, IconCircleDot, IconUser } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { readTimestamp, removeHeldSeat, HOLD_TOTAL_SECONDS } from '@/lib/seatHolds'
import { getSeatLabel } from '@/lib/seats'
import { useAuth } from '@/hooks/auth/useAuth'
import { useInitiatePayment, useUpdateProfile } from '@/hooks/passenger/usePassenger'
import { useBookingFlowStore } from '@/stores/bookingFlowStore'
import type { PaymentMethodApi } from '@/types/passenger'
import StickyFooter from '@/components/StickyFooter'
import GradientButton from '@/components/GradientButton'
import PageHeader from '@/components/PageHeader'
import RouteDisplay from '@/components/RouteDisplay'

function formatKz(value: number): string {
  return `${Math.round(value).toLocaleString('pt-PT')} Kz`
}

export default function CheckoutPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const trip = useBookingFlowStore((s) => s.trip)
  const setPayment = useBookingFlowStore((s) => s.setPayment)

  const seatParam = searchParams.get('seat')
  const seatNum = /^\d+$/.test(seatParam ?? '') ? parseInt(seatParam!, 10) : NaN
  const seatIsValid = Number.isFinite(seatNum) && seatNum > 0
  const holdKey = `hold_${scheduleId}_${seatNum}`

  const tripForSchedule = trip?.scheduleId === scheduleId ? trip : null
  const amount = tripForSchedule?.price ?? 0

  const [bi, setBi] = useState('')
  const [telefone, setTelefone] = useState('')
  const [method, setMethod] = useState<PaymentMethodApi>('multicaixa_express')

  const { initiate, isLoading: initiating } = useInitiatePayment()
  const { updateProfile } = useUpdateProfile()

  const redirectRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!seatIsValid) return 0
    const ts = readTimestamp(holdKey)
    if (!ts) return 0
    return Math.max(HOLD_TOTAL_SECONDS - Math.floor((Date.now() - ts) / 1000), 0)
  })

  useEffect(() => {
    if (!seatIsValid || !scheduleId) return
    const sid = scheduleId

    const id = setInterval(() => {
      const ts = readTimestamp(holdKey)
      const remaining = ts ? Math.max(HOLD_TOTAL_SECONDS - Math.floor((Date.now() - ts) / 1000), 0) : 0
      setSecondsLeft(remaining)
      if (remaining === 0) {
        clearInterval(id)
        removeHeldSeat(sid, seatNum)
        localStorage.removeItem(holdKey)
        gooeyToast.error('Reserva expirada', { description: 'Tempo esgotado. Selecione o lugar novamente.' })
        redirectRef.current = setTimeout(() => navigate(`/schedules/${sid}`), 2000)
      }
    }, 1000)

    return () => {
      clearInterval(id)
      if (redirectRef.current) clearTimeout(redirectRef.current)
    }
  }, [holdKey, seatIsValid, scheduleId, seatNum, navigate])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isUrgent = secondsLeft <= 60 && secondsLeft > 0
  const isExpired = secondsLeft === 0
  const seatLabel = seatIsValid ? getSeatLabel(seatNum) : '—'

  const canSubmit = seatIsValid && !!scheduleId && amount > 0 && !isExpired && !initiating

  const handleSubmit = async () => {
    if (!canSubmit || !scheduleId) return

    if (telefone.trim() || bi.trim()) {
      await updateProfile({
        phone: telefone.trim() || undefined,
        id_document: bi.trim() || undefined,
      })
    }

    const res = await initiate({
      schedule_id: scheduleId,
      seat_number: seatNum,
      amount,
      method,
    })

    if (!res) {
      gooeyToast.error('Não foi possível iniciar o pagamento', { description: 'Tente novamente.' })
      return
    }

    setPayment({
      bookingId: res.booking_id,
      paymentId: res.payment_id,
      amount: res.amount,
      reference: res.reference,
      entity: res.entity,
      gateway: res.gateway,
      expiresAt: res.expires_at,
    })
    removeHeldSeat(scheduleId, seatNum)
    localStorage.removeItem(holdKey)
    gooeyToast.success('Reserva criada', { description: 'Conclua o pagamento para confirmar o bilhete.' })
    navigate(`/payment/${res.booking_id}`)
  }

  if (!seatIsValid || !scheduleId) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-outfit">
        <PageHeader onBack={() => navigate(-1)} title="Checkout não disponível" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit flex flex-col">
      <PageHeader onBack={() => navigate(-1)} title="Checkout e Pagamento" subtitle="Passo final da compra" />

      <div className={`sticky top-[72px] z-10 px-6 py-3 flex items-center gap-3 border-b ${
        isUrgent ? 'bg-red-50 border-red-300' : 'bg-[#FEF3C7] border-gray-200'
      }`}>
        <IconClock className={`h-5 w-5 flex-shrink-0 ${isUrgent ? 'text-red-500' : 'text-[#F59E0B]'}`} />
        <div className="flex gap-2 items-center">
          <p className={`text-[14px] font-bold ${isUrgent ? 'text-red-500' : 'text-[#111827]'}`}>
            {isExpired ? '00:00' : timeDisplay}
          </p>
          <span className="text-[12px] text-gray-500">
            {isExpired ? 'Reserva expirada' : 'restantes para finalizar'}
          </span>
        </div>
      </div>

      <main className="px-6 py-6 flex flex-col items-center gap-6 flex-1">
        <div className="w-full max-w-[350px] rounded-2xl border border-[#E5E7EB] bg-white p-4 flex flex-col gap-2">
          {tripForSchedule && (
            <div className="text-[15px] font-bold text-[#111827]">
              <RouteDisplay origin={tripForSchedule.origin} destination={tripForSchedule.destination} />
            </div>
          )}
          <div className="flex justify-between text-[13px]">
            <span className="text-[#4B5563]">Passageiro</span>
            <span className="font-semibold text-[#111827]">{user?.name ?? '—'}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#4B5563]">Lugar</span>
            <span className="font-semibold text-[#1B7A3D]">Lugar {seatLabel}</span>
          </div>
        </div>

        <div className="w-full max-w-[350px]">
          <h2 className="block text-[15px] font-bold text-[#111827] mb-3">Dados de viagem (opcional)</h2>
          <div className="flex flex-col gap-4">
            <div className="relative">
              <IconId className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text" value={bi} onChange={(e) => setBi(e.target.value)}
                placeholder="Nº do BI ou Passaporte"
                className="w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-4 h-12 text-sm text-gray-800 outline-none focus:border-green-500"
              />
            </div>
            <div className="relative">
              <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)}
                placeholder="Telefone de contacto"
                className="w-full rounded-lg border border-[#D1D5DB] bg-white pl-10 pr-4 h-12 text-sm text-gray-800 outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        <fieldset className="w-full max-w-[350px]">
          <legend className="block text-[15px] font-bold text-[#111827] mb-3">Método de Pagamento</legend>
          <button
            type="button"
            aria-pressed={method === 'multicaixa_express'}
            onClick={() => setMethod('multicaixa_express')}
            className={`w-full rounded-2xl border-2 bg-white text-left ${
              method === 'multicaixa_express' ? 'border-[#1B7A3D]' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                method === 'multicaixa_express' ? 'bg-[#1B7A3D]' : 'bg-gray-200'
              }`}>
                <IconCircleDot className={`h-5 w-5 ${method === 'multicaixa_express' ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#111827]">Multicaixa Express</span>
                <span className="text-xs text-[#4B5563]">Recebe uma referência para pagar</span>
              </div>
            </div>
          </button>
        </fieldset>

        <div className="w-full max-w-[350px] flex items-center gap-2 text-xs text-gray-400">
          <IconUser className="size-4" />
          A reserva fica associada à sua conta.
        </div>
      </main>

      <StickyFooter>
        <div className="flex justify-between w-full max-w-[350px]">
          <span className="text-sm text-[#4B5563]">Total a pagar</span>
          <span className="text-[22px] font-extrabold text-[#1B7A3D]">{formatKz(amount)}</span>
        </div>
        <GradientButton onClick={handleSubmit} disabled={!canSubmit} className="max-w-[350px]">
          {initiating ? 'A processar...' : 'Confirmar e Pagar'}
        </GradientButton>
      </StickyFooter>
    </div>
  )
}
