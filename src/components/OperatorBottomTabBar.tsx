import { useLocation, useNavigate } from 'react-router'
import {
  IconHome,
  IconHomeFilled,
  IconScan,
  IconTicket,
  IconTicketFilled,
  IconCalendar,
  IconCalendarFilled,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react'

const tabs = [
  { path: '/operator', label: 'Painel', icon: IconHome, iconActive: IconHomeFilled },
  { path: '/operator/scan', label: 'Scanner', icon: IconScan, iconActive: IconScan },
  { path: '/operator/walkin', label: 'Venda', icon: IconTicket, iconActive: IconTicketFilled },
  { path: '/operator/calendar', label: 'Calendário', icon: IconCalendar, iconActive: IconCalendarFilled },
  { path: '/operator/profile', label: 'Perfil', icon: IconUser, iconActive: IconUserFilled },
]

export default function OperatorBottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => {
    if (path === '/operator') return location.pathname === '/operator' || location.pathname.startsWith('/operator/manifest')
    return location.pathname.startsWith(path)
  }

  return (
    <nav aria-label="Navegação do operador" className="fixed bottom-0 left-0 right-0 z-50 bg-white font-outfit border-t border-gray-200 safe-area-pb">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map((tab) => {
          const active = isActive(tab.path)
          const Icon = active ? tab.iconActive : tab.icon

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center gap-1 rounded-full py-1 px-2 transition-colors"
            >
              <Icon className={`h-6 w-6 ${active ? 'text-[#1B7A3D]' : 'text-[#9CA3AF]'}`} />
              <span className={`font-inter text-[10px] font-semibold whitespace-nowrap ${active ? 'text-[#1B7A3D]' : 'text-[#9CA3AF]'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}