import { useState } from 'react'
import { useNavigate } from 'react-router'
import { IconArrowLeft, IconSearch, IconX, IconPrinter, IconUser, IconCheck } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { getOperatorTodaySchedules } from '@/data/mockOperatorSchedules'
import type { OperatorSchedule } from '@/data/mockOperatorSchedules'
import { Card, CardContent } from '@/components/ui/card'

interface ReprintPassenger {
  bookingId: string
  seat: number
  name: string
  printed: boolean
}

function getMockReprintPassengers(scheduleId: string): ReprintPassenger[] {
  const seeds: Record<string, ReprintPassenger[]> = {
    'macon-1': [
      { bookingId: 'bk-r01', seat: 1, name: 'Ana Silva', printed: false },
      { bookingId: 'bk-r02', seat: 3, name: 'Carlos Mendes', printed: false },
      { bookingId: 'bk-r03', seat: 5, name: 'Maria Fernandes', printed: true },
      { bookingId: 'bk-r04', seat: 8, name: 'Pedro Almeida', printed: false },
    ],
    'macon-2': [
      { bookingId: 'bk-r05', seat: 2, name: 'Lucia Torres', printed: false },
      { bookingId: 'bk-r06', seat: 7, name: 'Ricardo Neto', printed: true },
    ],
  }
  return seeds[scheduleId] ?? []
}

export default function OperatorReprint() {
  const navigate = useNavigate()
  const schedules = getOperatorTodaySchedules().filter((s) => s.status !== 'departed')
  const [selectedSchedule, setSelectedSchedule] = useState<OperatorSchedule | null>(null)
  const [search, setSearch] = useState('')
  const [reprintedIds, setReprintedIds] = useState<Set<string>>(new Set())
  const [reprintingIds, setReprintingIds] = useState<Set<string>>(() => new Set())

  const passengers = selectedSchedule ? getMockReprintPassengers(selectedSchedule.id) : []
  const query = search.toLowerCase()
  const filtered = passengers.filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query) ||
      String(p.seat).includes(query),
  )

  const handleReprint = async (passenger: ReprintPassenger) => {
    if (reprintingIds.has(passenger.bookingId)) return
    setReprintingIds((prev) => new Set(prev).add(passenger.bookingId))
    try {
      // Mock — substituir por POST /boarding/qr/reprint
      await new Promise((r) => setTimeout(r, 800))

      setReprintedIds((prev) => new Set(prev).add(passenger.bookingId))
      gooeyToast.success('Bilhete reimpresso', {
        description: `${passenger.name} — Lugar ${passenger.seat}`,
      })
    } catch {
      gooeyToast.error('Erro ao reimprimir', {
        description: 'Tente novamente.',
      })
    } finally {
      setReprintingIds((prev) => {
        const next = new Set(prev)
        next.delete(passenger.bookingId)
        return next
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
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
          <label className="block text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">Selecionar viagem</label>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {schedules.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setSelectedSchedule(s); setSearch('') }}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedSchedule?.id === s.id
                    ? 'bg-[#1B7A3D] text-white border-[#1B7A3D]'
                    : 'bg-white text-[#111827] border-gray-200 hover:border-[#1B7A3D]'
                }`}
              >
                {s.route} · {s.departureTime}
              </button>
            ))}
          </div>
        </section>

        {selectedSchedule && (
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

            {filtered.length > 0 ? (
              <div className="flex flex-col gap-2">
                {filtered.map((passenger) => {
                  const isReprinted = passenger.printed || reprintedIds.has(passenger.bookingId)
                  return (
                    <Card key={passenger.bookingId} className="p-0 border-[#E5E7EB]">
                      <CardContent className="p-3 flex items-center gap-3">
                        <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ${
                          isReprinted ? 'bg-[#D1FAE5]' : 'bg-gray-100'
                        }`}>
                          <IconUser className={`size-4 ${isReprinted ? 'text-[#047857]' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#111827] truncate">{passenger.name}</p>
                          <p className="text-[11px] text-gray-500">Lugar {passenger.seat}</p>
                        </div>
                        {isReprinted ? (
                          <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-[#047857]">
                            <IconCheck className="size-4" />
                            Reimpresso
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled={reprintingIds.has(passenger.bookingId)}
                            onClick={() => handleReprint(passenger)}
                            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#1B7A3D] text-white text-xs font-semibold rounded-lg hover:bg-[#15632F] transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <IconPrinter className="size-3.5" />
                            {reprintingIds.has(passenger.bookingId) ? 'A imprimir…' : 'Imprimir'}
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">
                Nenhum passageiro encontrado
              </div>
            )}
          </>
        )}

        {!selectedSchedule && (
          <div className="text-center py-16 text-gray-400 text-sm">
            Selecione uma viagem para ver os passageiros
          </div>
        )}
      </main>
    </div>
  )
}
