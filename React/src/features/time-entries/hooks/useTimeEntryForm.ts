import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { CreateTimeEntryRequest, TimeEntry } from '../../../types/api'
import { fromDateTimeLocalValue, toDateTimeLocalValue } from '../utils/datetime'
import { validateTimeEntry } from '../utils/validateTimeEntry'
import { useCreateTimeEntry } from './useCreateTimeEntry'
import { useUpdateTimeEntry } from './useUpdateTimeEntry'

export type TimeEntryFormState = {
  taskId: string
  comment: string
  start: string
  end: string
}

const emptyForm: TimeEntryFormState = {
  taskId: '',
  comment: '',
  start: '',
  end: '',
}

type UseTimeEntryFormViewModelArgs = {
  selectedTaskId: number | null
  editingEntry: TimeEntry | null
  onCancelEdit: () => void
}

export function useTimeEntryFormViewModel({
  selectedTaskId,
  editingEntry,
  onCancelEdit,
}: UseTimeEntryFormViewModelArgs) {
  const isEditing = editingEntry !== null
  const createMutation = useCreateTimeEntry()
  const updateMutation = useUpdateTimeEntry()

  const [form, setForm] = useState<TimeEntryFormState>(emptyForm)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (editingEntry) {
      setForm({
        taskId: String(editingEntry.taskId),
        comment: editingEntry.comment,
        start: toDateTimeLocalValue(editingEntry.start),
        end: toDateTimeLocalValue(editingEntry.end),
      })
      setValidationError(null)
      setSuccessMessage(null)
      return
    }

    setForm({
      ...emptyForm,
      taskId: selectedTaskId !== null ? String(selectedTaskId) : '',
    })
  }, [editingEntry, selectedTaskId])

  function updateField<K extends keyof TimeEntryFormState>(
    field: K,
    value: TimeEntryFormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSuccessMessage(null)
    setValidationError(null)
    createMutation.reset()
    updateMutation.reset()

    const payload: CreateTimeEntryRequest = {
      taskId: Number(form.taskId),
      comment: form.comment.trim(),
      start: fromDateTimeLocalValue(form.start),
      end: fromDateTimeLocalValue(form.end),
    }

    const localError = validateTimeEntry(payload)
    if (localError) {
      setValidationError(localError)
      return
    }

    try {
      if (isEditing && editingEntry) {
        const updated = await updateMutation.mutateAsync({
          id: editingEntry.id,
          payload,
        })
        setSuccessMessage(
          `Updated time entry #${updated.id} (task ${updated.taskId}): ${updated.comment}`,
        )
        return
      }

      const created = await createMutation.mutateAsync(payload)
      setSuccessMessage(`Created time entry #${created.id}`)
      setForm({
        ...emptyForm,
        taskId: selectedTaskId !== null ? String(selectedTaskId) : '',
      })
    } catch {
      // API error is exposed via mutation state
    }
  }

  function startCreate() {
    onCancelEdit()
    setSuccessMessage(null)
    setValidationError(null)
    createMutation.reset()
    updateMutation.reset()
  }

  const apiError = createMutation.error ?? updateMutation.error

  return {
    isEditing,
    editingEntryId: editingEntry?.id ?? null,
    form,
    updateField,
    submit,
    startCreate,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    validationError,
    apiErrorMessage: apiError ? apiError.message : null,
    successMessage,
  }
}
