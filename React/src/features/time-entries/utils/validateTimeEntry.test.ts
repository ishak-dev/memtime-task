import { describe, expect, it } from 'vitest'
import { validateTimeEntry } from './validateTimeEntry'

const validPayload = {
  taskId: 10,
  comment: 'Worked on feature',
  start: '2026-01-01T10:00:00.000Z',
  end: '2026-01-01T11:00:00.000Z',
}

describe('validateTimeEntry', () => {
  it('returns null for a valid payload', () => {
    expect(validateTimeEntry(validPayload)).toBeNull()
  })

  it('requires a positive task id', () => {
    expect(validateTimeEntry({ ...validPayload, taskId: 0 })).toBe('Select a task')
  })

  it('requires a non-empty comment', () => {
    expect(validateTimeEntry({ ...validPayload, comment: '   ' })).toBe('Comment is required')
  })

  it('requires end after start', () => {
    expect(
      validateTimeEntry({
        ...validPayload,
        start: '2026-01-01T12:00:00.000Z',
        end: '2026-01-01T11:00:00.000Z',
      }),
    ).toBe('End must be after start')
  })
})
