import { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router'
import QRCode from 'qrcode'
import { IconShieldCheckFilled } from '@tabler/icons-react'
import { getScheduleById } from '@/data/mockSeats'

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
  const seatLabel = Number.isFinite(seatNum) ? getSeatLabel(seatNum) : '—'
  const schedule = getScheduleById(scheduleId)

  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    if (!schedule) return
    const payload = JSON.stringify({
      scheduleId: schedule.id,
      operator: schedule.operatorName,
      origin: schedule.origin,
      destination: schedule.destination,
      date: schedule.departureDate,
      time: schedule.departureTime,
      seat: seatLabel,
      plate: schedule.busPlate,
    })
    QRCode.toDataURL(payload, { width: 200, margin: 2, errorCorrectionLevel: 'M' })
      .then(setQrDataUrl)
      .catch(console.error)
  }, [schedule, seatLabel])

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
        <header className="border-b border-gray-200 bg-white px-4 py-4">
          <h1 className="text-lg font-bold  text-gray-900">Bilhete confirmado</h1>
        </header>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-lg font-bold  text-gray-900">Bilhete confirmado</h1>
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

          <div className="flex justify-center py-6">
            {qrDataUrl ? (
              <img src={qrDataUrl} alt="Código QR do bilhete" className="h-[180px] w-[180px]" />
            ) : (
              <div className="h-[180px] w-[180px] bg-gray-100 rounded-lg animate-pulse" />
            )}
          </div>

          <div className="mx-6 border-t border-dashed border-gray-300" />

          <div className="px-6 py-2">
            <p className="text-xs text-gray-400 mb-1">Passageiro</p>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold text-gray-900">{schedule.driverName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">N.º do Lugar</p>
                <p className="text-sm font-bold text-gray-900">{seatLabel}</p>
              </div>
            </div>

            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400">Data da Viagem</p>
                <p className="text-sm font-bold text-gray-900">{schedule.departureDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Hora de Partida</p>
                <p className="text-sm font-bold text-gray-900">{schedule.departureTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="sticky bottom-0 flex justify-center border-t-2 border-[#E5E7EB] bg-white p-6">
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
