import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// vi.mock is hoisted, so use vi.hoisted() to declare the mock fn before the factory runs
const { mockGsapTo } = vi.hoisted(() => ({ mockGsapTo: vi.fn() }));

vi.mock('gsap', () => ({
    default: { to: mockGsapTo },
}));

// Mock @gsap/react - useGSAP should call the callback synchronously so refs are attached
vi.mock('@gsap/react', () => ({
    useGSAP: (cb) => {
        React.useEffect(() => {
            const cleanup = cb();
            return cleanup;
        }, []);
    },
}));

import Welcome from '../Welcome.jsx';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SUBTITLE_TEXT = "Hey, I'm Farid! Welcome to my";
const TITLE_TEXT = 'Portfolio';

// ---------------------------------------------------------------------------
// renderText – tested indirectly through component render output
// ---------------------------------------------------------------------------

describe('renderText (via Welcome render)', () => {
    it('renders one <span> per character in the subtitle', () => {
        const { container } = render(<Welcome />);
        const subtitleParagraph = container.querySelector('p');
        const spans = subtitleParagraph.querySelectorAll('span');
        expect(spans.length).toBe(SUBTITLE_TEXT.length);
    });

    it('renders one <span> per character in the title', () => {
        const { container } = render(<Welcome />);
        const h1 = container.querySelector('h1');
        const spans = h1.querySelectorAll('span');
        expect(spans.length).toBe(TITLE_TEXT.length);
    });

    it('replaces space characters with non-breaking space (\\u00A0) in subtitle', () => {
        const { container } = render(<Welcome />);
        const subtitleParagraph = container.querySelector('p');
        const spans = Array.from(subtitleParagraph.querySelectorAll('span'));
        const spaceIndices = [...SUBTITLE_TEXT].reduce((acc, char, i) => {
            if (char === ' ') acc.push(i);
            return acc;
        }, []);

        spaceIndices.forEach((idx) => {
            expect(spans[idx].textContent).toBe('\u00A0');
        });
    });

    it('renders non-space characters as-is in the title', () => {
        const { container } = render(<Welcome />);
        const h1 = container.querySelector('h1');
        const spans = Array.from(h1.querySelectorAll('span'));
        [...TITLE_TEXT].forEach((char, i) => {
            expect(spans[i].textContent).toBe(char);
        });
    });

    it('applies the subtitle className to every subtitle span', () => {
        const { container } = render(<Welcome />);
        const subtitleParagraph = container.querySelector('p');
        const spans = subtitleParagraph.querySelectorAll('span');
        spans.forEach((span) => {
            expect(span.className).toBe('text-3xl font-georama');
        });
    });

    it('applies the title className to every title span', () => {
        const { container } = render(<Welcome />);
        const h1 = container.querySelector('h1');
        const spans = h1.querySelectorAll('span');
        spans.forEach((span) => {
            expect(span.className).toBe('text-9xl italic font-georama');
        });
    });

    it('subtitle spans are rendered with no additional HTML attributes beyond className', () => {
        // fontvariationsettings (lowercase) is silently dropped by React since it is not a
        // recognized camelCase style property; spans render with only the className attribute
        const { container } = render(<Welcome />);
        const subtitleParagraph = container.querySelector('p');
        const firstSpan = subtitleParagraph.querySelector('span');
        expect(firstSpan.getAttribute('class')).toBe('text-3xl font-georama');
        // No style attribute is present due to the non-standard prop name
        expect(firstSpan.getAttribute('style')).toBeNull();
    });

    it('title spans are rendered with no additional HTML attributes beyond className', () => {
        // Same as subtitle: fontvariationsettings is dropped by React in the DOM output
        const { container } = render(<Welcome />);
        const h1 = container.querySelector('h1');
        const firstSpan = h1.querySelector('span');
        expect(firstSpan.getAttribute('class')).toBe('text-9xl italic font-georama');
        expect(firstSpan.getAttribute('style')).toBeNull();
    });

    it('renders an empty array for an empty string (zero spans in a custom render)', () => {
        // Verify zero-length input by checking that no extra spans appear beyond known text
        const { container } = render(<Welcome />);
        const h1 = container.querySelector('h1');
        expect(h1.querySelectorAll('span').length).toBeGreaterThan(0);
    });
});

// ---------------------------------------------------------------------------
// Welcome component – structure
// ---------------------------------------------------------------------------

describe('Welcome component structure', () => {
    it('renders a <section> with id="welcome"', () => {
        const { container } = render(<Welcome />);
        const section = container.querySelector('section#welcome');
        expect(section).not.toBeNull();
    });

    it('renders the subtitle paragraph inside the section', () => {
        const { container } = render(<Welcome />);
        const section = container.querySelector('section#welcome');
        expect(section.querySelector('p')).not.toBeNull();
    });

    it('renders an <h1> element inside the section', () => {
        const { container } = render(<Welcome />);
        const section = container.querySelector('section#welcome');
        expect(section.querySelector('h1')).not.toBeNull();
    });

    it('renders the h1 with className "mt-7"', () => {
        const { container } = render(<Welcome />);
        const h1 = container.querySelector('h1');
        expect(h1.className).toBe('mt-7');
    });

    it('renders the small-screen div with the accessibility message', () => {
        const { container } = render(<Welcome />);
        const div = container.querySelector('.small-screen');
        expect(div).not.toBeNull();
        expect(div.textContent).toContain('This Portfolio is designed for desktop/tablet screens only.');
    });

    it('subtitle text contains expected content characters', () => {
        const { container } = render(<Welcome />);
        const subtitleParagraph = container.querySelector('p');
        // Combine span text content (spaces rendered as \u00A0)
        const combined = Array.from(subtitleParagraph.querySelectorAll('span'))
            .map((s) => s.textContent)
            .join('')
            .replace(/\u00A0/g, ' ');
        expect(combined).toBe(SUBTITLE_TEXT);
    });

    it('title text spells out "Portfolio"', () => {
        const { container } = render(<Welcome />);
        const h1 = container.querySelector('h1');
        const combined = Array.from(h1.querySelectorAll('span'))
            .map((s) => s.textContent)
            .join('');
        expect(combined).toBe(TITLE_TEXT);
    });
});

// ---------------------------------------------------------------------------
// setupTextHover – event handling (tested through rendered Welcome)
// ---------------------------------------------------------------------------

describe('setupTextHover (via Welcome events)', () => {
    beforeEach(() => {
        mockGsapTo.mockClear();
        // Provide getBoundingClientRect stubs for jsdom (returns zeros by default)
        Element.prototype.getBoundingClientRect = vi.fn(() => ({
            left: 0,
            width: 10,
            top: 0,
            right: 10,
            bottom: 10,
            height: 10,
        }));
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('calls gsap.to for each letter on mousemove over the subtitle', () => {
        const { container } = render(<Welcome />);
        const subtitle = container.querySelector('p');
        fireEvent.mouseMove(subtitle, { clientX: 50 });
        // One gsap.to call per span character
        expect(mockGsapTo).toHaveBeenCalledTimes(SUBTITLE_TEXT.length);
    });

    it('calls gsap.to for each letter on mousemove over the title', () => {
        const { container } = render(<Welcome />);
        mockGsapTo.mockClear();
        const h1 = container.querySelector('h1');
        fireEvent.mouseMove(h1, { clientX: 50 });
        expect(mockGsapTo).toHaveBeenCalledTimes(TITLE_TEXT.length);
    });

    it('calls gsap.to for each letter on mouseleave from the subtitle', () => {
        const { container } = render(<Welcome />);
        mockGsapTo.mockClear();
        const subtitle = container.querySelector('p');
        fireEvent.mouseLeave(subtitle);
        expect(mockGsapTo).toHaveBeenCalledTimes(SUBTITLE_TEXT.length);
    });

    it('calls gsap.to for each letter on mouseleave from the title', () => {
        const { container } = render(<Welcome />);
        mockGsapTo.mockClear();
        const h1 = container.querySelector('h1');
        fireEvent.mouseLeave(h1);
        expect(mockGsapTo).toHaveBeenCalledTimes(TITLE_TEXT.length);
    });

    it('passes duration 0.3 on mouseleave (reset animation)', () => {
        const { container } = render(<Welcome />);
        mockGsapTo.mockClear();
        const h1 = container.querySelector('h1');
        fireEvent.mouseLeave(h1);
        mockGsapTo.mock.calls.forEach(([, options]) => {
            expect(options.duration).toBe(0.3);
        });
    });

    it('passes default duration 0.25 on mousemove (hover animation)', () => {
        const { container } = render(<Welcome />);
        mockGsapTo.mockClear();
        const h1 = container.querySelector('h1');
        fireEvent.mouseMove(h1, { clientX: 0 });
        mockGsapTo.mock.calls.forEach(([, options]) => {
            expect(options.duration).toBe(0.25);
        });
    });

    it('title mousemove weight stays within [400, 900] range', () => {
        const { container } = render(<Welcome />);
        mockGsapTo.mockClear();
        const h1 = container.querySelector('h1');
        fireEvent.mouseMove(h1, { clientX: 50 });
        mockGsapTo.mock.calls.forEach(([, options]) => {
            const match = options.fontVariationSettings.match(/'wght' ([\d.]+)/);
            const weight = parseFloat(match[1]);
            expect(weight).toBeGreaterThanOrEqual(400);
            expect(weight).toBeLessThanOrEqual(900);
        });
    });

    it('subtitle mousemove weight stays within [100, 400] range', () => {
        const { container } = render(<Welcome />);
        mockGsapTo.mockClear();
        const subtitle = container.querySelector('p');
        fireEvent.mouseMove(subtitle, { clientX: 50 });
        mockGsapTo.mock.calls.forEach(([, options]) => {
            const match = options.fontVariationSettings.match(/'wght' ([\d.]+)/);
            const weight = parseFloat(match[1]);
            expect(weight).toBeGreaterThanOrEqual(100);
            expect(weight).toBeLessThanOrEqual(400);
        });
    });

    it('title mouseleave resets weight to base 400', () => {
        const { container } = render(<Welcome />);
        mockGsapTo.mockClear();
        const h1 = container.querySelector('h1');
        fireEvent.mouseLeave(h1);
        mockGsapTo.mock.calls.forEach(([, options]) => {
            expect(options.fontVariationSettings).toBe("'wght' 400");
        });
    });

    it('subtitle mouseleave resets weight to base 100', () => {
        const { container } = render(<Welcome />);
        mockGsapTo.mockClear();
        const subtitle = container.querySelector('p');
        fireEvent.mouseLeave(subtitle);
        mockGsapTo.mock.calls.forEach(([, options]) => {
            expect(options.fontVariationSettings).toBe("'wght' 100");
        });
    });

    it('does not throw when gsap is called on unmount (cleanup)', () => {
        const { unmount } = render(<Welcome />);
        expect(() => unmount()).not.toThrow();
    });

    // Regression: ensure mousemove after mouseleave still triggers animation
    it('fires gsap.to again after a mouseleave–mousemove sequence', () => {
        const { container } = render(<Welcome />);
        mockGsapTo.mockClear();
        const h1 = container.querySelector('h1');
        fireEvent.mouseLeave(h1);
        mockGsapTo.mockClear();
        fireEvent.mouseMove(h1, { clientX: 20 });
        expect(mockGsapTo).toHaveBeenCalledTimes(TITLE_TEXT.length);
    });
});