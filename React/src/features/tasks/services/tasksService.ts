import { request } from '../../../infrastructure/apiClient'
import type { PaginationParams, Task } from '../../../types/api'

export function getProjectTasks(projectId: number, params?: PaginationParams) {
  return request<Task[]>(`/projects/${projectId}/tasks`, { params })
}
