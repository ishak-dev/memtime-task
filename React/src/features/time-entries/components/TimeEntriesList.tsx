import { memo } from 'react'
import type { TimeEntry } from '../../../types/api'

type TimeEntriesListProps = {
  timeEntries: TimeEntry[]
  loading: boolean
  error: string | null
  limit: number
  offset: number
  hasNext: boolean
  selectedTaskId: number | null
  onPrevious: () => void
  onNext: () => void
  onEdit: (entry: TimeEntry) => void
}

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

export const TimeEntriesList = memo(function TimeEntriesList({
  timeEntries,
  loading,
  error,
  limit,
  offset,
  hasNext,
  selectedTaskId,
  onPrevious,
  onNext,
  onEdit,
}: TimeEntriesListProps) {
  const page = Math.floor(offset / limit) + 1
  const hasPrevious = offset > 0

  return (
    <section className="time-entries">
      <header className="time-entries-header">
        <h2>
          Time Entries
          {selectedTaskId !== null ? ` · Task ${selectedTaskId}` : ''}
        </h2>
        <div className="pagination">
          <button type="button" onClick={onPrevious} disabled={!hasPrevious || loading}>
            Previous
          </button>
          <span>Page {page}</span>
          <button type="button" onClick={onNext} disabled={!hasNext || loading}>
            Next
          </button>
        </div>
      </header>

      {loading && <p className="column-status">Loading time entries…</p>}
      {error && <p className="column-status">{error}</p>}
      {!loading && !error && timeEntries.length === 0 && (
        <p className="column-empty">
          {selectedTaskId !== null
            ? 'No time entries for this task'
            : 'No time entries found'}
        </p>
      )}

      {!loading && !error && timeEntries.length > 0 && (
        <div className="table-wrap">
          <table className="time-entries-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task ID</th>
                <th>Comment</th>
                <th>Start</th>
                <th>End</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.taskId}</td>
                  <td>{entry.comment}</td>
                  <td>{formatDate(entry.start)}</td>
                  <td>{formatDate(entry.end)}</td>
                  <td>{formatDate(entry.createdAt)}</td>
                  <td>
                    <button type="button" className="link-button" onClick={() => onEdit(entry)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
})
