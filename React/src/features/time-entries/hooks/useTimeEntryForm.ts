import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { toast } from 'sonner'
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

  useEffect(() => {
    if (editingEntry) {
      setForm({
        taskId: String(editingEntry.taskId),
        comment: editingEntry.comment,
        start: toDateTimeLocalValue(editingEntry.start),
        end: toDateTimeLocalValue(editingEntry.end),
      })
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
      toast.error(localError)
      return
    }

    try {
      if (isEditing && editingEntry) {
        const updated = await updateMutation.mutateAsync({
          id: editingEntry.id,
          payload,
        })
        toast.success(
          `Updated time entry #${updated.id} (task ${updated.taskId}): ${updated.comment}`,
        )
        return
      }

      const created = await createMutation.mutateAsync(payload)
      toast.success(`Created time entry #${created.id}`)
      setForm({
        ...emptyForm,
        taskId: selectedTaskId !== null ? String(selectedTaskId) : '',
      })
    } catch {
      // MutationCache already shows a toast for API errors
    }
  }

  function startCreate() {
    onCancelEdit()
    createMutation.reset()
    updateMutation.reset()
  }

  return {
    isEditing,
    editingEntryId: editingEntry?.id ?? null,
    form,
    updateField,
    submit,
    startCreate,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  }
}
