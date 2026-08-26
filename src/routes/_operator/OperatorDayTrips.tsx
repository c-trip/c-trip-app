import { useNavigate } from 'react-router'
import { IconMapPin, IconClock, IconChevronRight } from '@tabler/icons-react'
import { getOperatorTodaySchedules } from '@/data/mockOperatorSchedules'
import type { OperatorSchedule } from '@/data/mockOperatorSchedules'
import { Card, CardContent } from '@/components/ui/card'

function formatDate(): string {
  const now = new Date()
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `hoje, ${now.getDate()} ${months[now.getMonth()]}`
}

const STATUS_STYLE: Record<OperatorSchedule['status'], { bg: string; text: string; label: string }> = {
  scheduled: { bg: 'bg-[#EFF6FF]', text: 'text-[#3B82F6]', label: 'A iniciar' },
  boarding: { bg: 'bg-[#D1FAE5]', text: 'text-[#10B981]', label: 'Embarque' },
  departed: { bg: 'bg-[#F3F4F6]', text: 'text-[#6B7280]', label: 'Partiu' },
}

export default function OperatorDayTrips() {
  const navigate = useNavigate()
  const schedules = getOperatorTodaySchedules()

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <header
        className="px-5 pt-10 flex flex-col gap-2 rounded-b-3xl h-[186px]"
        style={{ background: 'linear-gradient(280deg, #2E8B57 0%, #1B7A3D 40%, #0B2F1A 100%)' }}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-1">
            <IconMapPin className="size-4" />
            <span className="text-[13px] font-semibold">Terminal de Viana</span>
          </div>
          <div className='bg-[#FFFFFF33] py-1.5 px-2.5 rounded-4xl flex items-center justify-center
          gap-1 border border-[#FFFFFF1F]'>
            <IconClock className='size-3' />
            <span className="text-xs font-semibold opacity-90">{formatDate()}</span>
          </div>
        </div>

        <div className="mt-2">
          <h1 className="text-[34px] font-extrabold text-white">Painel do Dia</h1>

          <div className="flex items-end justify-between gap-3 mb-6">
            <span className="text-sm text-[#FFFFFFB3] whitespace-nowrap">Visão geral das viagens de hoje</span>
            <div className="h-px w-[100px] bg-[#FFFFFFB3]" />
          </div>
        </div>
      </header>

      <main className="px-5 py-6 pb-28">
        <div className='flex items-center justify-between'>
        <h2 className="text-[15px] font-bold text-[#111827] mb-4">Viagens de Hoje</h2>
        <p className='text-[13px] text-[#1B7A3D] font-semibold'>{schedules.length} autocarros</p>

        </div>
        <div className="flex flex-col gap-3">
          {schedules.map((schedule) => {
            const style = STATUS_STYLE[schedule.status]
            return (
              <Card
                key={schedule.id}
                role="button"
                tabIndex={0}
                className="p-0 cursor-pointer hover:scale-[1.01] border-[#E5E7EB] 
                active:scale-[0.99] transition-transform"
                onClick={() => navigate(`/operator/manifest?schedule=${schedule.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    navigate(`/operator/manifest?schedule=${schedule.id}`)
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-[#111827]">
                        {schedule.route}
                      </span>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full
                       ${style.bg} ${style.text}`}>
                      {style.label}
                    </span>
                  </div>
                  <div className='flex items-center gap-4 justify-baseline mb-2'>
                    <div className='flex flex-col '>
                      <span className='text-[11px] text-[#4B5563] font-medium'>Hora</span>
                      <p className='text-[14px] text-[#111827] font-bold'>{schedule.departureTime}</p>
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-[11px] text-[#4B5563] font-medium'>Matrícula</span>
                      <p className='text-[14px] text-[#111827] font-bold'>{schedule.busPlate}</p>
                    </div>
                     <div className='flex flex-col'>
                      <span className='text-[11px] text-[#4B5563] font-medium'>Embarque</span>
                      <p className='text-[14px] text-[#1B7A3D] font-bold'>
                        {schedule.availableSeats}/{schedule.totalSeats} lugares
                        </p>
                    </div>
                    
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-1">
                    <p className='font-semibold text-xs text-[#1B7A3D]'>Ver Manifesto</p>
                    <IconChevronRight className="size-5   text-[#1B7A3D]" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
