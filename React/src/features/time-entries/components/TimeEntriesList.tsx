import { memo } from 'react'
import { getAccentColor } from '../../../shared/utils/accentColor'
import { formatDuration, formatTimeRange } from '../../../shared/utils/duration'
import type { TimeEntry } from '../../../types/api'
import './TimeEntriesList.css'

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
    <section className="time-entries-panel">
      <header className="time-entries-panel__header">
        <div>
          <h2>Time Entries</h2>
          <span className="time-entries-panel__pill">
            {selectedTaskId !== null
              ? `Task ${selectedTaskId}`
              : 'Create your time entries here'}
          </span>
        </div>
        <div className="time-entries-panel__pagination">
          <button type="button" onClick={onPrevious} disabled={!hasPrevious || loading}>
            Prev
          </button>
          <span>Page {page}</span>
          <button type="button" onClick={onNext} disabled={!hasNext || loading}>
            Next
          </button>
        </div>
      </header>

      <div className="time-entries-panel__body">
        {loading && <p className="time-entries-panel__status">Loading time entries…</p>}
        {error && <p className="time-entries-panel__status">{error}</p>}
        {!loading && !error && timeEntries.length === 0 && (
          <p className="time-entries-panel__empty">
            {selectedTaskId !== null
              ? 'No time entries for this task'
              : 'No time entries found'}
          </p>
        )}

        {!loading &&
          !error &&
          timeEntries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="time-entry-block"
              style={{ background: getAccentColor(entry.taskId) }}
              onClick={() => onEdit(entry)}
            >
              <div className="time-entry-block__top">
                <span className="time-entry-block__title">
                  {entry.comment || `Entry #${entry.id}`}
                </span>
                <span className="time-entry-block__duration">
                  {formatDuration(entry.start, entry.end)}
                </span>
              </div>
              <div className="time-entry-block__meta">
                <span>Task {entry.taskId}</span>
                <span>{formatTimeRange(entry.start, entry.end)}</span>
              </div>
            </button>
          ))}
      </div>
    </section>
  )
})
