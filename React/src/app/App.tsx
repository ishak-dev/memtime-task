import { useCallback, useMemo, useState } from 'react'
import { ClientsColumn } from '../features/clients/components/ClientsColumn'
import { useClients } from '../features/clients/hooks/useClients'
import { ProjectsColumn } from '../features/projects/components/ProjectsColumn'
import { useClientProjects } from '../features/projects/hooks/useClientProjects'
import { TasksColumn } from '../features/tasks/components/TasksColumn'
import { useProjectTasks } from '../features/tasks/hooks/useProjectTasks'
import { TimeEntriesList } from '../features/time-entries/components/TimeEntriesList'
import { useTaskTimeEntries } from '../features/time-entries/hooks/useTaskTimeEntries'
import { useTimeEntries } from '../features/time-entries/hooks/useTimeEntries'
import type { Client, PaginationParams, Project, Task } from '../types/api'
import './App.css'

const LIST_PARAMS: PaginationParams = { limit: 50 }
const TIME_ENTRIES_LIMIT = 10

function App() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [timeEntriesOffset, setTimeEntriesOffset] = useState(0)

  const { clients, loading: clientsLoading, error: clientsError } = useClients(LIST_PARAMS)
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useClientProjects(selectedClientId, LIST_PARAMS)
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useProjectTasks(selectedProjectId, LIST_PARAMS)

  const allEntriesQuery = useTimeEntries(
    { limit: TIME_ENTRIES_LIMIT, offset: timeEntriesOffset },
    selectedTaskId === null,
  )
  const taskEntriesQuery = useTaskTimeEntries(selectedTaskId)

  const displayedTimeEntries = useMemo(() => {
    if (selectedTaskId !== null) {
      return taskEntriesQuery.timeEntries.slice(
        timeEntriesOffset,
        timeEntriesOffset + TIME_ENTRIES_LIMIT,
      )
    }

    return allEntriesQuery.timeEntries
  }, [
    selectedTaskId,
    taskEntriesQuery.timeEntries,
    allEntriesQuery.timeEntries,
    timeEntriesOffset,
  ])

  const timeEntriesLoading =
    selectedTaskId !== null ? taskEntriesQuery.loading : allEntriesQuery.loading
  const timeEntriesError =
    selectedTaskId !== null ? taskEntriesQuery.error : allEntriesQuery.error

  const hasNextTimeEntries =
    selectedTaskId !== null
      ? timeEntriesOffset + TIME_ENTRIES_LIMIT < taskEntriesQuery.timeEntries.length
      : allEntriesQuery.timeEntries.length === TIME_ENTRIES_LIMIT

  const handleSelectClient = useCallback((client: Client) => {
    setSelectedClientId(client.id)
    setSelectedProjectId(null)
    setSelectedTaskId(null)
    setTimeEntriesOffset(0)
  }, [])

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProjectId(project.id)
    setSelectedTaskId(null)
    setTimeEntriesOffset(0)
  }, [])

  const handleSelectTask = useCallback((task: Task) => {
    setSelectedTaskId(task.id)
    setTimeEntriesOffset(0)
  }, [])

  const handlePreviousPage = useCallback(() => {
    setTimeEntriesOffset((current) => Math.max(0, current - TIME_ENTRIES_LIMIT))
  }, [])

  const handleNextPage = useCallback(() => {
    setTimeEntriesOffset((current) => current + TIME_ENTRIES_LIMIT)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Memtime</h1>
      </header>

      <main className="columns">
        <ClientsColumn
          clients={clients}
          selectedId={selectedClientId}
          loading={clientsLoading}
          error={clientsError}
          onSelect={handleSelectClient}
        />
        <ProjectsColumn
          projects={projects}
          selectedId={selectedProjectId}
          hasClient={selectedClientId !== null}
          loading={projectsLoading}
          error={projectsError}
          onSelect={handleSelectProject}
        />
        <TasksColumn
          tasks={tasks}
          selectedId={selectedTaskId}
          hasProject={selectedProjectId !== null}
          loading={tasksLoading}
          error={tasksError}
          onSelect={handleSelectTask}
        />
      </main>

      <TimeEntriesList
        timeEntries={displayedTimeEntries}
        loading={timeEntriesLoading}
        error={timeEntriesError}
        limit={TIME_ENTRIES_LIMIT}
        offset={timeEntriesOffset}
        hasNext={hasNextTimeEntries}
        selectedTaskId={selectedTaskId}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
      />
    </div>
  )
}

export default App
