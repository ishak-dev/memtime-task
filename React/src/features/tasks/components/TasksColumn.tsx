import { memo } from 'react'
import type { Task } from '../../../types/api'

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
    <section className="column">
      <header className="column-header">Tasks</header>
      <div className="column-body">
        {!hasProject && <p className="column-empty">Select a project</p>}
        {hasProject && loading && <p className="column-status">Loading tasks…</p>}
        {hasProject && error && <p className="column-status">{error}</p>}
        {hasProject && !loading && !error && tasks.length === 0 && (
          <p className="column-empty">No tasks found</p>
        )}
        {hasProject &&
          !loading &&
          !error &&
          tasks.map((task) => (
            <button
              key={task.id}
              type="button"
              className={`list-item${selectedId === task.id ? ' active' : ''}`}
              onClick={() => onSelect(task)}
            >
              <span className="list-item-title">{task.name}</span>
              <span className="list-item-meta">{task.status}</span>
            </button>
          ))}
      </div>
    </section>
  )
})
