import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('StockWise app shell', () => {
  it('shows the inventory overview and primary navigation', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Inventory overview' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Products' })).toBeInTheDocument()
  })

  it('opens the product catalog from the navigation', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }))
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })
    fireEvent.click(within(navigation).getByRole('button', { name: 'Products' }))

    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Catalog' })).toBeInTheDocument()
    expect(await screen.findByText('Your catalog is empty')).toBeInTheDocument()
  })
})
