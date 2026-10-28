import { memo } from 'react'
import { PanelPagination } from '../../../shared/components/PanelPagination'
import type { Client } from '../../../types/api'
import './ClientsColumn.css'

type ClientsColumnProps = {
  clients: Client[]
  selectedId: number | null
  loading: boolean
  isFetching?: boolean
  error: string | null
  page: number
  hasPrevious: boolean
  hasNext: boolean
  onPrevious: () => void
  onNext: () => void
  onSelect: (client: Client) => void
}

export const ClientsColumn = memo(function ClientsColumn({
  clients,
  selectedId,
  loading,
  isFetching = false,
  error,
  page,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onSelect,
}: ClientsColumnProps) {
  const showInitialLoading = loading && clients.length === 0

  return (
    <section className="clients-panel">
      <header className="clients-panel__header">
        <h2>Clients</h2>
        <span className="clients-panel__pill">
          {isFetching && !showInitialLoading ? 'Loading…' : 'Browse hierarchy'}
        </span>
      </header>

      <div className={`clients-panel__body${isFetching ? ' is-fetching' : ''}`}>
        {showInitialLoading && <p className="clients-panel__status">Loading clients…</p>}
        {!showInitialLoading && clients.length === 0 && !error && (
          <p className="clients-panel__empty">No clients found</p>
        )}
        {!showInitialLoading &&
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

      <PanelPagination
        page={page}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        loading={isFetching}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </section>
  )
})
