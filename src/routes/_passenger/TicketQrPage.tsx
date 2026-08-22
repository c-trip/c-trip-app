import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import { IconShieldCheckFilled, IconShare2, IconDownload, IconLoader2, IconX } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { getScheduleById } from '@/data/mockSeats'
import { generateTicketQR } from '@/lib/qr'

function getSeatLabel(seatNum: number): string {
  const row = Math.ceil(seatNum / 4)
  const col = String.fromCharCode(65 + ((seatNum - 1) % 4))
  return `${row}${col}`
}

function getQrCacheKey(scheduleId: string, seat: string): string {
  return `qr_ticket_${scheduleId}_${seat}`
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012.056 0h-.112zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z"/>
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
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

export default function TicketQrPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const seatParam = searchParams.get('seat')
  const seatNum = /^\d+$/.test(seatParam ?? '') ? parseInt(seatParam!, 10) : NaN
  const seatLabel = Number.isFinite(seatNum) ? getSeatLabel(seatNum) : '\u2014'
  const passengerName = searchParams.get('nome') || '\u2014'
  const schedule = getScheduleById(scheduleId)

  const [qrDataUrl, setQrDataUrl] = useState(() => {
    if (!schedule || !Number.isFinite(seatNum)) return ''
    const cacheKey = getQrCacheKey(schedule.id, seatLabel)
    return localStorage.getItem(cacheKey) || ''
  })
  const [isSharing, setIsSharing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const shareText = `Bilhete ${schedule?.operatorName} - ${schedule?.origin} \u2192 ${schedule?.destination}\nPassageiro: ${passengerName}\nLugar: ${seatLabel}\nData: ${schedule?.departureDate}\nHora: ${schedule?.departureTime}`

  useEffect(() => {
    if (!schedule || !Number.isFinite(seatNum) || qrDataUrl) return
    const cacheKey = getQrCacheKey(schedule.id, seatLabel)
    generateTicketQR({
      scheduleId: schedule.id,
      operator: schedule.operatorName,
      origin: schedule.origin,
      destination: schedule.destination,
      date: schedule.departureDate,
      time: schedule.departureTime,
      seat: seatLabel,
      plate: schedule.busPlate,
    }).then((url) => {
      localStorage.setItem(cacheKey, url)
      setQrDataUrl(url)
    }).catch(console.error)
  }, [schedule, seatLabel, seatNum, qrDataUrl])

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
        setShowShareModal(true)
      }
    } catch {
      gooeyToast.error('Erro ao partilhar', { description: 'Tente novamente.' })
    } finally {
      setIsSharing(false)
    }
  }

  const copyQRToClipboard = async () => {
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

  const handleShareApp = async (app: typeof shareApps[number]) => {
    const urls: Record<string, string> = {
      WhatsApp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      Telegram: `https://t.me/share/url?url=&text=${encodeURIComponent(shareText)}`,
      Facebook: `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(shareText)}`,
    }

    const imageCopied = await copyQRToClipboard()

    if (app.action === 'clipboard' || !urls[app.name]) {
      if (!imageCopied) await navigator.clipboard.writeText(shareText)
      gooeyToast.success('Copiado', { description: imageCopied ? `Imagem do QR copiada. Abre o ${app.name} e cola na conversa.` : `Texto copiado. Abre o ${app.name} e cola na conversa.` })
    } else {
      window.open(urls[app.name], '_blank')
      gooeyToast.success(`A abrir ${app.name}`, { description: imageCopied ? 'Imagem do QR copiada. Cole na conversa com Ctrl+V.' : 'Cole o texto na conversa.' })
    }
    setShowShareModal(false)
  }

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
        <header className="border-b border-gray-200 bg-white px-6 py-4">
          <h1 className="text-lg font-bold text-center text-gray-900">Bilhete confirmado</h1>
        </header>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-bold text-gray-900">Bilhete confirmado</h1>
      </header>

      <div className="flex flex-col items-center gap-4 px-6 py-6 flex-1">
        <div className="flex items-center justify-center rounded-3xl gap-1 py-1 px-3 bg-[#D1FAE5] w-[158px]">
          <IconShieldCheckFilled className="w-2.5 h-3 text-[#10B981]" />
          <span className="text-[11px] text-[#10B981] font-semibold">Disponivel OFFLINE</span>
        </div>

        <div className="w-full max-w-[350px] rounded-2xl border mt-5 border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-[#1B7A3D1A] px-6 py-5">
            <h2 className="text-lg font-bold text-gray-900">{schedule.operatorName} Transportes</h2>
            <p className="text-sm text-gray-500">{schedule.origin} → {schedule.destination}</p>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Código QR do bilhete" className="h-[180px] w-[180px]" />
            ) : (
              <div className="h-[180px] w-[180px] bg-gray-100 rounded-lg animate-pulse" />
            )}
            <p className="text-[8px] w-[120px] text-center">
              COMFIRMED TRAVEL TICKET REF: CTP-004829-AO
            </p>
            <p className="text-[#4B5563] text-[12px] mt-2">
              REF: CTP-004829-AO
            </p>
          </div>

          <div className="border-t border-dashed border-gray-300" />
          <div className="flex flex-col gap-2 mx-6 py-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <p className="text-[11px] text-[#4B5563] font-normal">Passageiro</p>
                <p className="text-[13px] text-[#111827] font-semibold">{passengerName}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#4B5563] font-normal">N do lugar</p>
                <p className="text-[13px] text-[#1B7A3D] font-semibold">{seatLabel}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <p className="text-[11px] text-[#4B5563] font-normal">Data da Viagem</p>
                <p className="text-[13px] text-[#111827] font-semibold">{schedule.departureDate}</p>
              </div>
              <div>
                <p className="text-[11px] text-[#4B5563] font-normal">Hora de partida</p>
                <p className="text-[13px] text-[#111827] font-semibold">{schedule.departureTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="sticky bottom-0 gap-4 flex-col items-center flex justify-center border-t-2
       border-[#E5E7EB] bg-white p-6">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handleShare}
            disabled={isSharing || isDownloading}
            className="text-[#1B7A3D] border-[#1B7A3D] rounded-xl border-2 h-11 w-[170px]
            flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSharing ? <IconLoader2 className="w-5 h-5 animate-spin" /> : <IconShare2 />}
            <p>{isSharing ? 'A partilhar...' : 'Partilhar'}</p>
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading || isSharing}
            className="text-[#1B7A3D] border-[#1B7A3D] rounded-xl border-2 h-11 w-[170px]
            flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isDownloading ? <IconLoader2 className="w-5 h-5 animate-spin" /> : <IconDownload />}
            <p>{isDownloading ? 'A baixar...' : 'Baixar'}</p>
          </button>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="w-full max-w-[350px] rounded-xl h-12 font-semibold text-[16px] text-white
           bg-[#1B7A3D] hover:bg-[#15632F] transition-colors"
        >
          Voltar ao Inicio
        </button>
      </footer>

      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div className="w-full max-w-[400px] bg-white rounded-t-2xl p-6 pb-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Partilhar bilhete</h3>
              <button onClick={() => setShowShareModal(false)} className="p-1">
                <IconX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {shareApps.map((app) => (
                <button
                  key={app.name}
                  onClick={() => handleShareApp(app)}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: app.bg }}
                  >
                    <app.Icon />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
