import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Cards from '../../components/Cards';

describe('Cards Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const mockData = {
    title: 'Test Cards Title',
    data: [
      {
        title: 'Card 1',
        url: 'https://example1.com',
        description: 'Description 1',
        titleTextClass: 'text-csharp' as const,
      },
      {
        title: 'Card 2',
        url: 'https://example2.com',
        description: 'Description 2',
        titleTextClass: 'text-rust' as const,
      },
    ],
  };

  it('renders without crashing', () => {
    const root = createRoot(container);
    expect(() => {
      act(() => {
        root.render(<Cards data={mockData} />);
      });
    }).not.toThrow();

    act(() => {
      root.unmount();
    });
  });

  it('renders cards title and descriptions', () => {
    const root = createRoot(container);

    act(() => {
      root.render(<Cards data={mockData} />);
    });

    expect(container.textContent).toContain('Test Cards Title');
    expect(container.textContent).toContain('Card 1');
    expect(container.textContent).toContain('Card 2');
    expect(container.textContent).toContain('Description 1');
    expect(container.textContent).toContain('Description 2');

    act(() => {
      root.unmount();
    });
  });

  it('renders card links with correct href attributes', () => {
    const root = createRoot(container);

    act(() => {
      root.render(<Cards data={mockData} />);
    });

    const links = container.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[0].getAttribute('href')).toBe('https://example1.com');
    expect(links[1].getAttribute('href')).toBe('https://example2.com');

    act(() => {
      root.unmount();
    });
  });

  it('applies correct title text classes', () => {
    const root = createRoot(container);

    act(() => {
      root.render(<Cards data={mockData} />);
    });

    const card1TitleSpan = Array.from(container.querySelectorAll('span')).find(
      (span) => span.textContent === 'Card 1'
    );
    const card2TitleSpan = Array.from(container.querySelectorAll('span')).find(
      (span) => span.textContent === 'Card 2'
    );

    expect(card1TitleSpan?.className).toContain('text-csharp');
    expect(card2TitleSpan?.className).toContain('text-rust');

    act(() => {
      root.unmount();
    });
  });

  it('handles empty data array', () => {
    const emptyData = {
      title: 'Empty Cards',
      data: [],
    };

    const root = createRoot(container);

    act(() => {
      root.render(<Cards data={emptyData} />);
    });

    expect(container.textContent).toContain('Empty Cards');
    expect(container.querySelectorAll('a')).toHaveLength(0);

    act(() => {
      root.unmount();
    });
  });

  it('renders h2 element for main title', () => {
    const root = createRoot(container);

    act(() => {
      root.render(<Cards data={mockData} />);
    });

    const h2Element = container.querySelector('h2');
    expect(h2Element?.textContent).toBe('Test Cards Title');

    act(() => {
      root.unmount();
    });
  });
});
