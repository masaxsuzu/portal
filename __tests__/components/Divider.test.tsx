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

  it('renders as a div element', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Divider />);
    });
    expect(container.querySelector('div')?.tagName).toBe('DIV');
    act(() => root.unmount());
  });

  it('always applies my-8 class', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<Divider />);
    });
    expect(container.querySelector('div')?.className).toBe('my-8');
    act(() => root.unmount());
  });
});
