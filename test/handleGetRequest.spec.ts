import { describe, it, expect, vi } from 'vitest';
import { handleGetRequest } from '../src/handleGetRequest';
import { authorizeRequest } from '../src/authorizeRequest';
import { fetchFromOriginAndStore } from '../src/fetchFromOriginAndStore';
import { fetchFromR2 } from '../src/fetchFromR2';
import type { Context } from 'hono';
import type { Env } from '../src/handleGetRequest';

// Mock functions setup
vi.mock('../src/authorizeRequest', () => ({
  authorizeRequest: vi.fn(),
}));
vi.mock('../src/fetchFromOriginAndStore', () => ({
  fetchFromOriginAndStore: vi.fn(),
}));
vi.mock('../src/fetchFromR2', () => ({
  fetchFromR2: vi.fn(),
}));

// Import mocked functions
const mockAuthorizeRequest = vi.mocked(authorizeRequest);
const mockFetchFromOriginAndStore = vi.mocked(fetchFromOriginAndStore);
const mockFetchFromR2 = vi.mocked(fetchFromR2);

const createMockContext = (url: string, method: string, bucket: R2Bucket): Context<{ Bindings: Env }> => {
  return {
    req: {
      url,
      method,
    },
    env: {
      APT_MIRROR_BUCKET: bucket,
    },
  } as unknown as Context<{ Bindings: Env }>;
};

describe('handleGetRequest', () => {
  it('should return 401 if request is not authorized', async () => {
    mockAuthorizeRequest.mockReturnValue(false);

    const context = createMockContext('http://example.com/', 'GET', {} as R2Bucket);
    const response = await handleGetRequest(context);

    expect(response.status).toBe(401);
    expect(response.statusText).toBe('Unauthorized');
  });

  it('should fetch from origin and store if object not in R2', async () => {
    mockAuthorizeRequest.mockReturnValue(true);
    mockFetchFromR2.mockResolvedValue(null);
    mockFetchFromOriginAndStore.mockResolvedValue(new Response('Fetched from origin'));

    const context = createMockContext('http://example.com/file.txt', 'GET', {} as R2Bucket);
    const response = await handleGetRequest(context);

    expect(mockFetchFromR2).toHaveBeenCalled();
    expect(mockFetchFromOriginAndStore).toHaveBeenCalled();
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe('Fetched from origin');
  });
});
