import { describe, expect, it } from 'vitest'
import { adaptHttpError, HTTP_STATUS } from './httpErrorAdapter'

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('adaptHttpError', () => {
  it('maps known status codes to descriptions', async () => {
    const result = await adaptHttpError(jsonResponse(HTTP_STATUS.NOT_FOUND, {}))
    expect(result.status).toBe(404)
    expect(result.message).toBe('Not Found - Resource not found')
  })

  it('appends the API error body when present', async () => {
    const result = await adaptHttpError(
      jsonResponse(HTTP_STATUS.TOO_MANY_REQUESTS, { error: 'Slow down' }),
    )
    expect(result.message).toBe('Too Many Requests - Rate limit exceeded: Slow down')
  })

  it('falls back for unknown statuses', async () => {
    const result = await adaptHttpError(jsonResponse(418, {}))
    expect(result.message).toBe('Unexpected error (418)')
  })
})
