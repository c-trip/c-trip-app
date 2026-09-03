import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { IconArrowLeft, IconTool, IconChevronRight, IconCircleCheck, IconRefresh } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { Card, CardContent } from '@/components/ui/card'
import { useFleetTasks } from '@/hooks/operator/useFleetTasks'
import type { FleetTask, FleetTaskStatus } from '@/types/operator'

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', label: 'Pendente' },
  in_progress: { bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]', label: 'Em curso' },
  done: { bg: 'bg-[#D1FAE5]', text: 'text-[#047857]', label: 'Concluída' },
}

function statusConfig(status: string) {
  return STATUS_CONFIG[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: status }
}

function nextStatus(current: string): FleetTaskStatus | null {
  if (current === 'pending') return 'in_progress'
  if (current === 'in_progress') return 'done'
  return null
}

type TaskTab = 'all' | 'pending' | 'in_progress' | 'done'

export default function OperatorTasks() {
  const navigate = useNavigate()
  const { data, isLoading, error, refetch, updateStatus } = useFleetTasks()
  const [activeTab, setActiveTab] = useState<TaskTab>('all')
  const [pendingIds, setPendingIds] = useState<Set<string>>(() => new Set())

  const tasks = useMemo(() => data ?? [], [data])
  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }
  const filtered = activeTab === 'all' ? tasks : tasks.filter((t) => t.status === activeTab)

  const advance = async (task: FleetTask, to: FleetTaskStatus) => {
    setPendingIds((prev) => new Set(prev).add(task.id))
    try {
      await updateStatus(task.id, to)
      gooeyToast.success('Tarefa actualizada', { description: `Estado: "${statusConfig(to).label}"` })
    } catch {
      gooeyToast.error('Erro ao actualizar', { description: 'Tente novamente.' })
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(task.id)
        return next
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-outfit">
      <header className="sticky top-0 z-50 bg-gray-50 px-5 pt-3 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/operator')}
            aria-label="Voltar ao painel"
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <IconArrowLeft className="size-5 text-gray-600" />
          </button>
          <h1 className="text-[22px] font-bold text-[#111827] text-center flex-1">Tarefas</h1>
        </div>
      </header>

      <main className="px-5 py-5 pb-28">
        <nav className="flex gap-2 mb-5" aria-label="Filtro de tarefas">
          {([
            { key: 'all', label: 'Todas' },
            { key: 'pending', label: 'Pendentes' },
            { key: 'in_progress', label: 'Em curso' },
            { key: 'done', label: 'Concluídas' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-[20px] text-xs font-semibold transition-all border ${
                activeTab === tab.key
                  ? 'bg-[#1B7A3D] text-white border-[#1B7A3D]'
                  : 'bg-white text-[#111827] border-gray-200'
              }`}
              aria-pressed={activeTab === tab.key}
            >
              {tab.label}{' '}
              <span className={activeTab === tab.key ? 'text-white' : 'text-gray-500'}>({counts[tab.key]})</span>
            </button>
          ))}
        </nav>

        {isLoading && (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-[#4B5563]">{error}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#1B7A3D]"
            >
              <IconRefresh className="size-4" />
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !error && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            {activeTab === 'all' ? 'Nenhuma tarefa atribuída' : 'Nenhuma tarefa neste estado'}
          </div>
        )}

        {!isLoading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-3">
            {filtered.map((task) => {
              const style = statusConfig(task.status)
              const to = nextStatus(task.status)
              const busy = pendingIds.has(task.id)
              return (
                <Card key={task.id} className="p-0 border-[#E5E7EB]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`size-9 rounded-full ${style.bg} flex items-center justify-center shrink-0`}>
                          <IconTool className={`size-4 ${style.text}`} />
                        </div>
                        <p className="text-sm font-semibold text-[#111827]">{task.title}</p>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>

                    {to ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => advance(task, to)}
                        className="w-full flex items-center justify-between py-2.5 px-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
                      >
                        <span className="text-xs font-semibold text-[#1B7A3D]">
                          {busy
                            ? 'A processar...'
                            : to === 'in_progress'
                              ? 'Iniciar tarefa'
                              : 'Marcar como concluída'}
                        </span>
                        <IconChevronRight className="size-4 text-[#1B7A3D]" />
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 py-2 text-xs text-gray-400">
                        <IconCircleCheck className="size-4" />
                        Concluída
                      </div>
                    )}
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
