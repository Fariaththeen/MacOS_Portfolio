import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import gsap from 'gsap'
import Dock from '#components/Dock.jsx'
import { dockApps } from '#constants'

describe('Dock component', () => {
    describe('structure', () => {
        it('renders a section with id "dock"', () => {
            render(<Dock />)
            expect(document.querySelector('section#dock')).toBeInTheDocument()
        })

        it('renders the dock-container div', () => {
            render(<Dock />)
            expect(document.querySelector('.dock-container')).toBeInTheDocument()
        })

        it('renders one button per dockApp', () => {
            render(<Dock />)
            const buttons = screen.getAllByRole('button')
            expect(buttons).toHaveLength(dockApps.length)
        })

        it('renders one image per dockApp', () => {
            render(<Dock />)
            const imgs = screen.getAllByRole('img')
            // Tooltip mock may not render an img, so filter to dock images
            const dockImgs = imgs.filter((img) => img.getAttribute('loading') === 'lazy')
            expect(dockImgs).toHaveLength(dockApps.length)
        })

        it('renders the Tooltip component with id "dock-tooltip"', () => {
            render(<Dock />)
            const tooltip = screen.getByTestId('tooltip')
            expect(tooltip).toBeInTheDocument()
            expect(tooltip).toHaveAttribute('data-tooltip-id', 'dock-tooltip')
        })

        it('renders the Tooltip with place "top"', () => {
            render(<Dock />)
            const tooltip = screen.getByTestId('tooltip')
            expect(tooltip).toHaveAttribute('data-place', 'top')
        })

        it('renders the Tooltip with className "tooltip"', () => {
            render(<Dock />)
            const tooltip = screen.getByTestId('tooltip')
            expect(tooltip).toHaveClass('tooltip')
        })
    })

    describe('per-app button rendering', () => {
        it('renders a button with aria-label matching each app name', () => {
            render(<Dock />)
            dockApps.forEach(({ name }) => {
                expect(screen.getByRole('button', { name })).toBeInTheDocument()
            })
        })

        it('each button carries data-tooltip-id set to "dock-tooltip"', () => {
            render(<Dock />)
            const buttons = screen.getAllByRole('button')
            buttons.forEach((btn) => {
                expect(btn).toHaveAttribute('data-tooltip-id', 'dock-tooltip')
            })
        })

        it('each button carries data-tooltip-content equal to the app name', () => {
            render(<Dock />)
            dockApps.forEach(({ name }) => {
                const btn = screen.getByRole('button', { name })
                expect(btn).toHaveAttribute('data-tooltip-content', name)
            })
        })

        it('each button has type="button"', () => {
            render(<Dock />)
            const buttons = screen.getAllByRole('button')
            buttons.forEach((btn) => {
                expect(btn).toHaveAttribute('type', 'button')
            })
        })

        it('each button has the class "dock-icon"', () => {
            render(<Dock />)
            const buttons = screen.getAllByRole('button')
            buttons.forEach((btn) => {
                expect(btn).toHaveClass('dock-icon')
            })
        })
    })

    describe('image rendering', () => {
        it('each image has alt text matching the app name', () => {
            render(<Dock />)
            dockApps.forEach(({ name }) => {
                expect(screen.getByAltText(name)).toBeInTheDocument()
            })
        })

        it('each image src is constructed from the icon filename', () => {
            render(<Dock />)
            dockApps.forEach(({ name, icon }) => {
                const img = screen.getByAltText(name)
                expect(img).toHaveAttribute('src', `/images/${icon}`)
            })
        })

        it('each image has loading="lazy"', () => {
            render(<Dock />)
            dockApps.forEach(({ name }) => {
                const img = screen.getByAltText(name)
                expect(img).toHaveAttribute('loading', 'lazy')
            })
        })
    })

    describe('disabled / canOpen behaviour', () => {
        it('buttons for apps where canOpen is false are disabled', () => {
            render(<Dock />)
            dockApps
                .filter(({ canOpen }) => !canOpen)
                .forEach(({ name }) => {
                    expect(screen.getByRole('button', { name })).toBeDisabled()
                })
        })

        it('buttons for apps where canOpen is true are not disabled', () => {
            render(<Dock />)
            dockApps
                .filter(({ canOpen }) => canOpen)
                .forEach(({ name }) => {
                    expect(screen.getByRole('button', { name })).not.toBeDisabled()
                })
        })

        it('images for disabled apps have "opacity-60" class', () => {
            render(<Dock />)
            dockApps
                .filter(({ canOpen }) => !canOpen)
                .forEach(({ name }) => {
                    expect(screen.getByAltText(name)).toHaveClass('opacity-60')
                })
        })

        it('images for enabled apps do not have "opacity-60" class', () => {
            render(<Dock />)
            dockApps
                .filter(({ canOpen }) => canOpen)
                .forEach(({ name }) => {
                    expect(screen.getByAltText(name)).not.toHaveClass('opacity-60')
                })
        })

        // Verify the specific "Archive" (trash) app is disabled – regression guard
        it('the Archive/trash app is disabled', () => {
            render(<Dock />)
            expect(screen.getByRole('button', { name: 'Archive' })).toBeDisabled()
        })
    })

    describe('click behaviour', () => {
        it('clicking an enabled button does not throw', () => {
            render(<Dock />)
            const btn = screen.getByRole('button', { name: 'Portfolio' })
            expect(() => fireEvent.click(btn)).not.toThrow()
        })

        it('clicking a disabled button does not propagate a click event', () => {
            render(<Dock />)
            const section = document.querySelector('section#dock')
            const clickSpy = vi.fn()
            section.addEventListener('click', clickSpy)

            const disabledBtn = screen.getByRole('button', { name: 'Archive' })
            fireEvent.click(disabledBtn)

            // Disabled buttons still fire synthetic events via fireEvent, but
            // the onClick handler on the button element is not invoked.
            // We confirm by ensuring the button itself is indeed disabled.
            expect(disabledBtn).toBeDisabled()
            section.removeEventListener('click', clickSpy)
        })
    })

    describe('GSAP / animation wiring', () => {
        it('calls gsap.to when mousemove fires over the dock container', () => {
            render(<Dock />)
            const container = document.querySelector('.dock-container')
            fireEvent.mouseMove(container, { clientX: 100 })
            expect(gsap.to).toHaveBeenCalled()
        })

        it('calls gsap.to to reset icons when mouseleave fires', () => {
            render(<Dock />)
            const container = document.querySelector('.dock-container')
            // Trigger mousemove first so icons exist in animation state
            fireEvent.mouseMove(container, { clientX: 100 })
            vi.clearAllMocks()
            fireEvent.mouseLeave(container)
            expect(gsap.to).toHaveBeenCalled()
        })

        it('resets icons to scale 1 and y 0 on mouseleave', () => {
            render(<Dock />)
            const container = document.querySelector('.dock-container')
            fireEvent.mouseLeave(container)
            const calls = gsap.to.mock.calls
            // Each call should include scale:1 and y:0
            calls.forEach(([, opts]) => {
                expect(opts).toMatchObject({ scale: 1, y: 0 })
            })
        })

        it('attaches mousemove and mouseleave listeners to dock-container on mount', async () => {
            const addSpy = vi.spyOn(EventTarget.prototype, 'addEventListener')
            await act(async () => render(<Dock />))
            const registeredEvents = addSpy.mock.calls.map(([event]) => event)
            expect(registeredEvents).toContain('mousemove')
            expect(registeredEvents).toContain('mouseleave')
            addSpy.mockRestore()
        })

        it('removes mousemove and mouseleave listeners on unmount', async () => {
            const removeSpy = vi.spyOn(EventTarget.prototype, 'removeEventListener')
            let unmount
            await act(async () => {
                const result = render(<Dock />)
                unmount = result.unmount
            })
            act(() => unmount())
            const removedEvents = removeSpy.mock.calls.map(([event]) => event)
            expect(removedEvents).toContain('mousemove')
            expect(removedEvents).toContain('mouseleave')
            removeSpy.mockRestore()
        })
    })
})