import { useQuery } from '@tanstack/react-query'
import { ERROR_MESSAGES } from '../../../shared/errors'
import type { PaginationParams } from '../../../types/api'
import { getProjectTasks } from '../services/tasksService'

export function useProjectTasks(projectId: number | null, params?: PaginationParams) {
  const query = useQuery({
    queryKey: ['tasks', projectId, params],
    queryFn: () => getProjectTasks(projectId!, params),
    enabled: projectId !== null,
  })

  return {
    tasks: query.data ?? [],
    loading: query.isPending && projectId !== null,
    error: query.isError ? ERROR_MESSAGES.loadTasks : null,
  }
}
