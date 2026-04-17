import { describe, it, expect } from 'vitest'
import * as components from '#components'

describe('src/components/index.js barrel exports', () => {
    it('exports Dock', () => {
        expect(components.Dock).toBeDefined()
    })

    it('exports Dock as a function (React component)', () => {
        expect(typeof components.Dock).toBe('function')
    })

    it('exports Navbar', () => {
        expect(components.Navbar).toBeDefined()
    })

    it('exports Welcome', () => {
        expect(components.Welcome).toBeDefined()
    })

    it('does not export unknown names', () => {
        const exportedKeys = Object.keys(components)
        expect(exportedKeys).toEqual(expect.arrayContaining(['Dock', 'Navbar', 'Welcome']))
        // Confirm no unexpected extra exports were silently added
        exportedKeys.forEach((key) => {
            expect(['Dock', 'Navbar', 'Welcome']).toContain(key)
        })
    })
})