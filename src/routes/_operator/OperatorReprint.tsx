import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { IconArrowLeft, IconSearch, IconX, IconPrinter, IconUser, IconRefresh } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { useOperatorSchedules } from '@/hooks/operator/useOperatorSchedules'
import { useManifest } from '@/hooks/operator/useManifest'
import { useReprintQr } from '@/hooks/operator/useReprintQr'
import type { OperatorSchedule, ReprintQrResponse } from '@/types/operator'
import { Card, CardContent } from '@/components/ui/card'
import RouteDisplay from '@/components/RouteDisplay'

export default function OperatorReprint() {
  const navigate = useNavigate()
  const { schedules } = useOperatorSchedules()
  const [selected, setSelected] = useState<OperatorSchedule | null>(null)
  const [search, setSearch] = useState('')
  const [lastResult, setLastResult] = useState<ReprintQrResponse | null>(null)

  const { manifest, isLoading, error, refetch } = useManifest(selected?.schedule_id)
  const { reprint, isLoading: reprinting } = useReprintQr()
  const [reprintingSeat, setReprintingSeat] = useState<number | null>(null)

  const seats = useMemo(
    () => manifest.filter((m) => m.status === 'confirmed' || m.status === 'boarded' || m.status === 'pending'),
    [manifest],
  )
  const query = search.trim().toLowerCase()
  const filtered = query
    ? seats.filter(
        (s) => String(s.seat).includes(query) || (s.passenger ?? '').toLowerCase().includes(query),
      )
    : seats

  const handleReprint = async (seatNumber: number) => {
    if (!selected || reprinting) return
    setReprintingSeat(seatNumber)
    const result = await reprint({ schedule_id: selected.schedule_id, seat_number: seatNumber })
    setReprintingSeat(null)
    if (result) {
      setLastResult(result)
      gooeyToast.success('Bilhete reimpresso', {
        description: `${result.passenger_name} — Lugar ${result.seat_number}`,
      })
    } else {
      gooeyToast.error('Erro ao reimprimir', { description: 'Tente novamente.' })
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <header className="sticky top-0 z-50 bg-gray-50 px-5 pt-3 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/operator')}
            aria-label="Voltar ao painel"
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <IconArrowLeft className="size-5 text-gray-600" />
          </button>
          <h1 className="text-[22px] font-bold text-[#111827] text-center flex-1">Reimprimir Bilhete</h1>
        </div>
      </header>

      <main className="px-5 py-5 pb-28">
        <section className="mb-5">
          <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
            Selecionar viagem
          </label>
          {schedules.length === 0 ? (
            <p className="text-sm text-gray-400">Não há viagens disponíveis.</p>
          ) : (
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
              {schedules.map((s) => (
                <button
                  key={s.schedule_id}
                  type="button"
                  onClick={() => {
                    setSelected(s)
                    setSearch('')
                    setLastResult(null)
                  }}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selected?.schedule_id === s.schedule_id
                      ? 'bg-[#1B7A3D] text-white border-[#1B7A3D]'
                      : 'bg-white text-[#111827] border-gray-200 hover:border-[#1B7A3D]'
                  }`}
                >
                  <RouteDisplay origin={s.origin} destination={s.destination} /> · {s.departure_time}
                </button>
              ))}
            </div>
          )}
        </section>

        {lastResult && (
          <Card className="mb-5 border-[#1B7A3D]/30 bg-[#1B7A3D]/5">
            <CardContent className="p-4 flex items-center gap-4">
              {lastResult.qr_image && (
                <img
                  src={lastResult.qr_image}
                  alt="QR code do bilhete"
                  className="size-24 rounded-lg bg-white p-1"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#111827] truncate">{lastResult.passenger_name}</p>
                <p className="text-xs text-[#4B5563]">Lugar {lastResult.seat_number}</p>
                <p className="mt-1 text-[11px] text-gray-400 break-all">{lastResult.qr_hash}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {selected && (
          <>
            <div className="relative mb-4">
              <IconSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                aria-label="Buscar por nome ou lugar"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome ou lugar"
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-outfit placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B7A3D]/30 focus:border-[#1B7A3D]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Limpar pesquisa"
                >
                  <IconX className="size-4" />
                </button>
              )}
            </div>

            {isLoading && (
              <div className="flex flex-col gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
                ))}
              </div>
            )}

            {!isLoading && error && (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <p className="text-sm text-[#4B5563]">{error}</p>
                <button
                  type="button"
                  onClick={() => void refetch()}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#1B7A3D]"
                >
                  <IconRefresh className="size-4" />
                  Tentar novamente
                </button>
              </div>
            )}

            {!isLoading && !error && filtered.length > 0 && (
              <div className="flex flex-col gap-2">
                {filtered.map((item) => (
                  <Card key={item.booking_id} className="p-0 border-[#E5E7EB]">
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        <IconUser className="size-4 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827] truncate">
                          {item.passenger?.trim() || `Lugar ${item.seat}`}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          Lugar {item.seat} · <span className="capitalize">{item.status}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={reprinting}
                        onClick={() => handleReprint(item.seat)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#1B7A3D] text-white text-xs font-semibold rounded-lg hover:bg-[#15632F] transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <IconPrinter className="size-3.5" />
                        {reprintingSeat === item.seat ? 'A imprimir…' : 'Imprimir'}
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && !error && filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400 text-sm">Nenhum lugar confirmado encontrado</div>
            )}
          </>
        )}

        {!selected && schedules.length > 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            Selecione uma viagem para ver os lugares
          </div>
        )}
      </main>
    </div>
  )
}
