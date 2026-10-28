import type { ApiError } from '../../types/api'
import { ApiRequestError } from './ApiRequestError'
import { ERROR_MESSAGES } from './messages'

export async function getApiResponseErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiError
    if (data.error) return data.error
  } catch {
    // ignore JSON parse errors
  }

  if (response.status === 400) return ERROR_MESSAGES.invalidRequestBody
  if (response.status === 404) return ERROR_MESSAGES.timeEntryNotFound
  return ERROR_MESSAGES.requestFailed(response.status)
}

export function getDisplayErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.status === 404) return ERROR_MESSAGES.notFound(error.message)
    if (error.status === 400) return ERROR_MESSAGES.invalidInput(error.message)
    return error.message
  }

  if (error instanceof Error) return error.message
  return ERROR_MESSAGES.somethingWentWrong
}
