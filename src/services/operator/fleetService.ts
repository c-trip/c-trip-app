import { http } from '../http'
import type { FleetTask, FleetTaskStatus } from '@/types/operator'

/** Tarefas de frota atribuídas ao utilizador autenticado. */
export const fleetApi = {
  async listTasks(): Promise<FleetTask[]> {
    const { data } = await http.get<FleetTask[]>('/fleet/tasks')
    return data
  },

  async updateTaskStatus(taskId: string, status: FleetTaskStatus): Promise<void> {
    await http.patch(`/fleet/tasks/${taskId}`, { status })
  },
}
