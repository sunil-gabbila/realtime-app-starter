import { useEffect, useState } from 'react'
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
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [productsError, setProductsError] = useState('')
  const [refreshProductsKey, setRefreshProductsKey] = useState(0)
  const [showProductForm, setShowProductForm] = useState(false)
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productQuantity, setProductQuantity] = useState('0')
  const [inventoryError, setInventoryError] = useState('')
  const [productFormError, setProductFormError] = useState('')
  const [productNotice, setProductNotice] = useState('')
  const [productSaving, setProductSaving] = useState(false)
  const currentPage = navigation.find((item) => item.id === activePage)

  useEffect(() => {
    if (activePage !== 'products' && activePage !== 'inventory') return undefined

    let isCurrentRequest = true
    setProductsLoading(true)
    setProductsError('')

    fetch('/api/items')
      .then(async (response) => {
        const result = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(result?.message || 'Products could not be loaded.')
        }
        if (!Array.isArray(result)) {
          throw new Error('The product list response was not in the expected format.')
        }
        return result
      })
      .then((loadedProducts) => {
        if (isCurrentRequest) setProducts(loadedProducts)
      })
      .catch((error) => {
        if (isCurrentRequest) setProductsError(error.message || 'Products could not be loaded.')
      })
      .finally(() => {
        if (isCurrentRequest) setProductsLoading(false)
      })

    return () => {
      isCurrentRequest = false
    }
  }, [activePage, refreshProductsKey])

  async function handleProductSubmit(event) {
    event.preventDefault()
    const name = productName.trim()
    const description = productDescription.trim()
    const quantity = Number(productQuantity)

    if (!name) {
      setProductFormError('Product name is required.')
      return
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
      setProductFormError('Stock quantity must be a whole number of zero or more.')
      return
    }

    setProductSaving(true)
    setProductFormError('')
    setProductNotice('')

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, quantity }),
      })
      const result = await response.json().catch(() => null)

      if (!response.ok) {
        const fallbackMessage = response.status === 409
          ? 'A product with this name already exists. Please choose a different name.'
          : 'Product could not be added.'
        throw new Error(result?.message || fallbackMessage)
      }

      setProducts((currentProducts) =>
        [...currentProducts, result].sort((left, right) => left.name.localeCompare(right.name)),
      )
      setProductName('')
      setProductDescription('')
      setProductQuantity('0')
      setShowProductForm(false)
      setProductNotice(`${result.name} was added to the catalog.`)
    } catch (error) {
      setProductFormError(error.message || 'Product could not be added. Check that the API is running and try again.')
    } finally {
      setProductSaving(false)
    }
  }

  async function adjustQuantity(product, change) {
    const quantity = product.quantity + change
    if (quantity < 0) return
    setInventoryError('')
    try {
      const response = await fetch(`/api/items/${product.id}/quantity`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok) throw new Error(result?.message || 'Stock could not be updated.')
      setProducts((current) => current.map((item) => item.id === result.id ? result : item))
    } catch (error) {
      setInventoryError(error.message || 'Stock could not be updated.')
    }
  }

  function openProductForm() {
    setProductFormError('')
    setProductNotice('')
    setShowProductForm(true)
    setActivePage('products')
  }

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
                <button className="button button-primary" type="button" onClick={openProductForm}>
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
        ) : activePage === 'products' ? (
          <section className="page-content products-page" aria-labelledby="page-title">
            <div className="page-heading">
              <div>
                <p className="eyebrow">PRODUCT CATALOG</p>
                <h1 id="page-title">Products</h1>
                <p className="page-description">Add products and keep your store catalog up to date.</p>
              </div>
              <div className="heading-actions">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => setRefreshProductsKey((key) => key + 1)}
                  disabled={productsLoading}
                >
                  ↻ Refresh
                </button>
                <button className="button button-primary" type="button" onClick={openProductForm}>
                  <span aria-hidden="true">＋</span> Add product
                </button>
              </div>
            </div>

            {productNotice && <p className="product-notice" role="status">{productNotice}</p>}

            {showProductForm && (
              <section className="panel product-form-panel" aria-labelledby="add-product-title">
                <div className="panel-heading">
                  <div>
                    <h2 id="add-product-title">Add a product</h2>
                    <p>Enter the details you want to save in your catalog.</p>
                  </div>
                </div>
                <form className="product-form" onSubmit={handleProductSubmit}>
                  <div className="product-form-grid">
                    <label className="form-field" htmlFor="product-name">
                      <span>Product name <span className="required-mark">*</span></span>
                      <input
                        autoFocus
                        id="product-name"
                        name="name"
                        type="text"
                        autoComplete="off"
                        maxLength={120}
                        value={productName}
                        onChange={(event) => setProductName(event.target.value)}
                        placeholder="e.g. Arabica coffee beans"
                        required
                      />
                    </label>
                    <label className="form-field" htmlFor="product-description">
                      <span>Description <span className="optional-label">Optional</span></span>
                      <textarea
                        id="product-description"
                        name="description"
                        rows="3"
                        maxLength={255}
                        value={productDescription}
                        onChange={(event) => setProductDescription(event.target.value)}
                        placeholder="Add a short note about this product"
                      />
                    </label>
                    <label className="form-field" htmlFor="product-quantity">
                      <span>Starting stock</span>
                      <input id="product-quantity" name="quantity" type="number" min="0" step="1" value={productQuantity} onChange={(event) => setProductQuantity(event.target.value)} />
                    </label>
                  </div>
                  {productFormError && <p className="form-error" role="alert">{productFormError}</p>}
                  <div className="form-actions">
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() => {
                        setShowProductForm(false)
                        setProductFormError('')
                      }}
                      disabled={productSaving}
                    >
                      Cancel
                    </button>
                    <button className="button button-primary" type="submit" disabled={productSaving}>
                      {productSaving ? 'Saving…' : 'Save product'}
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="panel product-list-panel" aria-labelledby="catalog-title" aria-busy={productsLoading}>
              <div className="panel-heading">
                <div>
                  <h2 id="catalog-title">Catalog</h2>
                  <p>{products.length} {products.length === 1 ? 'product' : 'products'} saved</p>
                </div>
              </div>

              {productsLoading ? (
                <div className="products-message" role="status">Loading products…</div>
              ) : productsError ? (
                <div className="products-message products-error" role="alert">
                  <strong>Couldn’t load the catalog</strong>
                  <span>{productsError}</span>
                  <button className="text-button" type="button" onClick={() => setRefreshProductsKey((key) => key + 1)}>
                    Try again <span aria-hidden="true">→</span>
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state products-empty-state">
                  <span className="empty-icon" aria-hidden="true">▦</span>
                  <strong>Your catalog is empty</strong>
                  <span>Add your first product to start building your store catalog.</span>
                  <button className="button button-primary" type="button" onClick={openProductForm}>
                    <span aria-hidden="true">＋</span> Add first product
                  </button>
                </div>
              ) : (
                <div className="product-table-wrap">
                  <table className="product-table">
                    <thead>
                      <tr>
                        <th scope="col">Product</th>
                        <th scope="col">Description</th>
                        <th scope="col">In stock</th>
                        <th scope="col">Record</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id}>
                          <td className="product-name-cell">{product.name}</td>
                          <td className="product-description-cell">{product.description || '—'}</td>
                          <td>{product.quantity}</td>
                          <td><span className="product-id">#{product.id}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </section>
        ) : activePage === 'inventory' ? (
          <section className="page-content products-page" aria-labelledby="page-title">
            <div className="page-heading"><div><p className="eyebrow">STOCK CONTROL</p><h1 id="page-title">Inventory</h1><p className="page-description">See current stock and record simple adjustments.</p></div></div>
            {inventoryError && <p className="form-error" role="alert">{inventoryError}</p>}
            {productsLoading ? <div className="products-message" role="status">Loading inventory…</div> : productsError ? <div className="products-message products-error" role="alert">{productsError}</div> : products.length === 0 ? <div className="empty-state"><strong>No products to track yet</strong><span>Add products first, then manage their stock here.</span><button className="button button-primary" type="button" onClick={openProductForm}>Add product</button></div> : (
              <section className="panel product-list-panel"><div className="product-table-wrap"><table className="product-table"><thead><tr><th>Product</th><th>In stock</th><th>Adjust</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td className="product-name-cell">{product.name}</td><td>{product.quantity}</td><td><button className="button button-secondary" type="button" aria-label={`Remove one ${product.name}`} disabled={product.quantity <= 0} onClick={() => adjustQuantity(product, -1)}>−</button> <button className="button button-secondary" type="button" aria-label={`Add one ${product.name}`} onClick={() => adjustQuantity(product, 1)}>＋</button></td></tr>)}</tbody></table></div></section>
            )}
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
