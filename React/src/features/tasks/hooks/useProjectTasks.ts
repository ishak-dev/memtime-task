import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { PaginationParams } from '../../../types/api'
import { getProjectTasks } from '../services/tasksService'

export function useProjectTasks(projectId: number | null, params?: PaginationParams) {
  const query = useQuery({
    queryKey: ['tasks', projectId, params],
    queryFn: () => getProjectTasks(projectId!, params),
    enabled: projectId !== null,
    placeholderData: (previousData, previousQuery) => {
      const previousProjectId = previousQuery?.queryKey[1]
      return previousProjectId === projectId ? keepPreviousData(previousData) : undefined
    },
  })

  return {
    tasks: query.data ?? [],
    loading: query.isPending && projectId !== null,
    isFetching: query.isFetching && projectId !== null,
    error: query.isError ? 'Failed to load tasks' : null,
  }
}
