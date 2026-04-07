import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Timeline from '../../components/Timeline';

describe('Timeline Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const mockData = {
    title: 'Career',
    events: [
      { period: '2020 - Present', company: 'Acme Corp', role: 'Engineer' },
      { period: '2018 - 2020', company: 'Beta Inc', role: 'Developer' },
    ],
  };

  it('renders without crashing', () => {
    const root = createRoot(container);
    expect(() => {
      act(() => {
        root.render(<Timeline data={mockData} />);
      });
    }).not.toThrow();
    act(() => root.unmount());
  });

  it('renders the title', () => {
    const root = createRoot(container);
    act(() => root.render(<Timeline data={mockData} />));
    expect(container.querySelector('h2')?.textContent).toBe('Career');
    act(() => root.unmount());
  });

  it('renders period for each event', () => {
    const root = createRoot(container);
    act(() => root.render(<Timeline data={mockData} />));
    expect(container.textContent).toContain('2020 - Present');
    expect(container.textContent).toContain('2018 - 2020');
    act(() => root.unmount());
  });

  it('renders company for each event', () => {
    const root = createRoot(container);
    act(() => root.render(<Timeline data={mockData} />));
    expect(container.textContent).toContain('Acme Corp');
    expect(container.textContent).toContain('Beta Inc');
    act(() => root.unmount());
  });

  it('renders role for each event', () => {
    const root = createRoot(container);
    act(() => root.render(<Timeline data={mockData} />));
    expect(container.textContent).toContain('Engineer');
    expect(container.textContent).toContain('Developer');
    act(() => root.unmount());
  });
});
