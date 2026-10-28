import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { PaginationParams } from '../../../types/api'
import { getClientProjects } from '../services/projectsService'

export function useClientProjects(clientId: number | null, params?: PaginationParams) {
  const query = useQuery({
    queryKey: ['projects', clientId, params],
    queryFn: () => getClientProjects(clientId!, params),
    enabled: clientId !== null,
    placeholderData: (previousData, previousQuery) => {
      const previousClientId = previousQuery?.queryKey[1]
      return previousClientId === clientId ? keepPreviousData(previousData) : undefined
    },
  })

  return {
    projects: query.data ?? [],
    loading: query.isPending && clientId !== null,
    isFetching: query.isFetching && clientId !== null,
    error: query.isError ? 'Failed to load projects' : null,
  }
}
