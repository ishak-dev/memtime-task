import { memo } from 'react'
import type { Client } from '../../../types/api'
import './ClientsColumn.css'

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
    <section className="clients-panel">
      <header className="clients-panel__header">
        <h2>Clients</h2>
        <span className="clients-panel__pill">Browse hierarchy</span>
      </header>

      <div className="clients-panel__body">
        {loading && <p className="clients-panel__status">Loading clients…</p>}
        {error && <p className="clients-panel__status">{error}</p>}
        {!loading && !error && clients.length === 0 && (
          <p className="clients-panel__empty">No clients found</p>
        )}
        {!loading &&
          !error &&
          clients.map((client) => (
            <button
              key={client.id}
              type="button"
              className={`clients-panel__item${selectedId === client.id ? ' is-active' : ''}`}
              onClick={() => onSelect(client)}
            >
              <span className="clients-panel__item-main">
                <span className="clients-panel__item-title">{client.name}</span>
                <span className="clients-panel__item-meta">{client.status}</span>
              </span>
            </button>
          ))}
      </div>

      <footer className="clients-panel__footer">Select a client to load projects</footer>
    </section>
  )
})
