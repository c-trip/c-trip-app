import { useLocation, useNavigate } from 'react-router'
import {
  IconLayoutDashboard,
  IconLayoutDashboardFilled,
  IconQrcode,
  IconTicket,
  IconTicketFilled,
  IconCalendar,
  IconCalendarFilled,
} from '@tabler/icons-react'

const tabs = [
  { path: '/operator', label: 'Painel', icon: IconLayoutDashboard, iconActive: IconLayoutDashboardFilled },
  { path: '/operator/scan', label: 'Scanner', icon: IconQrcode, iconActive: IconQrcode },
  { path: '/operator/walkin', label: 'Venda', icon: IconTicket, iconActive: IconTicketFilled },
  { path: '/operator/calendar', label: 'Calendário', icon: IconCalendar, iconActive: IconCalendarFilled },
]

export default function OperatorBottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    if (path === '/operator') return location.pathname === '/operator' || location.pathname.startsWith('/operator/manifest')
    return location.pathname.startsWith(path)
  }

  return (
    <nav aria-label="Navegação do operador" className="fixed bottom-2 left-4 right-4 z-50 border border-gray-200 bg-white/80 font-outfit
    backdrop-blur-xl safe-area-pb rounded-4xl">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map((tab) => {
          const active = isActive(tab.path)
          const Icon = active ? tab.iconActive : tab.icon

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              aria-current={active ? 'page' : undefined}
              className={`flex flex-col items-center gap-1 rounded-full transition-all ${
                active ? 'bg-[#1B7A3D] px-8 py-2' : 'px-3 py-2'
              }`}
            >
              <Icon className={`h-6 w-6 ${active ? 'text-white' : 'text-gray-600'}`} />
              <span className={`text-[10px] font-medium ${active ? 'text-white' : 'text-gray-600'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
