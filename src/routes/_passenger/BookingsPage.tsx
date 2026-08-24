import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { IconBus, IconTicket , IconClock, IconChevronRight } from '@tabler/icons-react'
import { getBookings } from '@/lib/bookings'
import { getScheduleById } from '@/data/mockSeats'
import { Card, CardContent } from '@/components/ui/card'
import type { BookingStatus } from '@/types'

const TABS = [
  { value: 'ativas', label: 'Activas/Futuras' },
  { value: 'historico', label: 'Histórico' },
] as const

type TabValue = (typeof TABS)[number]['value']

function formatDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${d} ${months[parseInt(m, 10) - 1]} ${y}`
}

const STATUS_STYLE: Record<BookingStatus, { bg: string; text: string; label: string }> = {
  confirmada: { bg: 'bg-[#1B7A3D]/10', text: 'text-[#1B7A3D]', label: 'Confirmada' },
  pendente: { bg: 'bg-[#F59E0B]/10', text: 'text-[#F59E0B]', label: 'Pendente' },
  cancelada: { bg: 'bg-red-100', text: 'text-red-600', label: 'Cancelada' },
  concluida: { bg: 'bg-blue-100', text: 'text-blue-600', label: 'Concluída' },
}

export default function BookingsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabValue>('ativas')

  const bookings = useMemo(() => getBookings(), [])

  const filtered = useMemo(() => {
    if (activeTab === 'ativas') {
      return bookings.filter((b) => b.status === 'confirmada' || b.status === 'pendente')
    }
    return bookings.filter((b) => b.status !== 'confirmada' && b.status !== 'pendente')
  }, [bookings, activeTab])

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 pt-4 pb-0">
        <div className="flex items-center gap-3 mb-4">
          
          <h1 className="text-[22px] font-extrabold text-[#111827]"> Minhas Viagens</h1>
        </div>

        <div className="flex gap-6 px-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                aria-pressed={isActive}
                className={`relative pb-3 text-sm font-semibold font-outfit transition-colors ${
                  isActive ? 'text-[#1B7A3D]' : 'text-gray-400'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#1B7A3D]" />
                )}
              </button>
            )
          })}
        </div>
      </header>

      <main className="px-5 py-10">
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filtered.map((booking) => {
              const schedule = getScheduleById(booking.scheduleId)
              const style = STATUS_STYLE[booking.status]
              return (
                <Card
                  key={booking.id}
                  className="p-0 cursor-pointer hover:scale-[1.01] border-[#E5E7EB]  
                  active:scale-[0.99] transition-transform"
                  onClick={() => navigate(`/bookings/${booking.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-bold text-[#111827]">
                        {schedule?.route ?? 'Rota'}
                      </span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>

            
                    <div className="flex items-start gap-1">
                     <IconBus className='size-4 text-[#4B5563]' />
                    <p className="text-xs font-normal text-[#4B5563] mb-2">
                      {schedule?.operatorName ?? 'Operador indisponível'}
                    </p>
                    </div>


                    <div className="flex items-center gap-1 mb-4">
                     
                        <IconClock className='size-4 text-[#4B5563]'/>
                        <div className="text-[10px] text-[#4B5563] flex gap-1 ">
                          <p>
                            {schedule ? formatDate(schedule.departureDate) : '--'}
                            </p>
                           <p>Às</p>
                           <p>

                          {schedule?.departureTime ?? '--:--'}
                           </p>
                        </div>
                     

                    </div>
                  <div className='flex justify-between items-center py-2 gap-4 border-t-2 border-[#E5E7EB]'>
                    <p className='text-xs text-[#1B7A3D] font-semibold'>Ver detalhes do bilhete</p>
                    <IconChevronRight className='size-4 text-[#1B7A3D] font-bold'/>
                  </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <IconTicket className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Nenhuma reserva encontrada</h2>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === 'ativas'
                ? 'Ainda não tem reservas activas/futuras.'
                : 'Nenhuma reserva no histórico.'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
