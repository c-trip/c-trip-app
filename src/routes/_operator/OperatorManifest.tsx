import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router'
import { IconArrowLeft, IconUser, IconSearch, IconX, IconCircleCheck, IconCircleX, IconClock } from '@tabler/icons-react'
import { findScheduleById } from '@/data/mockOperatorSchedules'
import { Card, CardContent } from '@/components/ui/card'

interface ManifestPassenger {
  bookingId: string
  seat: number
  name: string
  phone?: string
  idDoc?: string
  status: 'confirmed' | 'cancelled' | 'boarded'
}

function getMockPassengers(): ManifestPassenger[] {
  return [
    { bookingId: 'bk-001', seat: 1, name: 'Ana Silva', phone: '+244 923 456 789', idDoc: '123456789LA045', status: 'boarded' },
    { bookingId: 'bk-002', seat: 2, name: 'Carlos Mendes', phone: '+244 912 345 678', idDoc: '987654321LA012', status: 'confirmed' },
    { bookingId: 'bk-003', seat: 5, name: 'Maria Fernandes', phone: '+244 934 567 890', status: 'confirmed' },
    { bookingId: 'bk-004', seat: 8, name: 'João Santos', phone: '+244 945 678 901', idDoc: '456789123LA078', status: 'cancelled' },
    { bookingId: 'bk-005', seat: 10, name: 'Pedro Almeida', phone: '+244 956 789 012', status: 'confirmed' },
    { bookingId: 'bk-006', seat: 12, name: 'Lucia Torres', phone: '+244 967 890 123', idDoc: '321654987LA034', status: 'boarded' },
    { bookingId: 'bk-007', seat: 15, name: 'Ricardo Neto', phone: '+244 978 901 234', status: 'confirmed' },
  ]
}


export default function OperatorManifest() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const scheduleId = searchParams.get('schedule')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'boarded' | 'missing'>('all')

  const schedule = scheduleId ? findScheduleById(scheduleId) : undefined

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gray-50 font-outfit flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-4">Nenhuma viagem selecionada</p>
          <button
            type="button"
            onClick={() => navigate('/operator')}
            className="text-[#1B7A3D] font-semibold text-sm"
          >
            Voltar ao painel
          </button>
        </div>
      </div>
    )
  }

  const passengers = getMockPassengers()
  const boarded = passengers.filter((p) => p.status === 'boarded')
  const confirmed = passengers.filter((p) => p.status === 'confirmed')
  const boardingPercent = Math.round((boarded.length / schedule.totalSeats) * 100)
  const missing = confirmed.length

  const query = search.toLowerCase()
  const allPassengers = passengers.filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query) ||
      String(p.seat).includes(query),
  )

  const tabFiltered = allPassengers.filter((p) => {
    if (activeTab === 'boarded') return p.status === 'boarded'
    if (activeTab === 'missing') return p.status === 'confirmed'
    return true
  })

  const tabFilteredBoarded = tabFiltered.filter((p) => p.status === 'boarded')
  const tabFilteredConfirmed = tabFiltered.filter((p) => p.status === 'confirmed')
  const tabFilteredCancelled = tabFiltered.filter((p) => p.status === 'cancelled')

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <header className="sticky top-0 z-40 bg-gray-50 pt-3 border-b border-gray-200">
        <div className="flex flex-col px-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/operator')}
              aria-label="Voltar ao painel"
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <IconArrowLeft className="size-5 text-gray-600" />
            </button>
            <h1 className="text-[22px] font-bold text-[#111827]">Manifesto de Embarque</h1>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#4B5563] px-8 pb-3">
            <span>{schedule.route}</span>
            <span className="text-gray-400">·</span>
            <span>{schedule.departureTime}</span>
            <span className="text-gray-400">·</span>
            <span>{schedule.operatorName}</span>
          </div>
        </div>
        <section className="px-6 border-t flex items-center gap-3 h-[88px] border-gray-200">
          <div className="bg-[#1B7A3D]/10 w-12 h-12 flex items-center justify-center rounded-full shrink-0">
            <span className="text-[#1B7A3D] font-extrabold text-sm font-inter">{boardingPercent}%</span>
          </div>
          <div>
            <p className="text-base font-bold text-[#111827]">
              {boarded.length} de {schedule.totalSeats} Embarcados
            </p>
            <span className="text-[#4B5563] text-xs">
              {missing > 0 ? `${missing} passageiros em falta` : 'Todos embarcados'}
            </span>
          </div>
        </section>
      </header>

      <main className="px-5 py-5">
        <nav className="flex gap-2 mb-4" aria-label="Filtro de passageiros">
          {([
            { key: 'all', label: 'Todos', count: passengers.length },
            { key: 'boarded', label: 'Embarcados', count: boarded.length },
            { key: 'missing', label: 'Em falta', count: missing },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-[20px] text-xs font-semibold transition-all border ${
                activeTab === tab.key
                  ? 'bg-[#1B7A3D] text-white border-[#1B7A3D]'
                  : 'bg-white text-[#111827] border-gray-200'
              }`}
              aria-pressed={activeTab === tab.key}
            >
              {tab.label}{' '}
              <span className={`ml-0.5 ${activeTab === tab.key ? 'text-white' : 'text-gray-500'}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </nav>

        <div className="relative mb-4">
          <IconSearch className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar o passageiro por nome"
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


        {tabFilteredBoarded.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
              Embarcados ({tabFilteredBoarded.length})
            </h2>
            <div className="flex flex-col gap-2 mb-5">
              {tabFilteredBoarded.map((passenger) => (
                <Card key={passenger.bookingId} className="p-0 border-[#E5E7EB]">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-[#D1FAE5] flex items-center justify-center shrink-0">
                      <IconUser className="size-4 text-[#047857]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111827] truncate">{passenger.name}</p>
                      <p className="text-[11px] text-gray-500">
                        Lugar {passenger.seat}
                        {passenger.phone && <span className="ml-2 text-gray-400">· {passenger.phone}</span>}
                      </p>
                    </div>
                    <span className="shrink-0 size-8 rounded-full bg-[#D1FAE5] flex items-center justify-center text-[#047857]">
                      <IconCircleCheck className="size-5" />
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {tabFilteredConfirmed.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
              Confirmados ({tabFilteredConfirmed.length})
            </h2>
            <div className="flex flex-col gap-2 mb-5">
              {tabFilteredConfirmed.map((passenger) => (
                <Card key={passenger.bookingId} className="p-0 border-[#E5E7EB]">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
                      <IconUser className="size-4 text-[#1D4ED8]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111827] truncate">{passenger.name}</p>
                      <p className="text-[11px] text-gray-500">
                        Lugar {passenger.seat}
                        {passenger.phone && <span className="ml-2 text-gray-400">· {passenger.phone}</span>}
                      </p>
                    </div>
                    <span className="shrink-0 size-8 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#1D4ED8]">
                      <IconClock className="size-5" />
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {tabFilteredCancelled.length > 0 && (
          <section>
            <h2 className="text-xs font-bold text-[#6B7280] uppercase tracking-wide mb-2">
              Cancelados ({tabFilteredCancelled.length})
            </h2>
            <div className="flex flex-col gap-2">
              {tabFilteredCancelled.map((passenger) => (
                <Card key={passenger.bookingId} className="p-0 border-[#E5E7EB] opacity-60">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                      <IconUser className="size-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-500 truncate">{passenger.name}</p>
                      <p className="text-[11px] text-gray-400">Lugar {passenger.seat}</p>
                    </div>
                    <span className="shrink-0 text-[#6B7280]">
                      <IconCircleX className="size-5" />
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {tabFiltered.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            Nenhum passageiro encontrado
          </div>
        )}
      </main>
    </div>
  )
}
