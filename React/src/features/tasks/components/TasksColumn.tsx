import { memo } from 'react'
import { PanelPagination } from '../../../shared/components/PanelPagination'
import type { Task } from '../../../types/api'
import './TasksColumn.css'

type TasksColumnProps = {
  tasks: Task[]
  selectedId: number | null
  hasProject: boolean
  loading: boolean
  isFetching?: boolean
  error: string | null
  page: number
  hasPrevious: boolean
  hasNext: boolean
  onPrevious: () => void
  onNext: () => void
  onSelect: (task: Task) => void
}

export const TasksColumn = memo(function TasksColumn({
  tasks,
  selectedId,
  hasProject,
  loading,
  isFetching = false,
  error,
  page,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onSelect,
}: TasksColumnProps) {
  const showInitialLoading = hasProject && loading && tasks.length === 0

  return (
    <section className="tasks-panel">
      <header className="tasks-panel__header">
        <h2>Tasks</h2>
        <span className="tasks-panel__pill">
          {isFetching && !showInitialLoading ? 'Loading…' : 'Filter time entries'}
        </span>
      </header>

      <div className={`tasks-panel__body${isFetching ? ' is-fetching' : ''}`}>
        {!hasProject && <p className="tasks-panel__empty">Select a project</p>}
        {showInitialLoading && <p className="tasks-panel__status">Loading tasks…</p>}
        {hasProject && !showInitialLoading && tasks.length === 0 && !error && (
          <p className="tasks-panel__empty">No tasks found</p>
        )}
        {hasProject &&
          !showInitialLoading &&
          tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              className={`tasks-panel__item${selectedId === task.id ? ' is-active' : ''}`}
              onClick={() => onSelect(task)}
            >
              <span className="tasks-panel__item-title">{task.name}</span>
              <span className="tasks-panel__item-meta">{task.status}</span>
            </button>
          ))}
      </div>

      {hasProject && (
        <PanelPagination
          page={page}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          loading={isFetching}
          onPrevious={onPrevious}
          onNext={onNext}
        />
      )}
    </section>
  )
})
