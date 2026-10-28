import { ApiRequestError, getApiResponseErrorMessage } from '../shared/errors'
import type { PaginationParams } from '../types/api'

const BASE_URL = 'https://interview-api.memtime-demo.deno.net/api/v1'
const API_KEY = import.meta.env.VITE_API_KEY

export type RequestOptions = Omit<RequestInit, 'body'> & {
  params?: PaginationParams
  body?: unknown
}

function buildUrl(path: string, params?: PaginationParams): string {
  const url = new URL(`${BASE_URL}${path}`)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    }
  }

  return url.toString()
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, headers, ...rest } = options

  const response = await fetch(buildUrl(path, params), {
    ...rest,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new ApiRequestError(response.status, await getApiResponseErrorMessage(response))
  }

  return response.json() as Promise<T>
}
