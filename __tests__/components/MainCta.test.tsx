import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import MainCta from '../../components/MainCta';

describe('MainCta Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const mockData = {
    name: 'John Doe',
    bio: 'Software Developer',
  };

  it('renders without crashing', () => {
    const root = createRoot(container);
    expect(() => {
      act(() => {
        root.render(<MainCta data={mockData} />);
      });
    }).not.toThrow();

    act(() => {
      root.unmount();
    });
  });

  it('renders name and bio text', () => {
    const root = createRoot(container);

    act(() => {
      root.render(<MainCta data={mockData} />);
    });

    expect(container.textContent).toContain('John Doe');
    expect(container.textContent).toContain('Software Developer');

    act(() => {
      root.unmount();
    });
  });

  it('applies correct CSS classes to name element', () => {
    const root = createRoot(container);

    act(() => {
      root.render(<MainCta data={mockData} />);
    });

    const nameDiv = Array.from(container.querySelectorAll('div')).find(
      (div) => div.textContent === 'John Doe'
    );

    expect(nameDiv?.className).toContain('text-white');
    expect(nameDiv?.className).toContain('lg:text-[60px]');
    expect(nameDiv?.className).toContain('md:text-[40px]');
    expect(nameDiv?.className).toContain('sm:text-[30px]');

    act(() => {
      root.unmount();
    });
  });

  it('applies correct CSS classes to bio element', () => {
    const root = createRoot(container);

    act(() => {
      root.render(<MainCta data={mockData} />);
    });

    const bioDiv = Array.from(container.querySelectorAll('div')).find(
      (div) => div.textContent === 'Software Developer'
    );

    expect(bioDiv?.className).toContain('text-primary');
    expect(bioDiv?.className).toContain('text-bold');

    act(() => {
      root.unmount();
    });
  });

  it('has correct container structure', () => {
    const root = createRoot(container);

    act(() => {
      root.render(<MainCta data={mockData} />);
    });

    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv?.className).toContain('flex');
    expect(containerDiv?.className).toContain('flex-col');

    act(() => {
      root.unmount();
    });
  });

  it('handles empty strings', () => {
    const emptyData = { name: '', bio: '' };
    const root = createRoot(container);

    expect(() => {
      act(() => {
        root.render(<MainCta data={emptyData} />);
      });
    }).not.toThrow();

    act(() => {
      root.unmount();
    });
  });

  it('renders long text correctly', () => {
    const longData = {
      name: 'This is a very long name that should render correctly',
      bio: 'This is a very long bio description',
    };

    const root = createRoot(container);

    act(() => {
      root.render(<MainCta data={longData} />);
    });

    expect(container.textContent).toContain(
      'This is a very long name that should render correctly'
    );
    expect(container.textContent).toContain(
      'This is a very long bio description'
    );

    act(() => {
      root.unmount();
    });
  });
});
