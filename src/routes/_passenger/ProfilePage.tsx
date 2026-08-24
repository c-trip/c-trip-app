import { useNavigate } from 'react-router'
import {
  IconUser,
  IconBell,
  IconLogout,
  IconChevronRight,
  IconMail,
  IconPhone,
  IconId,
} from '@tabler/icons-react'
import { Card, CardContent } from '@/components/ui/card'

const MOCK_USER = {
  name: 'João Silva',
  email: 'joao.silva@email.com',
  phone: '923 456 789',
  bi: '001234567LA045',
}

export default function ProfilePage() {
  const navigate = useNavigate()

  const menuItems = [
    {
      label: 'Notificações',
      icon: IconBell,
      onClick: () => navigate('/notifications'),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 pt-4 pb-4">
        <h1 className="text-[22px] font-extrabold text-[#111827]">Perfil</h1>
      </header>

      <main className="px-5 py-6 pb-28">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#6B9E8C]/20">
            <IconUser className="h-10 w-10 text-[#3A6356]" />
          </div>
          <h2 className="text-xl font-bold text-[#111827]">{MOCK_USER.name}</h2>
          <p className="text-sm text-gray-500">{MOCK_USER.email}</p>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 border border-gray-200">
            <IconId className="size-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-[10px] text-gray-400 font-medium">Bilhete de Identidade</p>
              <p className="text-sm font-semibold text-[#111827]">{MOCK_USER.bi}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 border border-gray-200">
            <IconPhone className="size-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-[10px] text-gray-400 font-medium">Telefone</p>
              <p className="text-sm font-semibold text-[#111827]">{MOCK_USER.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 border border-gray-200">
            <IconMail className="size-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-[10px] text-gray-400 font-medium">Email</p>
              <p className="text-sm font-semibold text-[#111827]">{MOCK_USER.email}</p>
            </div>
          </div>
        </div>

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
              onClick={() => navigate('/welcome')}
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
