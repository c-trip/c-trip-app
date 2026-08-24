import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import { IconArrowLeft, IconUser, IconId, IconPhone, IconCheck, IconClock, IconCircleDot } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { getScheduleById, getSeatMapBySchedule } from '@/data/mockSeats'
import { readTimestamp, removeHeldSeat, HOLD_TOTAL_SECONDS } from '@/lib/seatHolds'
import { saveBooking } from '@/lib/bookings'
import { getSeatLabel } from '@/lib/seats'
import type { Booking, PaymentMethod } from '@/types'

export default function CheckoutPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const seatParam = searchParams.get('seat')
  const seatNum = /^\d+$/.test(seatParam ?? '') ? parseInt(seatParam!, 10) : NaN
  const holdKey = `hold_${scheduleId}_${seatNum}`
  const totalSeconds = HOLD_TOTAL_SECONDS

  const schedule = getScheduleById(scheduleId)
  const seatMap = getSeatMapBySchedule(scheduleId)

  const seatIsValid =
    Number.isFinite(seatNum) &&
    seatNum > 0 &&
    schedule !== undefined &&
    seatMap !== undefined &&
    seatNum <= seatMap.totalSeats &&
    !seatMap.occupied.includes(seatNum) &&
    !seatMap.reserved.includes(seatNum)

  const seatLabel = seatIsValid ? getSeatLabel(seatNum) : '\u2014'

  const [nome, setNome] = useState('')
  const [bi, setBi] = useState('')
  const [telefone, setTelefone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [secondsLeft, setSecondsLeft] = useState(() => {
    if (!seatIsValid) return 0
    const ts = readTimestamp(holdKey)
    if (ts && ts <= Date.now()) {
      const elapsed = Math.floor((Date.now() - ts) / 1000)
      return Math.max(totalSeconds - elapsed, 0)
    }
    return 0
  })

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!seatIsValid || !scheduleId) return

    const sid = scheduleId

    function expireHold() {
      setSecondsLeft(0)
      removeHeldSeat(sid, seatNum)
      localStorage.removeItem(holdKey)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      gooeyToast.error('Reserva expirada', { description: 'Tempo esgotado. Selecione o lugar novamente.' })
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
      redirectTimeoutRef.current = setTimeout(() => navigate(`/schedules/${sid}`), 2000)
    }

    intervalRef.current = setInterval(() => {
      const current = readTimestamp(holdKey)
      if (!current || current > Date.now() || Date.now() - current >= totalSeconds * 1000) {
        expireHold()
        return
      }
      const elapsed = Math.floor((Date.now() - current) / 1000)
      const remaining = Math.max(totalSeconds - elapsed, 0)
      if (remaining === 0) {
        expireHold()
      } else {
        setSecondsLeft(remaining)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
        redirectTimeoutRef.current = null
      }
    }
  }, [holdKey, totalSeconds, seatIsValid, scheduleId, seatNum, navigate])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isUrgent = secondsLeft <= 60 && secondsLeft > 0
  const isExpired = secondsLeft === 0

  const isFormEmpty = !nome.trim() || !bi.trim() || !telefone.trim() || !selectedPayment
  const isDisabled = isExpired || isFormEmpty || isSubmitting

  const validate = () => {
    if (!nome.trim()) {
      gooeyToast.error('Campo obrigatório', { description: 'Introduza o seu nome completo.' })
      return false
    }
    if (!bi.trim()) {
      gooeyToast.error('Campo obrigatório', { description: 'Introduza o número do BI ou passaporte.' })
      return false
    }
    if (!telefone.trim()) {
      gooeyToast.error('Campo obrigatório', { description: 'Introduza um número de telefone válido.' })
      return false
    }
    if (!selectedPayment) {
      gooeyToast.error('Campo obrigatório', { description: 'Selecione um método de pagamento.' })
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (isDisabled) return
    if (!validate()) return
    if (!schedule) return
    const current = readTimestamp(holdKey)
    if (!current || current > Date.now() || Date.now() - current >= totalSeconds * 1000) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      setSecondsLeft(0)
      gooeyToast.error('Reserva expirada', { description: 'A retenção já expirou. Selecione o lugar novamente.' })
      removeHeldSeat(scheduleId!, seatNum)
      localStorage.removeItem(holdKey)
      if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
      redirectTimeoutRef.current = setTimeout(() => navigate(`/schedules/${scheduleId}`), 2000)
      return
    }
    setIsSubmitting(true)

    const booking: Booking = {
      id: `BK-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      scheduleId: scheduleId!,
      seat: seatNum,
      seatLabel,
      passengerName: nome,
      passengerBI: bi,
      passengerPhone: telefone,
      status: 'confirmada',
      price: schedule.price,
      createdAt: Date.now(),
      paymentMethod: selectedPayment,
    }
    const saved = saveBooking(booking)
    if (!saved) {
      gooeyToast.error('Erro ao guardar reserva', {
        description: 'Não foi possível guardar a reserva. Tente novamente.',
      })
      setIsSubmitting(false)
      return
    }

    if (intervalRef.current) clearInterval(intervalRef.current)
    removeHeldSeat(scheduleId!, seatNum)
    localStorage.removeItem(holdKey)
    gooeyToast.success('Pagamento processado', {
      description: `Bilhete para o lugar ${seatLabel} confirmado com sucesso.`,
    })
    try {
      sessionStorage.setItem(`ticket_passenger_${scheduleId}_${seatNum}`, nome)
    } catch {
      /* sessionStorage may be unavailable */
    }
    if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current)
    redirectTimeoutRef.current = setTimeout(() => navigate(`/ticket-qr/${scheduleId}?seat=${seatNum}`), 2000)
  }

  if (!schedule || !seatIsValid) {
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
            <h1 className="text-lg font-bold text-gray-900">Checkout não disponível</h1>
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
            <h1 className="text-lg font-bold">Checkout e Pagamento</h1>
            <p className="text-xs text-gray-400">Passo final da compra</p>
          </div>
        </div>
      </header>

      <div className={`sticky top-[72px] z-10 px-6 py-3 flex items-center
       gap-3 border-b ${isUrgent ? 'bg-red-50 border-red-300' : 'bg-[#FEF3C7] border-gray-200'}`}>
        <IconClock className={`h-5 w-5 flex-shrink-0 ${isUrgent ? 'text-red-500' : 'text-[#F59E0B]'}`} />
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <p className={`text-[14px] font-bold ${isUrgent ? 'text-red-500' : 'text-[#111827]'}`}>
              {isExpired ? '00:00' : timeDisplay}
            </p>
            <span className="text-[12px] text-gray-500">
              {isExpired ? 'Reserva expirada' : 'restantes para finalizar o pagamento'}
            </span>
          </div>
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {isExpired && 'Reserva expirada. Tempo esgotado.'}
      </div>

      <form key={holdKey} id="checkout-form" onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className="px-6 py-6 flex flex-col items-center gap-6 flex-1">
        <div className="w-full max-w-[350px]">
          <h2 className="block text-sm font-medium text-gray-700 mb-3 font-outfit">
            Dados do Passageiro (Lugar {seatLabel})
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="checkout-nome" className="block text-xs font-medium text-gray-500 mb-1.5 font-outfit">
                Nome completo
              </label>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="checkout-nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Introduza o seu nome completo"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-4 h-12
                   text-sm font-outfit text-gray-800 outline-none transition-colors
                   focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-bi" className="block text-xs font-medium text-gray-500 mb-1.5 font-outfit">
                N.º do BI ou Passaporte
              </label>
              <div className="relative">
                <IconId className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="checkout-bi"
                  type="text"
                  value={bi}
                  onChange={(e) => setBi(e.target.value)}
                  placeholder="Ex: 001234567LA045"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-4 h-12
                   text-sm font-outfit text-gray-800 outline-none transition-colors
                   focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="checkout-telefone" className="block text-xs font-medium text-gray-500 mb-1.5 font-outfit">
                Telefone (Contacto de Viagem)
              </label>
              <div className="relative">
                <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="checkout-telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Ex: 923 456 789"
                  className="w-full rounded-xl border border-gray-300 bg-gray-50 pl-10 pr-4 h-12
                   text-sm font-outfit text-gray-800 outline-none transition-colors
                   focus:border-green-500"
                />
              </div>
            </div>
          </div>
        </div>

        <fieldset className="w-full max-w-[350px]">
          <legend className="block text-sm font-medium text-gray-700 mb-3 font-outfit">
            Método de Pagamento
          </legend>
          <button
            type="button"
            aria-pressed={selectedPayment === 'mcx'}
            onClick={() => setSelectedPayment('mcx')}
            className={`w-full rounded-2xl border-2 bg-white transition-colors text-left ${
              selectedPayment === 'mcx' ? 'border-[#1B7A3D]' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                selectedPayment === 'mcx' ? 'bg-[#1B7A3D]' : 'bg-gray-200'
              }`}>
                {selectedPayment === 'mcx'
                  ? <IconCheck className="h-5 w-5 text-white" />
                  : <IconCircleDot className="h-5 w-5 text-gray-400" />
                }
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 font-outfit">Multicaixa Express (MCX)</span>
                <span className="text-xs text-gray-400 font-outfit">Pagamento rápido e seguro em Angola</span>
              </div>
            </div>
          </button>
        </fieldset>
      </form>

      <footer className="sticky bottom-0 flex flex-col items-center gap-3 border-t-2 border-[#E5E7EB] bg-white p-6">
        <div className="flex justify-between w-full max-w-[350px]">
          <span className="text-sm font-normal text-[#4B5563] font-outfit">Total a pagar</span>
          <span className="text-xl font-extrabold text-[#1B7A3D] font-outfit">{schedule.price}</span>
        </div>
        <button
          type="submit"
          form="checkout-form"
          disabled={isDisabled}
          className="w-full max-w-[350px] rounded-xl h-12 font-semibold text-[16px] text-white
           bg-[#1B7A3D] hover:bg-[#15632F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirmar e Pagar
        </button>
      </footer>
    </div>
  )
}
