import { useQuery } from '@tanstack/react-query'
import { ERROR_MESSAGES } from '../../../shared/errors'
import type { PaginationParams } from '../../../types/api'
import { getTimeEntries } from '../services/timeEntriesService'

export function useTimeEntries(params?: PaginationParams, enabled = true) {
  const query = useQuery({
    queryKey: ['time-entries', params],
    queryFn: () => getTimeEntries(params),
    enabled,
  })

  return {
    timeEntries: query.data ?? [],
    loading: query.isPending && enabled,
    error: query.isError ? ERROR_MESSAGES.loadTimeEntries : null,
  }
}
