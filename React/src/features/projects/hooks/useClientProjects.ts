import { useQuery } from '@tanstack/react-query'
import type { PaginationParams } from '../../../types/api'
import { getClientProjects } from '../services/projectsService'

export function useClientProjects(clientId: number | null, params?: PaginationParams) {
  const query = useQuery({
    queryKey: ['projects', clientId, params],
    queryFn: () => getClientProjects(clientId!, params),
    enabled: clientId !== null,
  })

  return {
    projects: query.data ?? [],
    loading: query.isPending && clientId !== null,
    error: query.isError ? 'Failed to load projects' : null,
  }
}
