import { memo } from 'react'
import type { Task } from '../../../types/api'
import './TasksColumn.css'

type TasksColumnProps = {
  tasks: Task[]
  selectedId: number | null
  hasProject: boolean
  loading: boolean
  error: string | null
  onSelect: (task: Task) => void
}

export const TasksColumn = memo(function TasksColumn({
  tasks,
  selectedId,
  hasProject,
  loading,
  error,
  onSelect,
}: TasksColumnProps) {
  return (
    <section className="tasks-panel">
      <header className="tasks-panel__header">
        <h2>Tasks</h2>
        <span className="tasks-panel__pill">Filter time entries</span>
      </header>

      <div className="tasks-panel__body">
        {!hasProject && <p className="tasks-panel__empty">Select a project</p>}
        {hasProject && loading && <p className="tasks-panel__status">Loading tasks…</p>}
        {hasProject && error && <p className="tasks-panel__status">{error}</p>}
        {hasProject && !loading && !error && tasks.length === 0 && (
          <p className="tasks-panel__empty">No tasks found</p>
        )}
        {hasProject &&
          !loading &&
          !error &&
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
    </section>
  )
})
