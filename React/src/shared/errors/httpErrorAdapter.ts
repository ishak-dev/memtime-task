/** HTTP statuses from the Memtime API docs */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const

const STATUS_DESCRIPTION: Record<number, string> = {
  [HTTP_STATUS.OK]: 'OK - Request successful',
  [HTTP_STATUS.CREATED]: 'Created - Resource created successfully',
  [HTTP_STATUS.BAD_REQUEST]: 'Bad Request - Invalid request parameters or body',
  [HTTP_STATUS.NOT_FOUND]: 'Not Found - Resource not found',
  [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Too Many Requests - Rate limit exceeded',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Internal Server Error - Server error',
}

export type HttpErrorResult = {
  status: number
  message: string
}

/**
 * Adapter: maps an HTTP Response to { status, message }.
 * Prefers API body `{ error: string }`, falls back to status description.
 */
export async function adaptHttpError(response: Response): Promise<HttpErrorResult> {
  const statusDescription =
    STATUS_DESCRIPTION[response.status] ?? `Unexpected error (${response.status})`

  let apiError: string | undefined
  try {
    const body = (await response.json()) as { error?: string }
    if (body.error) apiError = body.error
  } catch {
    // response body was not JSON
  }

  return {
    status: response.status,
    message: apiError ? `${statusDescription}: ${apiError}` : statusDescription,
  }
}
