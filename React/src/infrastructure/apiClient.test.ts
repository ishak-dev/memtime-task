import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { request } from './apiClient'

describe('request', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('sends Bearer auth and returns JSON on success', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify([{ id: 1 }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const data = await request<{ id: number }[]>('/clients', {
      params: { limit: 10, offset: 0 },
    })

    expect(data).toEqual([{ id: 1 }])
    expect(fetchMock).toHaveBeenCalledOnce()

    const [url, init] = fetchMock.mock.calls[0]!
    expect(String(url)).toContain('/clients?limit=10&offset=0')
    expect(init?.headers).toMatchObject({
      Accept: 'application/json',
      Authorization: expect.stringMatching(/^Bearer /),
    })
  })

  it('throws an adapted error message when the response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: 'Nope' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await expect(request('/clients')).rejects.toThrow(
      'Bad Request - Invalid request parameters or body: Nope',
    )
  })
})
