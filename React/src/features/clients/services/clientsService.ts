import { request } from '../../../infrastructure/apiClient'
import type { Client, PaginationParams } from '../../../types/api'

export function getClients(params?: PaginationParams) {
  return request<Client[]>('/clients', { params })
}

export function getClient(id: number) {
  return request<Client>(`/clients/${id}`)
}
