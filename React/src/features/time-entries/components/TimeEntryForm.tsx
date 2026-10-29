import type { Task, TimeEntry } from "../../../types/api";
import { useTimeEntryFormViewModel } from "../hooks/useTimeEntryForm";
import "./TimeEntryForm.css";

type TimeEntryFormProps = {
  tasks: Task[];
  selectedTaskId: number | null;
  editingEntry: TimeEntry | null;
  onCancelEdit: () => void;
};

export function TimeEntryForm({
  tasks,
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
  } = useTimeEntryFormViewModel({
    selectedTaskId,
    editingEntry,
    onCancelEdit,
  });

  const hasSelectedTaskOption =
    form.taskId !== "" && tasks.some((task) => String(task.id) === form.taskId);

  return (
    <section className="time-entry-form-panel" data-testid="time-entry-form">
      <header className="time-entry-form-panel__header">
        <h2>{isEditing ? `Update #${editingEntryId}` : "New time entry"}</h2>
        {isEditing && (
          <button
            type="button"
            data-testid="new-entry-button"
            className="time-entry-form-panel__secondary"
            onClick={startCreate}
          >
            New entry
          </button>
        )}
      </header>

      <form className="time-entry-form-panel__body" onSubmit={submit}>
        <label>
          Task
          <select
            required
            data-testid="task-select"
            value={form.taskId}
            onChange={(event) => updateField("taskId", event.target.value)}
          >
            <option value="" disabled>
              {tasks.length === 0
                ? "Select a project to load tasks"
                : "Select a task"}
            </option>
            {form.taskId && !hasSelectedTaskOption && (
              <option value={form.taskId}>Task #{form.taskId}</option>
            )}
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.name} (#{task.id})
              </option>
            ))}
          </select>
        </label>

        <label>
          Comment
          <input
            type="text"
            required
            data-testid="comment-input"
            value={form.comment}
            onChange={(event) => updateField("comment", event.target.value)}
          />
        </label>

        <label>
          Start
          <input
            type="datetime-local"
            required
            data-testid="start-input"
            value={form.start}
            onChange={(event) => updateField("start", event.target.value)}
          />
        </label>

        <label>
          End
          <input
            type="datetime-local"
            required
            data-testid="end-input"
            value={form.end}
            onChange={(event) => updateField("end", event.target.value)}
          />
        </label>

        <button
          type="submit"
          data-testid="submit-entry-button"
          className="time-entry-form-panel__submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving…"
            : isEditing
              ? "Update entry"
              : "Create entry"}
        </button>
      </form>
    </section>
  );
}
