import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import About from '../../components/About';

// Basic component tests using ReactDOM
describe('About Component', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  const mockData = {
    title: 'Test Title',
    description: 'Test Description'
  };

  it('renders without crashing', () => {
    const root = createRoot(container);
    expect(() => {
      act(() => {
        root.render(<About data={mockData} />);
      });
    }).not.toThrow();
    
    act(() => {
      root.unmount();
    });
  });

  it('renders title and description', () => {
    const mockData = { title: 'Test Title', description: 'Test Description' };
    const root = createRoot(container);
    
    act(() => {
      root.render(<About data={mockData} />);
    });
    
    expect(container.textContent).toContain('Test Title');
    expect(container.textContent).toContain('Test Description');
    
    act(() => {
      root.unmount();
    });
  });

  it('renders h2 element for title', () => {
    const mockData = { title: 'Test Title', description: 'Test Description' };
    const root = createRoot(container);
    
    act(() => {
      root.render(<About data={mockData} />);
    });
    
    const h2Element = container.querySelector('h2');
    expect(h2Element).toBeTruthy();
    expect(h2Element?.textContent).toBe('Test Title');
    
    act(() => {
      root.unmount();
    });
  });

  it('applies correct CSS classes', () => {
    const mockData = { title: 'Test Title', description: 'Test Description' };
    const root = createRoot(container);
    
    act(() => {
      root.render(<About data={mockData} />);
    });
    
    const h2Element = container.querySelector('h2');
    const descriptionElement = container.querySelector('.text-primary');
    
    expect(h2Element?.className).toContain('text-white');
    expect(h2Element?.className).toContain('text-[30px]');
    expect(h2Element?.className).toContain('pb-6');
    expect(descriptionElement?.textContent).toBe('Test Description');
    
    act(() => {
      root.unmount();
    });
  });

  it('handles undefined data gracefully', () => {
    const root = createRoot(container);
    expect(() => {
      act(() => {
        root.render(<About data={undefined as any} />);
      });
    }).not.toThrow();
    
    act(() => {
      root.unmount();
    });
  });

  it('handles empty data', () => {
    const emptyData = { title: '', description: '' };
    const root = createRoot(container);
    
    act(() => {
      root.render(<About data={emptyData} />);
    });
    
    expect(container.textContent).toContain('');
    
    act(() => {
      root.unmount();
    });
  });

  it('has correct container structure', () => {
    const root = createRoot(container);
    
    act(() => {
      root.render(<About data={mockData} />);
    });
    
    const mainDiv = container.querySelector('.w-full');
    expect(mainDiv).toBeTruthy();
    
    act(() => {
      root.unmount();
    });
  });
});