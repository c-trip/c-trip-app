import { useState } from 'react'
import { useNavigate } from 'react-router'
import { IconArrowLeft, IconTool, IconChevronRight, IconCircleCheck } from '@tabler/icons-react'
import { gooeyToast } from 'goey-toast'
import { Card, CardContent } from '@/components/ui/card'

type TaskStatus = 'pending' | 'in_progress' | 'done'

interface FleetTask {
  taskId: string
  title: string
  description: string
  vehiclePlate: string
  status: TaskStatus
  createdAt: string
}

const MOCK_TASKS: FleetTask[] = [
  {
    taskId: 'tsk-001',
    title: 'Verificação de pneus',
    description: 'Verificar pressão e desgaste dos pneus do autocarro LD-34-56-B antes da partida.',
    vehiclePlate: 'LD-34-56-B',
    status: 'pending',
    createdAt: '07:30',
  },
  {
    taskId: 'tsk-002',
    title: 'Limpeza interior',
    description: 'Limpar e desinfectar interior do veículo BE-78-23-D após viagem anterior.',
    vehiclePlate: 'BE-78-23-D',
    status: 'in_progress',
    createdAt: '08:00',
  },
  {
    taskId: 'tsk-003',
    title: 'Reabastecimento de combustível',
    description: 'Abastecer tanque do autocarro LD-90-34-F para viagem Luanda → Huambo.',
    vehiclePlate: 'LD-90-34-F',
    status: 'pending',
    createdAt: '06:45',
  },
  {
    taskId: 'tsk-004',
    title: 'Checagem de luzes',
    description: 'Testar todas as luzes externas e internas do veículo LD-34-56-B.',
    vehiclePlate: 'LD-34-56-B',
    status: 'done',
    createdAt: '06:00',
  },
  {
    taskId: 'tsk-005',
    title: 'Inspecção de extintor',
    description: 'Verificar validade e pressão do extintor de incêndio no BE-78-23-D.',
    vehiclePlate: 'BE-78-23-D',
    status: 'done',
    createdAt: '05:30',
  },
]

const STATUS_CONFIG: Record<TaskStatus, { bg: string; text: string; label: string; iconBg: string }> = {
  pending: { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', label: 'Pendente', iconBg: 'bg-[#FEF3C7]' },
  in_progress: { bg: 'bg-[#DBEAFE]', text: 'text-[#1E40AF]', label: 'Em curso', iconBg: 'bg-[#DBEAFE]' },
  done: { bg: 'bg-[#D1FAE5]', text: 'text-[#047857]', label: 'Concluída', iconBg: 'bg-[#D1FAE5]' },
}

type TaskTab = 'all' | TaskStatus

export default function OperatorTasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<FleetTask[]>(MOCK_TASKS)
  const [activeTab, setActiveTab] = useState<TaskTab>('all')

  const pending = tasks.filter((t) => t.status === 'pending')
  const inProgress = tasks.filter((t) => t.status === 'in_progress')
  const done = tasks.filter((t) => t.status === 'done')

  const filtered = activeTab === 'all' ? tasks : tasks.filter((t) => t.status === activeTab)

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      // Mock — substituir por PATCH /fleet/tasks/{task_id}
      await new Promise((r) => setTimeout(r, 600))

      setTasks((prev) => prev.map((t) => t.taskId === taskId ? { ...t, status: newStatus } : t))

      const statusLabel = STATUS_CONFIG[newStatus].label
      gooeyToast.success('Tarefa actualizada', {
        description: `Estado alterado para "${statusLabel}"`,
      })
    } catch {
      gooeyToast.error('Erro ao actualizar', {
        description: 'Tente novamente.',
      })
    }
  }

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    if (current === 'pending') return 'in_progress'
    if (current === 'in_progress') return 'done'
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 font-outfit">
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
            { key: 'all', label: 'Todas', count: tasks.length },
            { key: 'pending', label: 'Pendentes', count: pending.length },
            { key: 'in_progress', label: 'Em curso', count: inProgress.length },
            { key: 'done', label: 'Concluídas', count: done.length },
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
              <span className={`ml-0.5 ${activeTab === tab.key ? 'text-white' : 'text-gray-500'}`}>
                ({tab.count})
              </span>
            </button>
          ))}
        </nav>

        {filtered.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filtered.map((task) => {
              const style = STATUS_CONFIG[task.status]
              const nextStatus = getNextStatus(task.status)

              return (
                <Card key={task.taskId} className={`p-0 border-[#E5E7EB] ${task.status === 'done' ? 'opacity-60' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`size-9 rounded-full ${style.iconBg} flex items-center justify-center shrink-0`}>
                          <IconTool className={`size-4 ${style.text}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#111827]">{task.title}</p>
                          <p className="text-[11px] text-gray-500">{task.vehiclePlate} · {task.createdAt}</p>
                        </div>
                      </div>
                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                        {style.label}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">{task.description}</p>

                    {nextStatus && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(task.taskId, nextStatus)}
                        className="w-full flex items-center justify-between py-2.5 px-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <span className="text-xs font-semibold text-[#1B7A3D]">
                          {nextStatus === 'in_progress' ? 'Iniciar tarefa' : 'Marcar como concluída'}
                        </span>
                        <IconChevronRight className="size-4 text-[#1B7A3D]" />
                      </button>
                    )}

                    {task.status === 'done' && (
                      <div className="flex items-center justify-center gap-1.5 py-2 text-xs text-gray-400">
                        <IconCircleCheck className="size-4" />
                        <span>Concluída</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm">
            {activeTab === 'all'
              ? 'Nenhuma tarefa registada'
              : `Nenhuma tarefa ${activeTab === 'pending' ? 'pendente' : activeTab === 'in_progress' ? 'em curso' : 'concluída'}`}
          </div>
        )}
      </main>
    </div>
  )
}
