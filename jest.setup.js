// Optional: configure or set up a testing framework before each test.
// You can delete this file if not needed.

// Enable React 19 act() environment
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PASSWORD = 'test-password';

// Add DOM environment setup for component tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
