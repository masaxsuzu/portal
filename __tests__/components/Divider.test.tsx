import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import Divider from '../../components/Divider';

describe('Divider Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('renders without crashing', () => {
    const data = { className: 'my-custom-class' };
    const root = createRoot(container);

    expect(() => {
      act(() => {
        root.render(<Divider data={data} />);
      });
    }).not.toThrow();

    act(() => {
      root.unmount();
    });
  });

  it('applies custom className', () => {
    const data = { className: 'my-custom-class' };
    const root = createRoot(container);

    act(() => {
      root.render(<Divider data={data} />);
    });

    const divElement = container.querySelector('div');
    expect(divElement?.className).toBe('my-custom-class');

    act(() => {
      root.unmount();
    });
  });

  it('uses default className when not provided', () => {
    const data = { className: undefined } as any;
    const root = createRoot(container);

    act(() => {
      root.render(<Divider data={data} />);
    });

    const divElement = container.querySelector('div');
    expect(divElement?.className).toBe('my-8');

    act(() => {
      root.unmount();
    });
  });

  it('handles undefined data gracefully', () => {
    const root = createRoot(container);

    expect(() => {
      act(() => {
        root.render(<Divider data={undefined as any} />);
      });
    }).not.toThrow();

    act(() => {
      root.unmount();
    });
  });

  it('renders as a div element', () => {
    const data = { className: 'test-class' };
    const root = createRoot(container);

    act(() => {
      root.render(<Divider data={data} />);
    });

    const divElement = container.querySelector('div');
    expect(divElement).toBeTruthy();
    expect(divElement?.tagName).toBe('DIV');

    act(() => {
      root.unmount();
    });
  });

  it('handles empty className', () => {
    const data = { className: '' };
    const root = createRoot(container);

    act(() => {
      root.render(<Divider data={data} />);
    });

    const divElement = container.querySelector('div');
    expect(divElement?.className).toBe('');

    act(() => {
      root.unmount();
    });
  });
});
