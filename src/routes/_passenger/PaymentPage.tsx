import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { IconClock, IconCopy, IconCheck, IconRefresh } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import PageHeader from '@/components/PageHeader'
import StickyFooter from '@/components/StickyFooter'
import GradientButton from '@/components/GradientButton'
import { usePaymentStatus } from '@/hooks/passenger/usePassenger'
import { useBookingFlowStore } from '@/stores/bookingFlowStore'

function formatKz(value: number): string {
  return `${Math.round(value).toLocaleString('pt-PT')} Kz`
}

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>()
  const navigate = useNavigate()
  const payment = useBookingFlowStore((s) => s.payment)
  const trip = useBookingFlowStore((s) => s.trip)
  const seatNumber = useBookingFlowStore((s) => s.seatNumber)
  const reset = useBookingFlowStore((s) => s.reset)

  const { data, isLoading, error, refetch } = usePaymentStatus(bookingId)
  const [copied, setCopied] = useState(false)
  const doneRef = useRef(false)

  const status = data?.status
  const amount = data?.amount ?? payment?.amount ?? trip?.price ?? 0

  // Polling enquanto pendente.
  useEffect(() => {
    if (status === 'confirmed' || status === 'failed' || status === 'cancelled') return
    const id = setInterval(() => void refetch(), 4000)
    return () => clearInterval(id)
  }, [status, refetch])

  // Ao confirmar, segue para o bilhete.
  useEffect(() => {
    if (status !== 'confirmed' || doneRef.current) return
    doneRef.current = true
    gooeyToast.success('Pagamento confirmado', { description: 'O seu bilhete está pronto.' })
    const timer = setTimeout(() => {
      if (trip?.scheduleId && seatNumber) {
        navigate(`/ticket-qr/${trip.scheduleId}?seat=${seatNumber}`, { replace: true })
      } else {
        navigate(`/bookings/${bookingId}`, { replace: true })
      }
      reset()
    }, 1200)
    return () => clearTimeout(timer)
  }, [status, trip, seatNumber, bookingId, navigate, reset])

  const copyReference = async () => {
    if (!payment?.reference) return
    try {
      await navigator.clipboard.writeText(payment.reference)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      gooeyToast.error('Não foi possível copiar')
    }
  }

  const confirmed = status === 'confirmed'
  const failed = status === 'failed' || status === 'cancelled'

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit flex flex-col">
      <PageHeader onBack={() => navigate('/bookings')} title="Pagamento" subtitle={`Reserva ${bookingId?.slice(0, 8)}`} />

      <main className="px-5 py-8 flex flex-col items-center gap-6 flex-1">
        <div className={`size-20 rounded-full flex items-center justify-center ${
          confirmed ? 'bg-[#1B7A3D]' : failed ? 'bg-red-500' : 'bg-[#FEF3C7]'
        }`}>
          {confirmed ? (
            <IconCheck className="size-10 text-white" strokeWidth={3} />
          ) : failed ? (
            <IconClock className="size-10 text-white" />
          ) : (
            <IconClock className="size-10 text-[#F59E0B]" />
          )}
        </div>

        <div className="text-center">
          <p className="text-lg font-bold text-[#111827]">
            {confirmed ? 'Pagamento confirmado' : failed ? 'Pagamento não concluído' : 'A aguardar pagamento'}
          </p>
          <p className="text-sm text-[#4B5563] mt-1">
            {confirmed
              ? 'A redireccionar para o bilhete...'
              : failed
                ? 'A referência expirou ou o pagamento falhou.'
                : 'Pague a referência abaixo. A confirmação é automática.'}
          </p>
        </div>

        {!confirmed && !failed && payment && (
          <div className="w-full max-w-[350px] rounded-2xl border border-[#E5E7EB] bg-white p-5 flex flex-col gap-3">
            {payment.entity && (
              <div className="flex justify-between text-sm">
                <span className="text-[#4B5563]">Entidade</span>
                <span className="font-bold text-[#111827]">{payment.entity}</span>
              </div>
            )}
            {payment.reference && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#4B5563]">Referência</span>
                <button type="button" onClick={copyReference} className="flex items-center gap-1.5 font-bold text-[#1B7A3D]">
                  {payment.reference}
                  {copied ? <IconCheck className="size-4" /> : <IconCopy className="size-4" />}
                </button>
              </div>
            )}
            <div className="flex justify-between text-sm border-t border-[#E5E7EB] pt-3">
              <span className="text-[#4B5563]">Montante</span>
              <span className="font-extrabold text-[#1B7A3D]">{formatKz(amount)}</span>
            </div>
            {payment.expiresAt && (
              <p className="text-[11px] text-gray-400">
                Válida até {new Date(payment.expiresAt).toLocaleString('pt-PT')}
              </p>
            )}
          </div>
        )}

        {!confirmed && !failed && !payment && (
          <p className="text-sm text-gray-400 text-center max-w-xs">
            Sem detalhes da referência nesta sessão. Verifique o estado abaixo.
          </p>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </main>

      {!confirmed && (
        <StickyFooter>
          <GradientButton onClick={() => void refetch()} disabled={isLoading}>
            <IconRefresh className="size-4" />
            {isLoading ? 'A verificar...' : 'Já paguei — verificar'}
          </GradientButton>
          {failed && (
            <button
              type="button"
              onClick={() => navigate('/search')}
              className="w-full h-12 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-[#4B5563]"
            >
              Nova pesquisa
            </button>
          )}
        </StickyFooter>
      )}
    </div>
  )
}
