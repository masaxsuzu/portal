/**
 * Tests for open redirect vulnerability protection in login page
 */

// Extract the validation logic for testing
const getValidRedirectPath = (path: unknown): string => {
  if (typeof path !== 'string') return '/';
  // Only allow relative paths starting with / and not containing protocol or double slashes
  if (path.startsWith('/') && !path.startsWith('//') && !path.includes(':')) {
    return path;
  }
  return '/';
};

describe('Login redirect validation', () => {
  describe('getValidRedirectPath', () => {
    it('should return "/" for non-string inputs', () => {
      expect(getValidRedirectPath(undefined)).toBe('/');
      expect(getValidRedirectPath(null)).toBe('/');
      expect(getValidRedirectPath(123)).toBe('/');
      expect(getValidRedirectPath({})).toBe('/');
      expect(getValidRedirectPath([])).toBe('/');
    });

    it('should allow valid relative paths', () => {
      expect(getValidRedirectPath('/')).toBe('/');
      expect(getValidRedirectPath('/dashboard')).toBe('/dashboard');
      expect(getValidRedirectPath('/user/profile')).toBe('/user/profile');
      expect(getValidRedirectPath('/page?query=value')).toBe('/page?query=value');
    });

    it('should block protocol-relative URLs (open redirect attack)', () => {
      expect(getValidRedirectPath('//evil.com')).toBe('/');
      expect(getValidRedirectPath('//evil.com/path')).toBe('/');
    });

    it('should block URLs with protocols (open redirect attack)', () => {
      expect(getValidRedirectPath('https://evil.com')).toBe('/');
      expect(getValidRedirectPath('http://evil.com')).toBe('/');
      expect(getValidRedirectPath('javascript:alert(1)')).toBe('/');
      expect(getValidRedirectPath('data:text/html,<script>alert(1)</script>')).toBe('/');
    });

    it('should block paths with embedded protocols', () => {
      expect(getValidRedirectPath('/redirect?url=https://evil.com')).toBe('/');
      expect(getValidRedirectPath('/path:with:colons')).toBe('/');
    });

    it('should block paths not starting with /', () => {
      expect(getValidRedirectPath('evil.com')).toBe('/');
      expect(getValidRedirectPath('../parent')).toBe('/');
      expect(getValidRedirectPath('relative/path')).toBe('/');
    });

    it('should block empty string', () => {
      expect(getValidRedirectPath('')).toBe('/');
    });
  });
});
