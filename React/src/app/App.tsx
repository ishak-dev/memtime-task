import { useCallback, useMemo, useState } from 'react'
import { ClientsColumn } from '../features/clients/components/ClientsColumn'
import { useClients } from '../features/clients/hooks/useClients'
import { ProjectsColumn } from '../features/projects/components/ProjectsColumn'
import { useClientProjects } from '../features/projects/hooks/useClientProjects'
import { TasksColumn } from '../features/tasks/components/TasksColumn'
import { useProjectTasks } from '../features/tasks/hooks/useProjectTasks'
import { TimeEntriesList } from '../features/time-entries/components/TimeEntriesList'
import { TimeEntryForm } from '../features/time-entries/components/TimeEntryForm'
import { useTaskTimeEntries } from '../features/time-entries/hooks/useTaskTimeEntries'
import { useTimeEntries } from '../features/time-entries/hooks/useTimeEntries'
import type { Client, Project, Task, TimeEntry } from '../types/api'
import '../styles/theme.css'
import './App.css'

const LIST_LIMIT = 10
const TIME_ENTRIES_LIMIT = 10

function App() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)

  const [clientsOffset, setClientsOffset] = useState(0)
  const [projectsOffset, setProjectsOffset] = useState(0)
  const [tasksOffset, setTasksOffset] = useState(0)
  const [timeEntriesOffset, setTimeEntriesOffset] = useState(0)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)

  const {
    clients,
    loading: clientsLoading,
    isFetching: clientsFetching,
    error: clientsError,
  } = useClients({
    limit: LIST_LIMIT,
    offset: clientsOffset,
  })
  const {
    projects,
    loading: projectsLoading,
    isFetching: projectsFetching,
    error: projectsError,
  } = useClientProjects(selectedClientId, {
    limit: LIST_LIMIT,
    offset: projectsOffset,
  })
  const {
    tasks,
    loading: tasksLoading,
    isFetching: tasksFetching,
    error: tasksError,
  } = useProjectTasks(selectedProjectId, {
    limit: LIST_LIMIT,
    offset: tasksOffset,
  })

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

  const hasNextClients = clients.length === LIST_LIMIT
  const hasNextProjects = projects.length === LIST_LIMIT
  const hasNextTasks = tasks.length === LIST_LIMIT
  const hasNextTimeEntries =
    selectedTaskId !== null
      ? timeEntriesOffset + TIME_ENTRIES_LIMIT < taskEntriesQuery.timeEntries.length
      : allEntriesQuery.timeEntries.length === TIME_ENTRIES_LIMIT

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    [],
  )

  const handleSelectClient = useCallback((client: Client) => {
    setSelectedClientId(client.id)
    setSelectedProjectId(null)
    setSelectedTaskId(null)
    setProjectsOffset(0)
    setTasksOffset(0)
    setTimeEntriesOffset(0)
    setEditingEntry(null)
  }, [])

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProjectId(project.id)
    setSelectedTaskId(null)
    setTasksOffset(0)
    setTimeEntriesOffset(0)
    setEditingEntry(null)
  }, [])

  const handleSelectTask = useCallback((task: Task) => {
    setSelectedTaskId(task.id)
    setTimeEntriesOffset(0)
  }, [])

  const handlePreviousClients = useCallback(() => {
    setClientsOffset((current) => Math.max(0, current - LIST_LIMIT))
  }, [])

  const handleNextClients = useCallback(() => {
    setClientsOffset((current) => current + LIST_LIMIT)
  }, [])

  const handlePreviousProjects = useCallback(() => {
    setProjectsOffset((current) => Math.max(0, current - LIST_LIMIT))
  }, [])

  const handleNextProjects = useCallback(() => {
    setProjectsOffset((current) => current + LIST_LIMIT)
  }, [])

  const handlePreviousTasks = useCallback(() => {
    setTasksOffset((current) => Math.max(0, current - LIST_LIMIT))
  }, [])

  const handleNextTasks = useCallback(() => {
    setTasksOffset((current) => current + LIST_LIMIT)
  }, [])

  const handlePreviousTimeEntries = useCallback(() => {
    setTimeEntriesOffset((current) => Math.max(0, current - TIME_ENTRIES_LIMIT))
  }, [])

  const handleNextTimeEntries = useCallback(() => {
    setTimeEntriesOffset((current) => current + TIME_ENTRIES_LIMIT)
  }, [])

  const handleEditEntry = useCallback((entry: TimeEntry) => {
    setEditingEntry(entry)
  }, [])

  const handleCancelEdit = useCallback(() => {
    setEditingEntry(null)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">
          <h1>Memtime</h1>
          <span className="app-date">{todayLabel}</span>
        </div>
      </header>

      <section className="app-workspace">
        <ClientsColumn
          clients={clients}
          selectedId={selectedClientId}
          loading={clientsLoading}
          isFetching={clientsFetching}
          error={clientsError}
          page={Math.floor(clientsOffset / LIST_LIMIT) + 1}
          hasPrevious={clientsOffset > 0}
          hasNext={hasNextClients}
          onPrevious={handlePreviousClients}
          onNext={handleNextClients}
          onSelect={handleSelectClient}
        />
        <ProjectsColumn
          projects={projects}
          selectedId={selectedProjectId}
          hasClient={selectedClientId !== null}
          loading={projectsLoading}
          isFetching={projectsFetching}
          error={projectsError}
          page={Math.floor(projectsOffset / LIST_LIMIT) + 1}
          hasPrevious={projectsOffset > 0}
          hasNext={hasNextProjects}
          onPrevious={handlePreviousProjects}
          onNext={handleNextProjects}
          onSelect={handleSelectProject}
        />
        <TasksColumn
          tasks={tasks}
          selectedId={selectedTaskId}
          hasProject={selectedProjectId !== null}
          loading={tasksLoading}
          isFetching={tasksFetching}
          error={tasksError}
          page={Math.floor(tasksOffset / LIST_LIMIT) + 1}
          hasPrevious={tasksOffset > 0}
          hasNext={hasNextTasks}
          onPrevious={handlePreviousTasks}
          onNext={handleNextTasks}
          onSelect={handleSelectTask}
        />
      </section>

      <section className="app-bottom">
        <TimeEntriesList
          timeEntries={displayedTimeEntries}
          loading={timeEntriesLoading}
          error={timeEntriesError}
          limit={TIME_ENTRIES_LIMIT}
          offset={timeEntriesOffset}
          hasNext={hasNextTimeEntries}
          selectedTaskId={selectedTaskId}
          onPrevious={handlePreviousTimeEntries}
          onNext={handleNextTimeEntries}
          onEdit={handleEditEntry}
        />
        <TimeEntryForm
          selectedTaskId={selectedTaskId}
          editingEntry={editingEntry}
          onCancelEdit={handleCancelEdit}
        />
      </section>
    </div>
  )
}

export default App
