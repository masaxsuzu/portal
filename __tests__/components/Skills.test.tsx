import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Skills from '../../components/Skills';

describe('Skills Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const mockData = {
    title: 'Skills',
    categories: [
      { name: 'Languages', items: ['C#', 'Rust'] },
      { name: 'Fields', items: ['Backend'] },
    ],
  };

  it('renders without crashing', () => {
    const root = createRoot(container);
    expect(() => {
      act(() => {
        root.render(<Skills data={mockData} />);
      });
    }).not.toThrow();
    act(() => root.unmount());
  });

  it('renders the title', () => {
    const root = createRoot(container);
    act(() => root.render(<Skills data={mockData} />));
    expect(container.querySelector('h2')?.textContent).toBe('Skills');
    act(() => root.unmount());
  });

  it('renders category names', () => {
    const root = createRoot(container);
    act(() => root.render(<Skills data={mockData} />));
    expect(container.textContent).toContain('Languages');
    expect(container.textContent).toContain('Fields');
    act(() => root.unmount());
  });

  it('renders skill items', () => {
    const root = createRoot(container);
    act(() => root.render(<Skills data={mockData} />));
    expect(container.textContent).toContain('C#');
    expect(container.textContent).toContain('Rust');
    expect(container.textContent).toContain('Backend');
    act(() => root.unmount());
  });

  it('renders all items as list elements', () => {
    const root = createRoot(container);
    act(() => root.render(<Skills data={mockData} />));
    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(3);
    act(() => root.unmount());
  });
});
