import { useState } from 'react'
import './App.css'

const navigation = [
  { id: 'overview', label: 'Overview', icon: '◫' },
  { id: 'products', label: 'Products', icon: '▦' },
  { id: 'inventory', label: 'Inventory', icon: '↕' },
  { id: 'sales', label: 'Sales', icon: '⌁' },
  { id: 'reports', label: 'Reports', icon: '▤' },
]

const metrics = [
  { label: 'Products in catalog', value: '—', note: 'Your catalog is getting ready', tone: 'blue' },
  { label: 'Items low in stock', value: '—', note: 'Reorder reminders will show here', tone: 'amber' },
  { label: 'Stock movements today', value: '—', note: 'Daily activity will show here', tone: 'green' },
]

function App() {
  const [activePage, setActivePage] = useState('overview')
  const currentPage = navigation.find((item) => item.id === activePage)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" onClick={() => setActivePage('overview')}>
          <span className="brand-mark" aria-hidden="true">S</span>
          <span className="brand-copy">
            <strong>stockwise</strong>
            <small>INVENTORY WORKSPACE</small>
          </span>
        </a>

        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              className={`nav-item${activePage === item.id ? ' is-active' : ''}`}
              key={item.id}
              type="button"
              aria-current={activePage === item.id ? 'page' : undefined}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
              {item.id === 'overview' && <span className="active-dot" aria-hidden="true" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="store-avatar" aria-hidden="true">KS</div>
          <div className="store-copy">
            <strong>My store</strong>
            <span>Workspace setup</span>
          </div>
          <span className="more-icon" aria-hidden="true">···</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-divider">/</span><strong>{currentPage.label}</strong></div>
          <div className="topbar-right">
            <span className="connection-status"><span className="status-dot" /> Local workspace</span>
            <button className="profile-button" type="button" aria-label="Account menu">S</button>
          </div>
        </header>

        {activePage === 'overview' ? (
          <section className="page-content" aria-labelledby="page-title">
            <div className="page-heading">
              <div>
                <p className="eyebrow">YOUR STORE, AT A GLANCE</p>
                <h1 id="page-title">Inventory overview</h1>
                <p className="page-description">A clear view of your products, stock, and daily activity.</p>
              </div>
              <div className="heading-actions">
                <button className="button button-secondary" type="button" onClick={() => setActivePage('inventory')}>
                  <span aria-hidden="true">↕</span> Adjust stock
                </button>
                <button className="button button-primary" type="button" onClick={() => setActivePage('products')}>
                  <span aria-hidden="true">＋</span> Add product
                </button>
              </div>
            </div>

            <div className="metrics-grid">
              {metrics.map((metric) => (
                <article className="metric-card" key={metric.label}>
                  <div className="metric-topline">
                    <span>{metric.label}</span>
                    <span className={`metric-marker ${metric.tone}`} aria-hidden="true" />
                  </div>
                  <strong className="metric-value">{metric.value}</strong>
                  <span className="metric-note">{metric.note}</span>
                </article>
              ))}
            </div>

            <div className="content-grid">
              <section className="panel stock-panel" aria-labelledby="stock-title">
                <div className="panel-heading">
                  <div>
                    <h2 id="stock-title">Stock to watch</h2>
                    <p>Products approaching their reorder level</p>
                  </div>
                  <button className="text-button" type="button" onClick={() => setActivePage('inventory')}>View inventory <span aria-hidden="true">→</span></button>
                </div>
                <div className="empty-state">
                  <span className="empty-icon" aria-hidden="true">▤</span>
                  <strong>Your stock alerts will appear here</strong>
                  <span>Add products and set reorder levels to keep an eye on stock.</span>
                </div>
              </section>

              <section className="panel activity-panel" aria-labelledby="activity-title">
                <div className="panel-heading">
                  <div>
                    <h2 id="activity-title">Recent activity</h2>
                    <p>Latest changes in your store</p>
                  </div>
                  <span className="activity-clock" aria-hidden="true">◷</span>
                </div>
                <div className="activity-empty">
                  <span className="activity-line" aria-hidden="true" />
                  <span>No activity yet</span>
                  <small>Stock updates and sales will show here.</small>
                </div>
              </section>
            </div>

            <section className="getting-started" aria-label="Getting started">
              <div className="getting-icon" aria-hidden="true">✳</div>
              <div className="getting-copy">
                <strong>Start with your product catalog</strong>
                <span>Add your first products to begin tracking stock in StockWise.</span>
              </div>
              <button className="text-button getting-link" type="button" onClick={() => setActivePage('products')}>Open products <span aria-hidden="true">→</span></button>
            </section>
          </section>
        ) : (
          <section className="page-content placeholder-page" aria-labelledby="page-title">
            <p className="eyebrow">STOCKWISE WORKSPACE</p>
            <h1 id="page-title">{currentPage.label}</h1>
            <div className="placeholder-card">
              <span className="placeholder-symbol" aria-hidden="true">{currentPage.icon}</span>
              <h2>{currentPage.label} is being set up</h2>
              <p>This area will connect to your inventory data as we build the next project features.</p>
              <button className="button button-secondary" type="button" onClick={() => setActivePage('overview')}>Back to overview</button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
