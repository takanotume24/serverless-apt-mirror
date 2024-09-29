import { describe, it, expect, vi } from 'vitest';
import { fetchFromOriginAndStore } from '../src/fetchFromOriginAndStore';

describe('fetchFromOriginAndStore', () => {
    it('should fetch data from the origin, store it in R2, and return a Response', async () => {
        const mockBucket: R2Bucket = {
            put: vi.fn().mockResolvedValue(undefined),
            head: vi.fn().mockResolvedValue(null),
            get: vi.fn().mockResolvedValue(null),
            delete: vi.fn().mockResolvedValue(undefined),
            list: vi.fn().mockResolvedValue(undefined),
            createMultipartUpload: vi.fn().mockResolvedValue(undefined),
            resumeMultipartUpload: vi.fn().mockResolvedValue(undefined),
        };

        const mockResponse = new Response('test content', { status: 200 });

        // Fetch をモック
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(mockResponse));

        const key = 'test-key';
        const url = new URL('https://example.com');

        const response = await fetchFromOriginAndStore({
            bucket: mockBucket,
            key: key,
            url: url
        });

        expect(fetch).toHaveBeenCalledWith(url);
        expect(mockBucket.put).toHaveBeenCalledWith(key, await mockResponse.clone().arrayBuffer());
        expect(response).not.toBeNull();
        const arrayBuffer = await response.arrayBuffer();
        expect(new TextDecoder().decode(arrayBuffer)).toBe('test content');
        expect(response.headers.get('Content-Type')).toBe('application/octet-stream');
        expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000');
    });

    it('should return a 404 Response if the origin fetch fails', async () => {
        // Fetch をモックして 404 を返す
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('Not found', { status: 404 })));

		const mockBucket: R2Bucket = {
            put: vi.fn().mockResolvedValue(undefined),
            head: vi.fn().mockResolvedValue(null),
            get: vi.fn().mockResolvedValue(null),
            delete: vi.fn().mockResolvedValue(undefined),
            list: vi.fn().mockResolvedValue(undefined),
            createMultipartUpload: vi.fn().mockResolvedValue(undefined),
            resumeMultipartUpload: vi.fn().mockResolvedValue(undefined),
        };

        const key = 'test-key';
        const url = new URL('https://example.com');

        const response = await fetchFromOriginAndStore({
            bucket: mockBucket,
            key: key,
            url: url
        });

        expect(fetch).toHaveBeenCalledWith(url);
        expect(response.status).toBe(404);
        expect(await response.text()).toBe('Not found');
    });
});
