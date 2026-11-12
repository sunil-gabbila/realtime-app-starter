import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'

describe('StockWise app shell', () => {
  it('shows the inventory overview and primary navigation', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Inventory overview' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Products' })).toBeInTheDocument()
  })

  it('opens a workspace placeholder from the navigation', () => {
    render(<App />)

    const navigation = screen.getByRole('navigation', { name: 'Main navigation' })
    fireEvent.click(within(navigation).getByRole('button', { name: 'Products' }))

    expect(screen.getByRole('heading', { name: 'Products' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Products is being set up' })).toBeInTheDocument()
  })
})
