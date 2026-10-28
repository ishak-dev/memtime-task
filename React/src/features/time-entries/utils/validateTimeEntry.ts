import type { CreateTimeEntryRequest } from '../../../types/api'

export function validateTimeEntry(payload: CreateTimeEntryRequest): string | null {
  if (!Number.isFinite(payload.taskId) || payload.taskId <= 0) {
    return 'Task ID must be a positive number'
  }
  if (!payload.comment.trim()) {
    return 'Comment is required'
  }
  if (!payload.start || Number.isNaN(Date.parse(payload.start))) {
    return 'Start must be a valid date/time'
  }
  if (!payload.end || Number.isNaN(Date.parse(payload.end))) {
    return 'End must be a valid date/time'
  }
  if (Date.parse(payload.end) <= Date.parse(payload.start)) {
    return 'End must be after start'
  }
  return null
}
