import { Download, FileText, Search, X } from 'lucide-react'
import { TransactionTableView } from '../../components/TransactionTableView.jsx'

/* --------------------------------------------------------------------------
   VIEW 4: ACTIVITY & STATEMENTS
   -------------------------------------------------------------------------- */
export function ActivitySection({
  transactions,
  allTransactionsCount,
  activityFilter,
  setActivityFilter,
  searchQuery,
  setSearchQuery,
  onExport,
  formatMoney,
  onViewReceipt,
}) {
  return (
    <section className="content-card-panel">
      <div className="panel-header-row" style={{ flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h2>Account Statement & Timeline</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            Showing {transactions.length} of {allTransactionsCount} total records
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="search-box-container">
            <Search size={15} color="#64748b" />
            <input
              type="text"
              placeholder="Search description, amount..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search transactions"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="panel-filter-pills">
            {['ALL', 'DEPOSITS', 'WITHDRAWALS', 'LOANS', 'EMI'].map((filt) => (
              <button
                key={filt}
                type="button"
                className={`filter-pill-btn ${activityFilter === filt ? 'active' : ''}`}
                onClick={() => setActivityFilter(filt)}
              >
                {filt}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={onExport}
            disabled={!transactions.length}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {transactions.length > 0 ? (
        <TransactionTableView
          transactions={transactions}
          formatMoney={formatMoney}
          onViewReceipt={onViewReceipt}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
          <FileText size={32} style={{ margin: '0 auto 8px', color: '#94a3b8' }} />
          <h4 style={{ color: '#0f172a', fontSize: '14px' }}>No matching records found</h4>
          <p style={{ fontSize: '12px' }}>Try clearing the search query or changing your filter criteria.</p>
        </div>
      )}
    </section>
  )
}
