import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateTimeEntryRequest } from '../../../types/api'
import { createTimeEntry } from '../services/timeEntriesService'

export function useCreateTimeEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateTimeEntryRequest) => createTimeEntry(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['time-entries'] })
    },
  })
}
