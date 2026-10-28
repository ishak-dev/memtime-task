import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpdateTimeEntryRequest } from '../../../types/api'
import { updateTimeEntry } from '../services/timeEntriesService'

type UpdateTimeEntryVariables = {
  id: number
  payload: UpdateTimeEntryRequest
}

export function useUpdateTimeEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateTimeEntryVariables) => updateTimeEntry(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['time-entries'] })
    },
  })
}
