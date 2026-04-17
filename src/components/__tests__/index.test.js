import { describe, it, expect, vi } from 'vitest';

// Mock heavy dependencies before importing from index
vi.mock('gsap', () => ({ default: { to: vi.fn() } }));
vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));
// Navbar uses #constants – mock it so the re-export test doesn't pull in data deps
vi.mock('#components/Navbar.jsx', () => ({ default: () => null }));
vi.mock('#components/Welcome.jsx', () => ({ default: () => null }));

import * as components from '../index.js';

describe('src/components/index.js named exports', () => {
    it('exports Navbar', () => {
        expect(components.Navbar).toBeDefined();
    });

    it('exports Welcome', () => {
        expect(components.Welcome).toBeDefined();
    });

    it('Navbar export is a function (React component)', () => {
        expect(typeof components.Navbar).toBe('function');
    });

    it('Welcome export is a function (React component)', () => {
        expect(typeof components.Welcome).toBe('function');
    });

    it('does not export unexpected members beyond Navbar and Welcome', () => {
        const exportedKeys = Object.keys(components);
        expect(exportedKeys).toEqual(expect.arrayContaining(['Navbar', 'Welcome']));
        // Exactly two named exports
        expect(exportedKeys.length).toBe(2);
    });
});