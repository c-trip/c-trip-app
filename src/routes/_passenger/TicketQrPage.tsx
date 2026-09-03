import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import QRCode from 'qrcode'
import { IconShare2, IconLoader2, IconShieldCheckFilled, IconRefresh } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { getSeatLabel } from '@/lib/seats'
import { useGenerateQr } from '@/hooks/passenger/usePassenger'
import { useBookingFlowStore } from '@/stores/bookingFlowStore'
import RouteDisplay from '@/components/RouteDisplay'
import StickyFooter from '@/components/StickyFooter'
import GradientButton from '@/components/GradientButton'
import PageHeader from '@/components/PageHeader'

export default function TicketQrPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const trip = useBookingFlowStore((s) => s.trip)

  const seatParam = searchParams.get('seat')
  const seatNum = /^\d+$/.test(seatParam ?? '') ? parseInt(seatParam!, 10) : NaN
  const seatIsValid = Number.isFinite(seatNum) && seatNum > 0
  const seatLabel = seatIsValid ? getSeatLabel(seatNum) : '—'

  const tripForSchedule = trip?.scheduleId === scheduleId ? trip : null

  const { generate, isLoading: generating } = useGenerateQr()
  const [qrHash, setQrHash] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSharing, setIsSharing] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!seatIsValid || !scheduleId) return
    let cancelled = false

    void generate({ schedule_id: scheduleId, seat_number: seatNum }).then(async (res) => {
      if (cancelled) return
      if (!res) {
        setError('Não foi possível gerar o bilhete. A reserva pode ainda não estar confirmada.')
        return
      }
      setQrHash(res.qr_hash)
      try {
        const url = await QRCode.toDataURL(res.qr_hash, { width: 220, margin: 2, errorCorrectionLevel: 'M' })
        if (!cancelled) setQrDataUrl(url)
      } catch {
        if (!cancelled) setError('Não foi possível desenhar o QR code.')
      }
    })

    return () => {
      cancelled = true
    }
  }, [seatIsValid, scheduleId, seatNum, generate, attempt])

  const shareText = [
    'Bilhete C-Trip',
    tripForSchedule ? `${tripForSchedule.origin} → ${tripForSchedule.destination}` : '',
    tripForSchedule?.company ?? '',
    `Lugar: ${seatLabel}`,
    qrHash ? `Código: ${qrHash}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Bilhete C-Trip', text: shareText })
      } else {
        await navigator.clipboard.writeText(shareText)
        gooeyToast.success('Copiado', { description: 'Detalhes do bilhete copiados.' })
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      gooeyToast.error('Erro ao partilhar')
    } finally {
      setIsSharing(false)
    }
  }

  if (!seatIsValid || !scheduleId) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] font-outfit flex flex-col">
        <PageHeader onBack={() => navigate(-1)} title="Bilhete não disponível" />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="max-w-xs text-sm text-gray-500">Dados do bilhete inválidos.</p>
          <button
            onClick={() => navigate('/tickets')}
            className="h-12 rounded-xl bg-[#1B7A3D] px-6 text-base font-semibold text-white hover:bg-[#15632F]"
          >
            Ver os meus bilhetes
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit flex flex-col">
      <PageHeader title="Bilhete Confirmado" className="px-6" />

      <main className="flex flex-1 flex-col items-center gap-6 px-6 py-6 pb-[160px]">
        <div className="flex items-center justify-center gap-1 rounded-3xl bg-[#D1FAE5] px-3 py-1">
          <IconShieldCheckFilled className="h-2.5 w-3 text-[#10B981]" />
          <span className="text-[11px] font-semibold text-[#10B981]">Disponível offline</span>
        </div>

        <section
          aria-label="Detalhes do bilhete"
          className="w-full max-w-[350px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between bg-[#1B7A3D1A] px-5 py-4">
            <div className="flex flex-col">
              {tripForSchedule?.company && (
                <span className="text-[12px] font-semibold text-[#1B7A3D] uppercase">{tripForSchedule.company}</span>
              )}
              <span className="text-lg text-[#111827] font-bold">
                {tripForSchedule ? (
                  <RouteDisplay origin={tripForSchedule.origin} destination={tripForSchedule.destination} />
                ) : (
                  'Bilhete'
                )}
              </span>
            </div>
          </div>

          <div className="py-4">
            <div className="mt-2 flex flex-col items-center">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt={`QR code do bilhete, lugar ${seatLabel}`} className="h-52 w-52" />
              ) : error ? (
                <div className="flex h-52 w-52 flex-col items-center justify-center gap-3 text-center">
                  <p className="text-xs text-[#4B5563]">{error}</p>
                  <button
                    type="button"
                    onClick={() => { setError(null); setAttempt((a) => a + 1) }}
                    className="flex items-center gap-1.5 text-sm font-semibold text-[#1B7A3D]"
                  >
                    <IconRefresh className="size-4" />
                    Tentar novamente
                  </button>
                </div>
              ) : (
                <div className="flex h-52 w-52 items-center justify-center">
                  <IconLoader2 className="size-8 animate-spin text-gray-300" />
                </div>
              )}
              {qrHash && <p className="mt-4 break-all px-6 text-center text-[11px] text-[#9CA3AF]">{qrHash}</p>}
            </div>

            <dl className="mt-4 flex flex-col gap-4 border-t border-[#E5E7EB] pt-5">
              <div className="flex justify-between items-center px-5">
                <div className="flex flex-col gap-0.5">
                  <dt className="text-[11px] text-[#4B5563] font-inter">Lugar</dt>
                  <dd className="text-[13px] font-bold text-[#1B7A3D] font-inter">Lugar {seatLabel}</dd>
                </div>
                {(tripForSchedule?.departureDate || tripForSchedule?.departureTime) && (
                  <div className="flex flex-col text-right">
                    <dt className="text-[11px] text-[#4B5563] font-inter">Partida</dt>
                    <dd className="text-sm font-semibold text-[#111827] font-inter">
                      {tripForSchedule?.departureDate} {tripForSchedule?.departureTime}
                    </dd>
                  </div>
                )}
              </div>
            </dl>
          </div>
        </section>
      </main>

      <StickyFooter className="fixed bottom-0 inset-x-0">
        <button
          onClick={() => void handleShare()}
          disabled={!qrHash || isSharing || generating}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#1B7A3D] text-[#1B7A3D] transition-colors hover:bg-[#1B7A3D]/5 disabled:opacity-50"
        >
          {isSharing ? <IconLoader2 className="h-5 w-5 animate-spin" /> : <IconShare2 className="h-5 w-5" />}
          <span className="text-sm font-semibold">{isSharing ? 'A partilhar...' : 'Partilhar'}</span>
        </button>
        <GradientButton onClick={() => navigate('/bookings')}>Ver as Minhas Reservas</GradientButton>
      </StickyFooter>
    </div>
  )
}
