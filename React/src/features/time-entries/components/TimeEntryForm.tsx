import type { TimeEntry } from '../../../types/api'
import { useTimeEntryFormViewModel } from '../hooks/useTimeEntryForm'
import './TimeEntryForm.css'

type TimeEntryFormProps = {
  selectedTaskId: number | null
  editingEntry: TimeEntry | null
  onCancelEdit: () => void
}

export function TimeEntryForm({
  selectedTaskId,
  editingEntry,
  onCancelEdit,
}: TimeEntryFormProps) {
  const {
    isEditing,
    editingEntryId,
    form,
    updateField,
    submit,
    startCreate,
    isSubmitting,
    validationError,
    apiErrorMessage,
    successMessage,
  } = useTimeEntryFormViewModel({
    selectedTaskId,
    editingEntry,
    onCancelEdit,
  })

  return (
    <section className="time-entry-form-panel">
      <header className="time-entry-form-panel__header">
        <h2>{isEditing ? `Update #${editingEntryId}` : 'New time entry'}</h2>
        {isEditing && (
          <button type="button" className="time-entry-form-panel__secondary" onClick={startCreate}>
            New entry
          </button>
        )}
      </header>

      <form className="time-entry-form-panel__body" onSubmit={submit}>
        <label>
          Task ID
          <input
            type="number"
            min={1}
            required
            value={form.taskId}
            onChange={(event) => updateField('taskId', event.target.value)}
          />
        </label>

        <label>
          Comment
          <input
            type="text"
            required
            value={form.comment}
            onChange={(event) => updateField('comment', event.target.value)}
          />
        </label>

        <label>
          Start
          <input
            type="datetime-local"
            required
            value={form.start}
            onChange={(event) => updateField('start', event.target.value)}
          />
        </label>

        <label>
          End
          <input
            type="datetime-local"
            required
            value={form.end}
            onChange={(event) => updateField('end', event.target.value)}
          />
        </label>

        <button type="submit" className="time-entry-form-panel__submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : isEditing ? 'Update entry' : 'Create entry'}
        </button>
      </form>

      {validationError && (
        <p className="time-entry-form-panel__message time-entry-form-panel__message--error">
          {validationError}
        </p>
      )}
      {apiErrorMessage && (
        <p className="time-entry-form-panel__message time-entry-form-panel__message--error">
          {apiErrorMessage}
        </p>
      )}
      {successMessage && (
        <p className="time-entry-form-panel__message time-entry-form-panel__message--success">
          {successMessage}
        </p>
      )}
    </section>
  )
}
