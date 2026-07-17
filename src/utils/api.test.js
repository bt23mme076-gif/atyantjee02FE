import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildReturnUrl, getReturnUrlBase, request } from './api';

describe('Payment Return URL Helpers', () => {
  beforeEach(() => {
    vi.stubGlobal('window', {
      location: {
        origin: 'https://test-origin.com',
      },
    });
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('should use VITE_APP_URL if defined in env', () => {
    vi.stubEnv('VITE_APP_URL', 'https://env-app-url.com/');
    const base = getReturnUrlBase();
    expect(base).toBe('https://env-app-url.com');
  });

  it('should fallback to window.location.origin if VITE_APP_URL is not defined', () => {
    vi.stubEnv('VITE_APP_URL', '');
    const base = getReturnUrlBase();
    expect(base).toBe('https://test-origin.com');
  });

  it('should build a correct return URL with query parameter', () => {
    vi.stubEnv('VITE_APP_URL', 'https://env-app-url.com');
    const url = buildReturnUrl('/payment-status', 'order_123');
    expect(url).toBe('https://env-app-url.com/payment-status?order_id=order_123');
  });

  it('should normalize paths missing leading slash', () => {
    vi.stubEnv('VITE_APP_URL', 'https://env-app-url.com');
    const url = buildReturnUrl('payment-status', 'order_123');
    expect(url).toBe('https://env-app-url.com/payment-status?order_id=order_123');
  });
});

describe('API request() wrapper', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('should return parsed JSON data on success response', async () => {
    const mockData = { success: true, user: { name: 'Atyant' } };
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const result = await request('/api/users/me');
    expect(result).toEqual(mockData);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/users/me'),
      expect.objectContaining({
        credentials: 'include',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      })
    );
  });

  it('should throw an error with backend message on error status', async () => {
    const errorBody = { error: 'Invalid token payload' };
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => errorBody,
    });

    await expect(request('/api/users/me')).rejects.toThrow('Invalid token payload');
  });

  it('should fallback gracefully when response is not valid JSON', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 502,
      json: async () => {
        throw new Error('Not JSON');
      },
    });

    await expect(request('/api/users/me')).rejects.toThrow('API error 502');
  });
});
