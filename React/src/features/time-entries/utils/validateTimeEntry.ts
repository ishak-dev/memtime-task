import { ERROR_MESSAGES } from '../../../shared/errors'
import type { CreateTimeEntryRequest } from '../../../types/api'

export function validateTimeEntry(payload: CreateTimeEntryRequest): string | null {
  if (!Number.isFinite(payload.taskId) || payload.taskId <= 0) {
    return ERROR_MESSAGES.validation.taskId
  }
  if (!payload.comment.trim()) {
    return ERROR_MESSAGES.validation.comment
  }
  if (!payload.start || Number.isNaN(Date.parse(payload.start))) {
    return ERROR_MESSAGES.validation.start
  }
  if (!payload.end || Number.isNaN(Date.parse(payload.end))) {
    return ERROR_MESSAGES.validation.end
  }
  if (Date.parse(payload.end) <= Date.parse(payload.start)) {
    return ERROR_MESSAGES.validation.endAfterStart
  }
  return null
}
