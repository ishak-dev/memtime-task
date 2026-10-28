import { useQuery } from '@tanstack/react-query'
import type { PaginationParams } from '../../../types/api'
import { getClients } from '../services/clientsService'

export function useClients(params?: PaginationParams) {
  const query = useQuery({
    queryKey: ['clients', params],
    queryFn: () => getClients(params),
  })

  return {
    clients: query.data ?? [],
    loading: query.isPending,
    error: query.isError ? 'Failed to load clients' : null,
  }
}
