import { useState } from 'react'
import { ClientsColumn } from '../features/clients/components/ClientsColumn'
import { useClients } from '../features/clients/hooks/useClients'
import { ProjectsColumn } from '../features/projects/components/ProjectsColumn'
import { useClientProjects } from '../features/projects/hooks/useClientProjects'
import { TasksColumn } from '../features/tasks/components/TasksColumn'
import { useProjectTasks } from '../features/tasks/hooks/useProjectTasks'
import type { Client, Project } from '../types/api'
import './App.css'

function App() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const { clients, loading: clientsLoading, error: clientsError } = useClients({ limit: 50 })
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useClientProjects(selectedClientId, { limit: 50 })
  const {
    tasks,
    loading: tasksLoading,
    error: tasksError,
  } = useProjectTasks(selectedProjectId, { limit: 50 })

  function handleSelectClient(client: Client) {
    setSelectedClientId(client.id)
    setSelectedProjectId(null)
  }

  function handleSelectProject(project: Project) {
    setSelectedProjectId(project.id)
  }

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
          hasProject={selectedProjectId !== null}
          loading={tasksLoading}
          error={tasksError}
        />
      </main>
    </div>
  )
}

export default App
