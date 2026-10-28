import { request } from '../../../infrastructure/apiClient'
import type { PaginationParams, Task } from '../../../types/api'

export function getProjectTasks(projectId: number, params?: PaginationParams) {
  return request<Task[]>(`/projects/${projectId}/tasks`, { params })
}

export async function getAllProjectTasks(projectId: number, pageSize = 50): Promise<Task[]> {
  const all: Task[] = []
  let offset = 0

  while (true) {
    const page = await getProjectTasks(projectId, { limit: pageSize, offset })
    all.push(...page)

    if (page.length < pageSize) {
      break
    }

    offset += pageSize
  }

  return all
}
