import type { Project } from '../../../types/api'

type ProjectsColumnProps = {
  projects: Project[]
  selectedId: number | null
  hasClient: boolean
  loading: boolean
  error: string | null
  onSelect: (project: Project) => void
}

export function ProjectsColumn({
  projects,
  selectedId,
  hasClient,
  loading,
  error,
  onSelect,
}: ProjectsColumnProps) {
  return (
    <section className="column">
      <header className="column-header">Projects</header>
      <div className="column-body">
        {!hasClient && <p className="column-empty">Select a client</p>}
        {hasClient && loading && <p className="column-status">Loading projects…</p>}
        {hasClient && error && <p className="column-status">{error}</p>}
        {hasClient && !loading && !error && projects.length === 0 && (
          <p className="column-empty">No projects found</p>
        )}
        {hasClient &&
          !loading &&
          !error &&
          projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className={`list-item${selectedId === project.id ? ' active' : ''}`}
              onClick={() => onSelect(project)}
            >
              <span className="list-item-title">{project.name}</span>
              <span className="list-item-meta">{project.status}</span>
            </button>
          ))}
      </div>
    </section>
  )
}
