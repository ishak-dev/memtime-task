import { memo } from 'react'
import type { Client } from '../../../types/api'

type ClientsColumnProps = {
  clients: Client[]
  selectedId: number | null
  loading: boolean
  error: string | null
  onSelect: (client: Client) => void
}

export const ClientsColumn = memo(function ClientsColumn({
  clients,
  selectedId,
  loading,
  error,
  onSelect,
}: ClientsColumnProps) {
  return (
    <section className="column">
      <header className="column-header">Clients</header>
      <div className="column-body">
        {loading && <p className="column-status">Loading clients…</p>}
        {error && <p className="column-status">{error}</p>}
        {!loading && !error && clients.length === 0 && (
          <p className="column-empty">No clients found</p>
        )}
        {!loading &&
          !error &&
          clients.map((client) => (
            <button
              key={client.id}
              type="button"
              className={`list-item${selectedId === client.id ? ' active' : ''}`}
              onClick={() => onSelect(client)}
            >
              <span className="list-item-title">{client.name}</span>
              <span className="list-item-meta">{client.status}</span>
            </button>
          ))}
      </div>
    </section>
  )
})
