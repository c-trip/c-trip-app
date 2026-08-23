import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { IconArrowLeft, IconX, IconShare2, IconDownload, IconLoader2, IconShieldCheckFilled } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { getScheduleById, getSeatMapBySchedule } from '@/data/mockSeats'
import { getSeatLabel } from '@/lib/seats'
import { generateTicketQR } from '@/lib/qr'

function getQrCacheKey(scheduleId: string, seat: string): string {
  return `qr_ticket_${scheduleId}_${seat}`
}

function cleanupOldQRCaches() {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k?.startsWith('qr_ticket_')) keys.push(k)
  }
  keys.sort()
  for (let i = 0; i < keys.length - 5; i++) {
    localStorage.removeItem(keys[i])
  }
}

function readPassengerName(scheduleId?: string, seatNum?: number): string {
  if (!scheduleId || seatNum === undefined || !Number.isFinite(seatNum)) return ''
  try {
    return sessionStorage.getItem(`ticket_passenger_${scheduleId}_${seatNum}`) ?? ''
  } catch {
    return ''
  }
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z" />
    </svg>
  )
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

const shareApps = [
  { name: 'WhatsApp', bg: '#25D366', Icon: WhatsAppIcon, action: 'link' as const },
  { name: 'Telegram', bg: '#0088cc', Icon: TelegramIcon, action: 'link' as const },
  { name: 'Facebook', bg: '#1877F2', Icon: FacebookIcon, action: 'link' as const },
  { name: 'Instagram', bg: '#E4405F', Icon: InstagramIcon, action: 'clipboard' as const },
  { name: 'Copiar Texto', bg: '#6B7280', Icon: CopyIcon, action: 'clipboard' as const },
]

type ShareApp = (typeof shareApps)[number]

export default function TicketQrPage() {
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
    schedule !== undefined &&
    seatMap !== undefined &&
    seatNum <= seatMap.totalSeats &&
    !seatMap.occupied.includes(seatNum) &&
    !seatMap.reserved.includes(seatNum)

  const seatLabel = seatIsValid ? getSeatLabel(seatNum) : '—'
  const passengerName = readPassengerName(scheduleId, seatNum)

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const ticketRef = `CTP-${(scheduleId ?? '').toUpperCase()}-${seatLabel}`

  useEffect(() => {
    if (!seatIsValid || !scheduleId || !schedule) return

    let cancelled = false
    const cacheKey = getQrCacheKey(scheduleId, String(seatNum))

    let cached: string | null = null
    try {
      cached = localStorage.getItem(cacheKey)
    } catch {
      /* SecurityError or similar — treat as cache miss */
    }

    void Promise.resolve(cached)
      .then((cached) => {
        if (cancelled) return null
        if (cached) {
          setQrDataUrl(cached)
          return null
        }
        return generateTicketQR({
          scheduleId,
          operator: schedule.operatorName,
          origin: schedule.origin,
          destination: schedule.destination,
          date: schedule.departureDate,
          time: schedule.departureTime,
          seat: seatLabel,
          plate: schedule.busPlate,
        })
      })
      .then((url) => {
        if (cancelled || !url) return
        setQrDataUrl(url)
        try {
          localStorage.setItem(cacheKey, url)
          cleanupOldQRCaches()
        } catch (error) {
          const isQuotaError =
            error instanceof DOMException &&
            (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')
          if (!isQuotaError) return
          cleanupOldQRCaches()
          try {
            localStorage.setItem(cacheKey, url)
          } catch {
            return
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          gooeyToast.error('Erro ao gerar QR Code', {
            description: 'Não foi possível gerar o código do bilhete. Tente novamente.',
          })
        }
      })

    return () => {
      cancelled = true
      setQrDataUrl(null)
    }
  }, [seatIsValid, scheduleId, schedule, seatNum, seatLabel])

  useEffect(() => {
    if (!isShareOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsShareOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isShareOpen])

  const handleDownload = async () => {
    if (!qrDataUrl) return
    setIsDownloading(true)
    try {
      const link = document.createElement('a')
      link.href = qrDataUrl
      link.download = `bilhete-${scheduleId}-${seatLabel}.png`
      link.click()
      gooeyToast.success('Download concluido', { description: 'O bilhete foi guardado no seu dispositivo.' })
    } catch {
      gooeyToast.error('Erro ao baixar', { description: 'Tente novamente.' })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    if (!qrDataUrl) return
    setIsSharing(true)
    try {
      const res = await fetch(qrDataUrl)
      const blob = await res.blob()
      const file = new File([blob], `bilhete-${seatLabel}.png`, { type: 'image/png' })

      if (navigator.share) {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: `Bilhete ${schedule?.operatorName}`, text: shareText, files: [file] })
        } else {
          await navigator.share({ title: `Bilhete ${schedule?.operatorName}`, text: shareText })
        }
        gooeyToast.success('Partilhado', { description: 'O bilhete foi partilhado com sucesso.' })
      } else {
        setIsShareOpen(true)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return
      gooeyToast.error('Erro ao partilhar', { description: 'Tente novamente.' })
    } finally {
      setIsSharing(false)
    }
  }

  const copyQRToClipboard = async (): Promise<boolean> => {
    if (!qrDataUrl) return false
    try {
      const res = await fetch(qrDataUrl)
      const blob = await res.blob()
      const file = new File([blob], `bilhete-${seatLabel}.png`, { type: 'image/png' })
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': file }),
      ])
      return true
    } catch {
      return false
    }
  }

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
            <h1 className="text-lg font-bold text-gray-900">Bilhete não disponível</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="max-w-xs text-sm text-gray-500">
            Não foi possível carregar os dados deste bilhete. A viagem pode não existir ou o lugar já não é válido.
          </p>
          <button
            onClick={() => navigate('/tickets')}
            className="h-12 rounded-xl bg-[#1B7A3D] px-6 text-[16px] font-semibold text-white transition-colors hover:bg-[#15632F]"
          >
            Ver os meus bilhetes
          </button>
        </main>
      </div>
    )
  }

  const shareText = [
    `Bilhete C-Trip · ${ticketRef}`,
    `${schedule.route}`,
    `${schedule.departureDate} · ${schedule.departureTime} – ${schedule.arrivalTime}`,
    `Lugar: ${seatLabel}`,
    `Passageiro: ${passengerName || '—'}`,
    `Viatura: ${schedule.busPlate}`,
  ].join('\n')

  async function handleShareApp(app: ShareApp) {
    if (app.action === 'link') {
      const encodedText = encodeURIComponent(shareText)
      const encodedPageUrl = encodeURIComponent(window.location.href)
      const shareUrls: Record<string, string> = {
        WhatsApp: `https://wa.me/?text=${encodedText}`,
        Telegram: `https://t.me/share/url?url=${encodedPageUrl}&text=${encodedText}`,
        Facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedPageUrl}&quote=${encodedText}`,
      }

      const imageCopied = await copyQRToClipboard()
      const url = shareUrls[app.name]
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
      gooeyToast.success(`A abrir ${app.name}`, {
        description: imageCopied ? 'Imagem do QR copiada. Cole na conversa com Ctrl+V.' : 'Cole o texto na conversa.',
      })
    } else {
      const imageCopied = await copyQRToClipboard()
      if (!imageCopied) {
        await navigator.clipboard.writeText(shareText)
      }
      gooeyToast.success('Copiado', {
        description: imageCopied ? `Imagem do QR copiada. Abra o ${app.name} e cole na conversa.` : `Texto copiado. Abra o ${app.name} e cole na conversa.`,
      })
    }
    setIsShareOpen(false)
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
            <h1 className="text-lg font-bold">O seu bilhete</h1>
            <p className="text-xs text-gray-400">Apresente o QR Code no embarque</p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center gap-6 px-6 py-6 pb-[180px]">
        <div className="flex items-center justify-center gap-1 rounded-3xl bg-[#D1FAE5] px-3 py-1">
          <IconShieldCheckFilled className="h-2.5 w-3 text-[#10B981]" />
          <span className="text-[11px] font-semibold text-[#10B981]">Disponivel OFFLINE</span>
        </div>

        <section
          aria-label="Detalhes do bilhete"
          className="w-full max-w-[350px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex items-center justify-between bg-[#1B7A3D] px-4 py-4">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white">{schedule.operatorName}</span>
              <span className="text-xs text-white/80">
                {schedule.vehicleType} · {schedule.busModel}
              </span>
            </div>
            <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              Confirmed
            </span>
          </div>

          <div className="px-4 py-4">
            <p className="text-xl font-extrabold text-gray-900">
              {schedule.origin} → {schedule.destination}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {schedule.departureDate} · {schedule.departureTime} – {schedule.arrivalTime} · {schedule.duration}
            </p>

            <div className="mt-4 flex flex-col items-center gap-2 rounded-xl bg-gray-50 p-4">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code do bilhete ${ticketRef}, lugar ${seatLabel}`}
                  className="h-48 w-48"
                />
              ) : (
                <div className="h-48 w-48 animate-pulse rounded-lg bg-gray-200" aria-hidden="true" />
              )}
              <p className="text-[11px] text-gray-400">Lugar {seatLabel} · Valide no embarque</p>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-left">
              <div className="flex flex-col">
                <dt className="text-[11px] uppercase tracking-wide text-gray-400">Passageiro</dt>
                <dd className="truncate text-sm font-semibold text-gray-800">{passengerName || '—'}</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-[11px] uppercase tracking-wide text-gray-400">Lugar</dt>
                <dd className="text-sm font-semibold text-gray-800">{seatLabel}</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-[11px] uppercase tracking-wide text-gray-400">Referência</dt>
                <dd className="truncate text-sm font-semibold text-gray-800">{ticketRef}</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-[11px] uppercase tracking-wide text-gray-400">Viatura</dt>
                <dd className="text-sm font-semibold text-gray-800">{schedule.busPlate}</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-dashed border-gray-200 px-4 py-3">
            <p className="text-center text-[11px] text-gray-400">
              Chegue {schedule.boardingCutoffMinutes} minutos antes da partida
            </p>
          </div>
        </section>

        <footer className="fixed bottom-0 inset-x-0 z-10 flex flex-col items-center gap-4 border-t-2
         border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => void handleShare()}
              disabled={!qrDataUrl || isSharing || isDownloading}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2
              border-[#1B7A3D] text-[#1B7A3D] transition-colors hover:bg-[#1B7A3D]/5 disabled:opacity-50"
            >
              {isSharing ? <IconLoader2 className="h-5 w-5 animate-spin" /> : <IconShare2 className="h-5 w-5" />}
              <p className="text-sm font-semibold">{isSharing ? 'A partilhar...' : 'Partilhar'}</p>
            </button>
            <button
              onClick={() => void handleDownload()}
              disabled={!qrDataUrl || isDownloading || isSharing}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#1B7A3D]
               text-[#1B7A3D] transition-colors hover:bg-[#1B7A3D]/5 disabled:opacity-50"
            >
              {isDownloading ? <IconLoader2 className="h-5 w-5 animate-spin" /> : <IconDownload className="h-5 w-5" />}
              <p className="text-sm font-semibold">{isDownloading ? 'A baixar...' : 'Baixar'}</p>
            </button>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="h-12 w-full rounded-xl bg-[#1B7A3D] text-[16px] font-semibold text-white transition-colors hover:bg-[#15632F]"
          >
            Voltar ao Inicio
          </button>
        </footer>
      </main>

      {isShareOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-6 sm:items-center sm:pb-0"
          onClick={() => setIsShareOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
            className="w-full max-w-[350px] rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="share-modal-title" className="text-base font-bold text-gray-900">
                Partilhar bilhete
              </h2>
              <button
                ref={closeButtonRef}
                onClick={() => setIsShareOpen(false)}
                aria-label="Fechar"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
              >
                <IconX className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <ul className="grid grid-cols-3 gap-4">
              {shareApps.map((app) => (
                <li key={app.name}>
                  <button
                    type="button"
                    onClick={() => void handleShareApp(app)}
                    className="flex w-full flex-col items-center gap-2 rounded-xl px-1 py-2 transition-colors hover:bg-gray-50"
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-full"
                      style={{ backgroundColor: app.bg }}
                    >
                      <app.Icon className="h-6 w-6 text-white" />
                    </span>
                    <span className="text-center text-[11px] font-medium text-gray-600">{app.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
