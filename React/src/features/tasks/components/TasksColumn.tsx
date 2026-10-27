import type { Task } from '../../../types/api'

type TasksColumnProps = {
  tasks: Task[]
  hasProject: boolean
  loading: boolean
  error: string | null
}

export function TasksColumn({ tasks, hasProject, loading, error }: TasksColumnProps) {
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
            <div key={task.id} className="list-item">
              <span className="list-item-title">{task.name}</span>
              <span className="list-item-meta">{task.status}</span>
            </div>
          ))}
      </div>
    </section>
  )
}
