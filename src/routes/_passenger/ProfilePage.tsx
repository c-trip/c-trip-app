import { useNavigate } from 'react-router'
import {
  IconUser,
  IconBell,
  IconLogout,
  IconChevronRight,
  IconMail,
} from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'
import PageHeader from '@/components/PageHeader'
import { useProfile } from '@/hooks/useProfile'
import { useAuth } from '@/hooks/auth/useAuth'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { user, isLoading, error } = useProfile()

  const menuItems = [
    {
      label: 'Notificações',
      icon: IconBell,
      onClick: () => navigate('/notifications'),
    },
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader title="Perfil" />

      <main className="px-5 py-6 pb-28">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-sm text-gray-500">A carregar perfil...</p>
          </div>
        )}

        {error && !user && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => navigate('/auth/login')}
              className="rounded-xl bg-[#3A6356] px-6 py-3 text-sm font-semibold text-white"
            >
              Iniciar sessão
            </button>
          </div>
        )}

        {user && (
          <div className="flex flex-col items-center mb-8">
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#6B9E8C]/20">
              <IconUser className="h-10 w-10 text-[#3A6356]" />
            </div>
            <h2 className="text-xl font-bold text-[#111827]">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        )}

        {user && (
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 border border-gray-200">
              <IconMail className="size-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 font-medium">Email</p>
                <p className="text-sm font-semibold text-[#111827]">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        <Card className="border-[#E5E7EB]">
          <CardContent className="p-0 divide-y divide-gray-100">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors"
              >
                <item.icon className="size-5 text-gray-400" />
                <span className="flex-1 text-sm font-medium text-[#111827]">{item.label}</span>
                <IconChevronRight className="size-4 text-gray-300" />
              </button>
            ))}

            <button
              onClick={() => {
                logout()
                navigate('/welcome')
              }}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-red-50 transition-colors"
            >
              <IconLogout className="size-5 text-red-500" />
              <span className="text-sm font-medium text-red-500">Terminar sessão</span>
            </button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
