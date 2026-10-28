import { useQuery } from '@tanstack/react-query'
import { getAllProjectTasks } from '../services/tasksService'

export function useAllProjectTasks(projectId: number | null) {
  const query = useQuery({
    queryKey: ['tasks', 'all', projectId],
    queryFn: () => getAllProjectTasks(projectId!),
    enabled: projectId !== null,
  })

  return {
    tasks: query.data ?? [],
    loading: query.isPending && projectId !== null,
    error: query.isError ? 'Failed to load tasks' : null,
  }
}
