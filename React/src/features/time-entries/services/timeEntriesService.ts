import { request } from '../../../infrastructure/apiClient'
import type {
  CreateTimeEntryRequest,
  PaginationParams,
  TimeEntry,
  UpdateTimeEntryRequest,
} from '../../../types/api'

export function getTimeEntries(params?: PaginationParams) {
  return request<TimeEntry[]>('/time-entries', { params })
}

export async function getAllTimeEntries(pageSize = 50): Promise<TimeEntry[]> {
  const all: TimeEntry[] = []
  let offset = 0

  while (true) {
    const page = await getTimeEntries({ limit: pageSize, offset })
    all.push(...page)

    if (page.length < pageSize) {
      break
    }

    offset += pageSize
  }

  return all
}

export function createTimeEntry(payload: CreateTimeEntryRequest) {
  return request<TimeEntry>('/time-entries', {
    method: 'POST',
    body: payload,
  })
}

export function updateTimeEntry(id: number, payload: UpdateTimeEntryRequest) {
  return request<TimeEntry>(`/time-entries/${id}`, {
    method: 'PUT',
    body: payload,
  })
}
