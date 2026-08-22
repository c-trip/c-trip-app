import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import { IconShieldCheckFilled, IconShare2, IconDownload, IconLoader2 } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { getScheduleById } from '@/data/mockSeats'
import { generateTicketQR } from '@/lib/qr'

function getSeatLabel(seatNum: number): string {
  const row = Math.ceil(seatNum / 4)
  const col = String.fromCharCode(65 + ((seatNum - 1) % 4))
  return `${row}${col}`
}

export default function TicketQrPage() {
  const { scheduleId } = useParams<{ scheduleId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const seatParam = searchParams.get('seat')
  const seatNum = /^\d+$/.test(seatParam ?? '') ? parseInt(seatParam!, 10) : NaN
  const seatLabel = Number.isFinite(seatNum) ? getSeatLabel(seatNum) : '\u2014'
  const passengerName = searchParams.get('nome') || '—'
  const schedule = getScheduleById(scheduleId)

  const [qrDataUrl, setQrDataUrl] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (!schedule) return
    generateTicketQR({
      scheduleId: schedule.id,
      operator: schedule.operatorName,
      origin: schedule.origin,
      destination: schedule.destination,
      date: schedule.departureDate,
      time: schedule.departureTime,
      seat: seatLabel,
      plate: schedule.busPlate,
    }).then(setQrDataUrl).catch(console.error)
  }, [schedule, seatLabel])

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
      const text = `Bilhete ${schedule?.operatorName} - ${schedule?.origin} → ${schedule?.destination} | Lugar ${seatLabel} | Data: ${schedule?.departureDate} | Hora: ${schedule?.departureTime}`
      const res = await fetch(qrDataUrl)
      const blob = await res.blob()
      const file = new File([blob], `bilhete-${seatLabel}.png`, { type: 'image/png' })

      if (navigator.share) {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: `Bilhete ${schedule?.operatorName}`, text, files: [file] })
        } else {
          await navigator.share({ title: `Bilhete ${schedule?.operatorName}`, text })
        }
      } else {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n\nQR Code: ' + qrDataUrl)}`
        window.open(whatsappUrl, '_blank')
      }
      gooeyToast.success('Partilhado', { description: 'O bilhete foi partilhado com sucesso.' })
    } catch {
      gooeyToast.error('Erro ao partilhar', { description: 'Tente novamente.' })
    } finally {
      setIsSharing(false)
    }
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
    </div>
  )
}
