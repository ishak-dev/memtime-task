import { useQuery } from '@tanstack/react-query'
import { ERROR_MESSAGES } from '../../../shared/errors'
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
    error: query.isError ? ERROR_MESSAGES.loadClients : null,
  }
}
