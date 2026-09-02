import { useNavigate } from 'react-router'
import { IconCreditCard, IconRefresh, IconCircleCheck, IconClock, IconCircleX } from '@tabler/icons-react'
import PageHeader from '@/components/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { usePayments } from '@/hooks/passenger/usePassenger'
import type { PaymentApiStatus } from '@/types/passenger'

const STATUS: Record<string, { label: string; text: string; Icon: typeof IconClock }> = {
  confirmed: { label: 'Confirmado', text: 'text-[#1B7A3D]', Icon: IconCircleCheck },
  pending: { label: 'Pendente', text: 'text-[#F59E0B]', Icon: IconClock },
  failed: { label: 'Falhou', text: 'text-red-600', Icon: IconCircleX },
  cancelled: { label: 'Cancelado', text: 'text-red-600', Icon: IconCircleX },
}

function statusOf(s: PaymentApiStatus) {
  return STATUS[s] ?? { label: s, text: 'text-gray-500', Icon: IconClock }
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatKz(value: number): string {
  return `${Math.round(value).toLocaleString('pt-PT')} Kz`
}

const METHOD_LABEL: Record<string, string> = {
  cash: 'Dinheiro',
  pos: 'POS',
  multicaixa_express: 'Multicaixa Express',
}

export default function PaymentsPage() {
  const navigate = useNavigate()
  const { data, isLoading, error, refetch } = usePayments()
  const payments = data ?? []

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <PageHeader onBack={() => navigate(-1)} title="Meus Pagamentos" />

      <main className="px-5 py-6 pb-28">
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-[#4B5563]">{error}</p>
            <button type="button" onClick={() => void refetch()} className="flex items-center gap-1.5 text-sm font-semibold text-[#1B7A3D]">
              <IconRefresh className="size-4" />
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && payments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <IconCreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Sem pagamentos</h2>
          </div>
        )}

        {!isLoading && !error && payments.length > 0 && (
          <div className="flex flex-col gap-3">
            {payments.map((p) => {
              const s = statusOf(p.status)
              return (
                <Card
                  key={p.payment_id}
                  className="p-0 cursor-pointer border-[#E5E7EB]"
                  onClick={() => navigate(`/bookings/${p.booking_id}`)}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    <s.Icon className={`size-6 shrink-0 ${s.text}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#111827]">{formatKz(p.amount)}</p>
                      <p className="text-[11px] text-gray-500">
                        {METHOD_LABEL[p.method] ?? p.method} · {formatDate(p.created_at)}
                      </p>
                    </div>
                    <span className={`text-[11px] font-semibold ${s.text}`}>{s.label}</span>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
