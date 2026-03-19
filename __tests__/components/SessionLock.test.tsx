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
  sessionExpiredButton: 'Go to Login',
};

describe('SessionLock', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    useAppContext.mockReturnValue({ t: mockT });
    jest.useFakeTimers();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    document.body.removeChild(container);
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('renders nothing when session is not expired', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ expiresIn: 3600 }),
    });

    const root = createRoot(container);
    await act(async () => {
      root.render(<SessionLock />);
    });

    expect(container.querySelector('h2')).toBeNull();

    act(() => root.unmount());
  });

  it('shows lock overlay immediately when expiresIn is 0', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ expiresIn: 0 }),
    });

    const root = createRoot(container);
    await act(async () => {
      root.render(<SessionLock />);
    });

    expect(container.querySelector('h2')?.textContent).toBe('Session Expired');
    expect(container.textContent).toContain(
      'Your session has expired. Please log in again.'
    );

    act(() => root.unmount());
  });

  it('shows lock overlay after timeout fires', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      json: async () => ({ expiresIn: 10 }),
    });

    const root = createRoot(container);
    await act(async () => {
      root.render(<SessionLock />);
    });

    expect(container.querySelector('h2')).toBeNull();

    await act(async () => {
      jest.advanceTimersByTime(10000);
    });

    expect(container.querySelector('h2')?.textContent).toBe('Session Expired');

    act(() => root.unmount());
  });

  it('does nothing when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('network error'));

    const root = createRoot(container);
    await act(async () => {
      root.render(<SessionLock />);
    });

    expect(container.querySelector('h2')).toBeNull();

    act(() => root.unmount());
  });
});
