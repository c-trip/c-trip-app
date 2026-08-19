import { useLocation, useNavigate } from 'react-router'
import {
  IconHome,
  IconHomeFilled,
  IconRoute,
  IconRoute2,
  IconTicket,
  IconTicketFilled,
  IconUser,
  IconUserFilled,
} from '@tabler/icons-react'

const tabs = [
  { path: '/search', label: 'Inicio', icon: IconHome, iconActive: IconHomeFilled },
  { path: '/bookings', label: 'Viagens', icon: IconRoute, iconActive: IconRoute2 },
  { path: '/tickets', label: 'Bilhetes', icon: IconTicket, iconActive: IconTicketFilled },
  { path: '/profile', label: 'Perfil', icon: IconUser, iconActive: IconUserFilled },
]

export default function BottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/50 bg-white/80 backdrop-blur-xl safe-area-pb">
      <div className="mx-auto flex max-w-lg items-center justify-around py-2">
        {tabs.map((tab) => {
          const active = isActive(tab.path)
          const Icon = active ? tab.iconActive : tab.icon

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                active ? 'text-green-gradient-end' : 'text-gray-400'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
