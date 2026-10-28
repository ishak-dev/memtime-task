import './PanelPagination.css'

type PanelPaginationProps = {
  page: number
  hasPrevious: boolean
  hasNext: boolean
  loading?: boolean
  onPrevious: () => void
  onNext: () => void
}

export function PanelPagination({
  page,
  hasPrevious,
  hasNext,
  loading = false,
  onPrevious,
  onNext,
}: PanelPaginationProps) {
  return (
    <div className="panel-pagination">
      <button type="button" onClick={onPrevious} disabled={!hasPrevious || loading}>
        Prev
      </button>
      <span>Page {page}</span>
      <button type="button" onClick={onNext} disabled={!hasNext || loading}>
        Next
      </button>
    </div>
  )
}
