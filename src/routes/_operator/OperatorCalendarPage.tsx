import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  IconChevronLeft,
  IconChevronRight,
  IconBus,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
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

/** Dados mockados de viagens por data (simula API GET /boarding/schedules). */
function getMockSchedulesByDate(): Record<string, OperatorSchedule[]> {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();

  return {
    [formatDateKey(y, m, today.getDate())]: [
      {
        id: "macon-1",
        operatorName: "Macon",
        route: "Luanda → Benguela",
        origin: "Luanda",
        destination: "Benguela",
        departureDate: formatDateKey(y, m, today.getDate()),
        departureTime: "08:00",
        arrivalTime: "12:30",
        duration: "4h 30min",
        price: "3 500 Kz",
        busModel: "Mercedes Sprinter",
        busPlate: "LD-34-56-B",
        driverName: "Carlos Silva",
        vehicleType: "VIP",
        boardingCutoffMinutes: 30,
        boardingPoint: "Terminal de Viana",
        availableSeats: 25,
        totalSeats: 40,
        status: "scheduled",
      },
      {
        id: "macon-2",
        operatorName: "Macon",
        route: "Benguela → Huambo",
        origin: "Benguela",
        destination: "Huambo",
        departureDate: formatDateKey(y, m, today.getDate()),
        departureTime: "10:00",
        arrivalTime: "13:00",
        duration: "3h",
        price: "2 800 Kz",
        busModel: "Mercedes Sprinter",
        busPlate: "BE-78-23-D",
        driverName: "António Ferreira",
        vehicleType: "VIP",
        boardingCutoffMinutes: 30,
        boardingPoint: "Terminal Rodoviário de Benguela",
        availableSeats: 15,
        totalSeats: 40,
        status: "boarding",
      },
    ],
    [formatDateKey(y, m, today.getDate() + 1)]: [
      {
        id: "macon-tomorrow",
        operatorName: "Macon",
        route: "Luanda → Benguela",
        origin: "Luanda",
        destination: "Benguela",
        departureDate: formatDateKey(y, m, today.getDate() + 1),
        departureTime: "07:30",
        arrivalTime: "12:00",
        duration: "4h 30min",
        price: "3 500 Kz",
        busModel: "Mercedes Sprinter",
        busPlate: "LD-11-22-D",
        driverName: "António Gomes",
        vehicleType: "VIP",
        boardingCutoffMinutes: 30,
        boardingPoint: "Terminal de Viana",
        availableSeats: 35,
        totalSeats: 40,
        status: "scheduled",
      },
    ],
    [formatDateKey(y, m, today.getDate() + 3)]: [
      {
        id: "macon-day3",
        operatorName: "Macon",
        route: "Luanda → Huambo",
        origin: "Luanda",
        destination: "Huambo",
        departureDate: formatDateKey(y, m, today.getDate() + 3),
        departureTime: "06:00",
        arrivalTime: "13:00",
        duration: "7h",
        price: "4 500 Kz",
        busModel: "Mercedes Sprinter",
        busPlate: "LD-90-34-F",
        driverName: "Ricardo Almeida",
        vehicleType: "VIP",
        boardingCutoffMinutes: 30,
        boardingPoint: "Rodoviária do Zango",
        availableSeats: 30,
        totalSeats: 40,
        status: "scheduled",
      },
    ],
  };
}

export default function OperatorCalendarPage() {
  const navigate = useNavigate();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const schedulesByDate = useMemo(() => getMockSchedulesByDate(), []);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const selectedDateKey = formatDateKey(currentYear, currentMonth, selectedDay);
  const selectedSchedules = schedulesByDate[selectedDateKey] ?? [];

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

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
            {selectedSchedules.map((schedule) => (
              <Card
                key={schedule.id}
                className="p-0 cursor-pointer hover:scale-[1.01] border-[#E5E7EB] active:scale-[0.99] transition-transform"
                onClick={() =>
                  navigate(`/operator/manifest?schedule=${schedule.id}`)
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#111827]">
                      {schedule.route}
                    </span>
                    <span className="text-[11px] font-semibold text-[#1B7A3D]">
                      {schedule.departureTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <IconBus className="size-3" />
                    <span className="text-[11px]">
                      {schedule.busPlate} · {schedule.availableSeats}/
                      {schedule.totalSeats} lugares
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
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
