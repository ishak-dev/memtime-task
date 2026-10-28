import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { ERROR_MESSAGES } from '../../../shared/errors'
import { getAllTimeEntries } from '../services/timeEntriesService'

export function useTaskTimeEntries(taskId: number | null) {
  const query = useQuery({
    queryKey: ['time-entries', 'all'],
    queryFn: () => getAllTimeEntries(),
    enabled: taskId !== null,
  })

  const timeEntries = useMemo(() => {
    if (taskId === null || !query.data) return []
    return query.data.filter((entry) => entry.taskId === taskId)
  }, [query.data, taskId])

  return {
    timeEntries,
    loading: query.isPending && taskId !== null,
    error: query.isError ? ERROR_MESSAGES.loadTimeEntries : null,
  }
}
