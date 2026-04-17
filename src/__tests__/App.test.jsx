import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock both components to isolate App.jsx behavior
vi.mock('gsap', () => ({ default: { to: vi.fn() } }));
vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));
vi.mock('#components/Navbar.jsx', () => ({
    default: () => <nav data-testid="navbar" />,
}));
vi.mock('#components/Welcome.jsx', () => ({
    default: () => <section data-testid="welcome" />,
}));

import App from '../App.jsx';

describe('App component', () => {
    it('renders without throwing', () => {
        expect(() => render(<App />)).not.toThrow();
    });

    it('renders a <main> root element', () => {
        const { container } = render(<App />);
        expect(container.querySelector('main')).not.toBeNull();
    });

    it('renders the Navbar component inside main', () => {
        const { getByTestId } = render(<App />);
        expect(getByTestId('navbar')).not.toBeNull();
    });

    it('renders the Welcome component inside main', () => {
        const { getByTestId } = render(<App />);
        expect(getByTestId('welcome')).not.toBeNull();
    });

    it('renders Navbar before Welcome in document order', () => {
        const { container } = render(<App />);
        const main = container.querySelector('main');
        const children = Array.from(main.children);
        const navbarIndex = children.findIndex((el) => el.dataset.testid === 'navbar');
        const welcomeIndex = children.findIndex((el) => el.dataset.testid === 'welcome');
        expect(navbarIndex).toBeLessThan(welcomeIndex);
    });

    it('renders exactly two direct children inside main', () => {
        const { container } = render(<App />);
        const main = container.querySelector('main');
        expect(main.children.length).toBe(2);
    });

    // Regression: App imports from '#components' barrel (index.js), not individual files
    it('imports Welcome from the #components barrel (smoke test)', () => {
        // If barrel import broke, Welcome would not render at all
        const { getByTestId } = render(<App />);
        expect(getByTestId('welcome')).toBeDefined();
    });
});