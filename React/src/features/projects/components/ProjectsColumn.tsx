import { memo } from 'react'
import { PanelPagination } from '../../../shared/components/PanelPagination'
import { getAccentColor } from '../../../shared/utils/accentColor'
import type { Project } from '../../../types/api'
import './ProjectsColumn.css'

type ProjectsColumnProps = {
  projects: Project[]
  selectedId: number | null
  hasClient: boolean
  loading: boolean
  isFetching?: boolean
  error: string | null
  page: number
  hasPrevious: boolean
  hasNext: boolean
  onPrevious: () => void
  onNext: () => void
  onSelect: (project: Project) => void
}

export const ProjectsColumn = memo(function ProjectsColumn({
  projects,
  selectedId,
  hasClient,
  loading,
  isFetching = false,
  error,
  page,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onSelect,
}: ProjectsColumnProps) {
  const showInitialLoading = hasClient && loading && projects.length === 0

  return (
    <section className="projects-panel">
      <header className="projects-panel__header">
        <h2>Projects</h2>
      </header>

      <div className={`projects-panel__body${isFetching ? ' is-fetching' : ''}`}>
        {!hasClient && <p className="projects-panel__empty">Select a client</p>}
        {showInitialLoading && <p className="projects-panel__status">Loading projects…</p>}
        {hasClient && error && <p className="projects-panel__status">{error}</p>}
        {hasClient && !showInitialLoading && !error && projects.length === 0 && (
          <p className="projects-panel__empty">No projects found</p>
        )}
        {hasClient &&
          !showInitialLoading &&
          !error &&
          projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className={`projects-panel__item${selectedId === project.id ? ' is-active' : ''}`}
              onClick={() => onSelect(project)}
            >
              <span
                className="projects-panel__accent"
                style={{ background: getAccentColor(project.id) }}
              />
              <span className="projects-panel__item-content">
                <span className="projects-panel__item-title">{project.name}</span>
                <span className="projects-panel__item-meta">{project.status}</span>
              </span>
            </button>
          ))}
      </div>

      {hasClient && (
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
