import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock gsap to avoid animation side effects in tests
vi.mock('gsap', () => ({
    default: {
        to: vi.fn(),
        from: vi.fn(),
        fromTo: vi.fn(),
        set: vi.fn(),
        timeline: vi.fn(() => ({
            to: vi.fn(),
            from: vi.fn(),
            fromTo: vi.fn(),
        })),
    },
}))

// Mock @gsap/react using useEffect so refs are attached when the callback runs
vi.mock('@gsap/react', () => ({
    useGSAP: vi.fn((callback) => {
        React.useEffect(() => {
            const cleanup = callback()
            return cleanup
        }, [])
    }),
}))

// Mock react-tooltip so Tooltip renders a stable element without portal issues
vi.mock('react-tooltip', () => ({
    Tooltip: ({ id, place, className }) =>
        React.createElement('div', {
            'data-testid': 'tooltip',
            'data-tooltip-id': id,
            'data-place': place,
            className,
        }),
}))

// Mock dayjs to return a stable time string for Navbar
vi.mock('dayjs', () => {
    const mockDayjs = () => ({
        format: vi.fn(() => 'Mon Jan 1 12:00 PM'),
    })
    return { default: mockDayjs }
})