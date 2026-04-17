import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock child components to isolate App rendering logic
vi.mock('#components', () => ({
    Navbar: () => <nav data-testid="navbar" />,
    Welcome: () => <section data-testid="welcome" />,
    Dock: () => <section data-testid="dock" />,
}))

// Import App after mocks are established
import App from '../App.jsx'

describe('App component', () => {
    it('renders a <main> root element', () => {
        render(<App />)
        expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('renders the Navbar component', () => {
        render(<App />)
        expect(screen.getByTestId('navbar')).toBeInTheDocument()
    })

    it('renders the Welcome component', () => {
        render(<App />)
        expect(screen.getByTestId('welcome')).toBeInTheDocument()
    })

    it('renders the Dock component', () => {
        render(<App />)
        expect(screen.getByTestId('dock')).toBeInTheDocument()
    })

    it('renders Navbar, Welcome, and Dock inside the same main element', () => {
        render(<App />)
        const main = screen.getByRole('main')
        expect(main).toContainElement(screen.getByTestId('navbar'))
        expect(main).toContainElement(screen.getByTestId('welcome'))
        expect(main).toContainElement(screen.getByTestId('dock'))
    })

    it('renders Dock after Welcome in document order', () => {
        render(<App />)
        const welcome = screen.getByTestId('welcome')
        const dock = screen.getByTestId('dock')
        // compareDocumentPosition: FOLLOWING = 4
        expect(welcome.compareDocumentPosition(dock) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    })
})