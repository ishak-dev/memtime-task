import type { TimeEntry } from '../../../types/api'
import { useTimeEntryFormViewModel } from '../hooks/useTimeEntryForm'

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
    <section className="time-entry-form">
      <header className="time-entry-form-header">
        <h2>
          {isEditing ? `Update Time Entry #${editingEntryId}` : 'Create New Time Entry'}
        </h2>
        {isEditing && (
          <button type="button" className="secondary-button" onClick={startCreate}>
            New entry
          </button>
        )}
      </header>

      <form className="time-entry-form-body" onSubmit={submit}>
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

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : isEditing ? 'Update entry' : 'Create entry'}
        </button>
      </form>

      {validationError && <p className="form-message form-message-error">{validationError}</p>}
      {apiErrorMessage && <p className="form-message form-message-error">{apiErrorMessage}</p>}
      {successMessage && <p className="form-message form-message-success">{successMessage}</p>}
    </section>
  )
}
