import { useNavigate } from 'react-router'
import { formatDistanceToNow } from 'date-fns'
import { pt } from 'date-fns/locale/pt'
import { IconBell, IconBellOff, IconChecks } from '@tabler/icons-react'
import PageHeader from '@/components/PageHeader'
import { useNotifications } from '@/hooks/passenger/usePassenger'
import type { NotificationItem } from '@/types/passenger'

function relativeTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return formatDistanceToNow(date, { addSuffix: true, locale: pt })
}

function NotificationRow({
  item,
  onRead,
}: {
  item: NotificationItem
  onRead: (id: string) => void
}) {
  const unread = !item.is_read
  return (
    <button
      type="button"
      onClick={() => unread && onRead(item.id)}
      className={`w-full text-left rounded-2xl border p-4 transition-colors ${
        unread
          ? 'border-[#1B7A3D]/30 bg-[#1B7A3D]/5 hover:bg-[#1B7A3D]/10'
          : 'border-[#E5E7EB] bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 size-2 shrink-0 rounded-full ${unread ? 'bg-[#1B7A3D]' : 'bg-transparent'}`}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={`text-sm ${unread ? 'font-bold text-[#111827]' : 'font-semibold text-[#4B5563]'}`}>
              {item.title}
            </p>
            <span className="shrink-0 text-[11px] text-gray-400">{relativeTime(item.created_at)}</span>
          </div>
          <p className="mt-0.5 text-[13px] leading-relaxed text-[#4B5563]">{item.message}</p>
        </div>
      </div>
    </button>
  )
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { data, isLoading, error, refetch, markRead, unreadCount } = useNotifications()

  const notifications = data ?? []

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader
        onBack={() => navigate(-1)}
        title="Notificações"
        subtitle={unreadCount > 0 ? `${unreadCount} por ler` : 'Tudo em dia'}
      />

      <main className="px-5 py-6">
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-red-50">
              <IconBellOff className="size-7 text-red-400" />
            </div>
            <p className="text-sm text-[#4B5563]">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="text-sm font-semibold text-[#1B7A3D] underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-gray-100">
              <IconBell className="size-7 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Sem notificações</h2>
            <p className="text-sm text-gray-500">Vai receber aqui novidades sobre as suas viagens.</p>
          </div>
        )}

        {!isLoading && !error && notifications.length > 0 && (
          <>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => notifications.filter((n) => !n.is_read).forEach((n) => void markRead(n.id))}
                className="mb-3 ml-auto flex items-center gap-1.5 text-xs font-semibold text-[#1B7A3D]"
              >
                <IconChecks className="size-4" />
                Marcar todas como lidas
              </button>
            )}
            <div className="flex flex-col gap-3">
              {notifications.map((item) => (
                <NotificationRow key={item.id} item={item} onRead={markRead} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
