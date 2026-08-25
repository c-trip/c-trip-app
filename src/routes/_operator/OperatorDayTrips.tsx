import { IconMapPin } from '@tabler/icons-react'

function formatDate(): string {
  const now = new Date()
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
}

export default function OperatorDayTrips() {
  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <div
        className="px-5 pt-6 pb-8 rounded-b-3xl"
        style={{ background: 'linear-gradient(90deg, #2E8B57 0%, #1B7A3D 50%, #0B2F1A 100%)' }}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <IconMapPin className="size-5" />
            <span className="text-sm font-semibold">Terminal de Viana</span>
          </div>
          <span className="text-sm font-medium opacity-90">{formatDate()}</span>
        </div>
      </div>

      <main className="px-5 -mt-2">
        <h1 className="text-2xl font-bold text-[#111827] mb-4">Painel do Dia</h1>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-gray-500 whitespace-nowrap">Visão geral em tempo real</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>
      </main>
    </div>
  )
}
