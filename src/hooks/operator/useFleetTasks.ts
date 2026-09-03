import { useCallback } from 'react'
import { fleetApi } from '@/services/operator'
import { useAsyncData } from '@/hooks/useAsync'
import type { FleetTaskStatus } from '@/types/operator'

/** GET /fleet/tasks (+ PATCH /fleet/tasks/{id}) — tarefas do operador. */
export function useFleetTasks() {
  const query = useAsyncData(() => fleetApi.listTasks(), 'fleet-tasks', {
    fallbackError: 'Não foi possível carregar as tarefas.',
  })

  const { refetch } = query
  const updateStatus = useCallback(
    async (taskId: string, status: FleetTaskStatus) => {
      await fleetApi.updateTaskStatus(taskId, status)
      await refetch()
    },
    [refetch],
  )

  return { ...query, updateStatus }
}
