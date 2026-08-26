import { useState } from "react";
import { useNavigate } from "react-router";
import {
  IconChevronLeft,
  IconChevronRight,
  IconBus,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { getOperatorTodaySchedules, getFutureSchedules } from "@/data/mockOperatorSchedules";
import type { OperatorSchedule } from "@/data/mockOperatorSchedules";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
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

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

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

export default function OperatorCalendarPage() {
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const schedulesByDate = getMockSchedulesByDate();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const selectedDateKey = formatDateKey(currentYear, currentMonth, selectedDay);
  const selectedSchedules = schedulesByDate[selectedDateKey] ?? [];

  const clampDay = (month: number, year: number) => {
    const max = getDaysInMonth(year, month)
    setSelectedDay((d) => Math.min(d, max))
  }

  const prevMonth = () => {
    const newMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const newYear = currentMonth === 0 ? currentYear - 1 : currentYear
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
    clampDay(newMonth, newYear)
  }

  const nextMonth = () => {
    const newMonth = currentMonth === 11 ? 0 : currentMonth + 1
    const newYear = currentMonth === 11 ? currentYear + 1 : currentYear
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
    clampDay(newMonth, newYear)
  }

  const todayKey = formatDateKey(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <header className="sticky top-0 z-40 bg-gray-50 px-5 pt-3 pb-4 border-b border-gray-200 shadow-sm">
        <h1 className="text-[22px] font-bold text-[#111827]">
          Calendário de Viagens
        </h1>
        <p className="text-sm text-gray-500">Gestão de planeamento mensal</p>
      </header>

      <main className="px-5 py-6 pb-28">
        <Card className="border-[#E5E7EB] mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                aria-label="Mês anterior"
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <IconChevronLeft className="size-5 text-gray-600" />
              </button>
              <h2 className="text-base font-bold text-[#111827]">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <button
                type="button"
                onClick={nextMonth}
                aria-label="Mês seguinte"
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <IconChevronRight className="size-5 text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-medium text-gray-400 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateKey = formatDateKey(currentYear, currentMonth, day);
                const hasTrips = !!schedulesByDate[dateKey];
                const isSelected = day === selectedDay;
                const isToday = dateKey === todayKey;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    aria-label={`${day} de ${MONTHS[currentMonth]} de ${currentYear}`}
                    aria-pressed={isSelected}
                    className={`relative flex flex-col items-center justify-center py-2 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? "bg-[#1B7A3D] text-white font-bold"
                        : isToday
                          ? "bg-[#1B7A3D]/10 text-[#1B7A3D] font-semibold"
                          : "text-[#111827] hover:bg-gray-100"
                    }`}
                  >
                    {day}
                    {hasTrips && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#1B7A3D]" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-[#111827]">
            Viagens — {selectedDay} {MONTHS[currentMonth]}
          </h3>
          <span className="text-[12px] text-[#1B7A3D] font-semibold">
            {selectedSchedules.length}{" "}
            {selectedSchedules.length === 1 ? "viagem" : "viagens"}
          </span>
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
                  className="p-0 cursor-pointer hover:scale-[1.01] border-[#E5E7EB] active:scale-[0.99] transition-transform"
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
                      <span className="text-sm font-bold text-[#111827]">{schedule.route}</span>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                        {statusStyle.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <IconBus className="size-3" />
                      <span className="text-[11px]">{schedule.departureTime} · {schedule.availableSeats}/{schedule.totalSeats} disponíveis</span>
                    </div>
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
