import { useState } from "react";
import { useNavigate } from "react-router";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { getOperatorTodaySchedules, getFutureSchedules } from "@/data/mockOperatorSchedules";
import type { OperatorSchedule } from "@/data/mockOperatorSchedules";
import RouteDisplay from "@/components/RouteDisplay";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const STATUS_STYLE: Record<OperatorSchedule['status'], { bg: string; text: string; label: string }> = {
  scheduled: { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', label: 'A iniciar' },
  boarding: { bg: 'bg-[#D1FAE5]', text: 'text-[#047857]', label: 'Embarque' },
  departed: { bg: 'bg-[#F3F4F6]', text: 'text-[#4B5563]', label: 'Partiu' },
}

/** Dados mockados de viagens por data (simula API GET /boarding/schedules). */
function getMockSchedulesByDate(): Record<string, OperatorSchedule[]> {
  const all = [...getOperatorTodaySchedules(), ...getFutureSchedules()]
  const byDate: Record<string, OperatorSchedule[]> = {}
  for (const s of all) {
    const key = s.departureDate
    if (!byDate[key]) byDate[key] = []
    byDate[key].push(s)
  }
  return byDate
}

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

export default function OperatorCalendarPage() {
  const navigate = useNavigate();
  const today = new Date();
  const [month, setMonth] = useState<Date>(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(today);

  const schedulesByDate = getMockSchedulesByDate();

  const selectedKey = format(selected, "yyyy-MM-dd");
  const selectedSchedules = schedulesByDate[selectedKey] ?? [];

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <header className="sticky top-0 z-40 bg-white px-5 pt-3 pb-4 border-b border-gray-200 shadow-sm">
        <h1 className="text-[22px] font-bold text-[#111827]">
          Calendário de Viagens
        </h1>
        <p className="text-sm text-gray-500">Gestão de planeamento mensal</p>
      </header>

      <main className="px-5 py-6 pb-28">
        <Card className="border-[#E5E7EB] mb-6 bg-white">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              locale={pt}
              selected={selected}
              onSelect={(day) => day && setSelected(day)}
              defaultMonth={month}
              onMonthChange={setMonth}
              weekStartsOn={0}
              showOutsideDays={false}
              className="mx-auto w-full max-w-[350px] bg-transparent [--cell-size:2.5rem]"
              formatters={{
                formatCaption: (date) =>
                  capitalize(format(date, "MMMM yyyy", { locale: pt })),
              }}
              classNames={{
                day: cn("data-[selected-single=true]:rounded-full"),
              }}
              components={{
                DayButton: (props) => {
                  const key = format(props.day.date, "yyyy-MM-dd")
                  const hasTrips = !!schedulesByDate[key]
                  return (
                    <CalendarDayButton {...props}>
                      {props.children}
                      {hasTrips && (
                        <span className="pointer-events-none absolute bottom-1 left-1/2 
                        -translate-x-1/2 size-1 rounded-full bg-primary !opacity-100 
                        data-[selected-single=true]:bg-white" />
                      )}
                    </CalendarDayButton>
                  )
                },
              }}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#111827]">
            Partidas do dia selecionado — {selected.getDate()} {MONTHS[selected.getMonth()]}
          </h3>
        </div>

        {selectedSchedules.length > 0 ? (
          <div className="flex flex-col gap-3">
            {selectedSchedules.map((schedule) => {
              const statusStyle = STATUS_STYLE[schedule.status]
              return (
                <Card
                  key={schedule.id}
                  role="button"
                  tabIndex={0}
                  className="p-0 cursor-pointer bg-white hover:scale-[1.01] border-[#E5E7EB] active:scale-[0.99] transition-transform"
                  onClick={() => navigate(`/operator/manifest?schedule=${schedule.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(`/operator/manifest?schedule=${schedule.id}`)
                    }
                  }}
                >
                  <CardContent className="px-4 py-2 flex justify-between items-center">
                    <div className="flex flex-col items-baseline  justify-between mb-2">
                      <span className="text-[15px] font-bold text-[#111827]">
                        <RouteDisplay origin={schedule.origin} destination={schedule.destination} />
                      </span>

                      <div className="flex items-center gap-2  text-gray-400">
                        <span className="text-[13px] font-inter text-[#1B7A3D] font-semibold">{schedule.departureTime}</span>
                        <span className=" text-[#4B5563]">·</span>
                        <span className="text-[11px] font-inter font-normal text-[#4B5563]">{schedule.availableSeats}/{schedule.totalSeats} embarcados</span>
                      </div>
                    </div>

                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 font-inter rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.label}
                    </span>

                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 text-sm">
            Nenhuma viagem neste dia
          </div>
        )}
      </main>
    </div>
  );
}