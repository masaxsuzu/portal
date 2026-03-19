import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import SessionLock from '../../components/SessionLock';

jest.mock('../../contexts/AppContext', () => ({
  useAppContext: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useAppContext } = require('../../contexts/AppContext');

const mockT = {
  sessionExpiredTitle: 'Session Expired',
  sessionExpiredMessage: 'Your session has expired. Please log in again.',
  sessionExpiredCountdown: 'Redirecting in {n} seconds...',
};

describe('SessionLock', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    useAppContext.mockReturnValue({ t: mockT });
    jest.useFakeTimers();
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('renders nothing when no session_expires cookie', () => {
    const root = createRoot(container);
    act(() => {
      root.render(<SessionLock />);
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(container.querySelector('h2')).toBeNull();
    act(() => root.unmount());
  });

  it('renders nothing when session is not yet expired', () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: `session_expires=${future}`,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<SessionLock />);
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(container.querySelector('h2')).toBeNull();
    act(() => root.unmount());
  });

  it('shows lock overlay when session_expires is in the past', async () => {
    const past = Math.floor(Date.now() / 1000) - 1;
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: `session_expires=${past}`,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<SessionLock />);
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(container.querySelector('h2')?.textContent).toBe('Session Expired');
    expect(container.textContent).toContain(
      'Your session has expired. Please log in again.'
    );
    act(() => root.unmount());
  });

  it('shows countdown starting at 10', async () => {
    const past = Math.floor(Date.now() / 1000) - 1;
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: `session_expires=${past}`,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<SessionLock />);
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(container.textContent).toContain('Redirecting in 10 seconds...');
    act(() => root.unmount());
  });

  it('decrements countdown each second', async () => {
    const past = Math.floor(Date.now() / 1000) - 1;
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: `session_expires=${past}`,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<SessionLock />);
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(container.textContent).toContain('Redirecting in 7 seconds...');
    act(() => root.unmount());
  });

  it('fires redirect after 10 seconds without throwing', async () => {
    const past = Math.floor(Date.now() / 1000) - 1;
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: `session_expires=${past}`,
    });

    const root = createRoot(container);
    act(() => {
      root.render(<SessionLock />);
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    expect(() => {
      act(() => {
        jest.advanceTimersByTime(10000);
      });
    }).not.toThrow();

    act(() => root.unmount());
  });
});
