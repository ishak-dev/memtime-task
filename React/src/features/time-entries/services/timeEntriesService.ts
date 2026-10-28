import { request } from '../../../infrastructure/apiClient'
import type { PaginationParams, TimeEntry } from '../../../types/api'

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
