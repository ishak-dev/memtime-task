import { request } from '../../../infrastructure/apiClient'
import type { PaginationParams, Project } from '../../../types/api'

export function getClientProjects(clientId: number, params?: PaginationParams) {
  return request<Project[]>(`/clients/${clientId}/projects`, { params })
}
