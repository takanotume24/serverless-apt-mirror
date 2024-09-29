import { describe, it, expect, vi } from 'vitest';
import { fetchFromR2 } from '../src/fetchFromR2';

// モックするためにR2ObjectBodyの型を定義
type R2ObjectBody = {
	// 必要に応じてオブジェクトの構造を定義
	body: string;
};

describe('fetchFromR2', () => {
	it('should return a Response when the object is found', async () => {
		const mockBucket: Partial<globalThis.R2Bucket> = {
			get: vi.fn().mockResolvedValue({ body: 'test content' } as R2ObjectBody),
			head: vi.fn().mockResolvedValue(null), // Mock method with correct return type
			put: vi.fn().mockResolvedValue(null), // Mock method with correct return type
			createMultipartUpload: vi.fn().mockResolvedValue(null), // Mock method with correct return type
			resumeMultipartUpload: vi.fn().mockResolvedValue(null), // Mock method with correct return type
			delete: vi.fn().mockResolvedValue(null), // Mock method with correct return type
			list: vi.fn().mockResolvedValue(null) // Mock method with correct return type
		};

		const key = 'test-key';
		const response = await fetchFromR2({
			bucket: mockBucket as globalThis.R2Bucket,
			key: key
		});

		expect(mockBucket.get).toHaveBeenCalledWith(key);
		expect(response).not.toBeNull();
		if (response) {
			const text = await response.text();
			expect(text).toBe('test content');
		}
	});

	it('should return null when the object is not found', async () => {
		const mockBucket: Partial<globalThis.R2Bucket> = {
			get: vi.fn().mockResolvedValue(null),
			head: vi.fn().mockResolvedValue(null), // Mock method with correct return type
			put: vi.fn().mockResolvedValue(null), // Mock method with correct return type
			createMultipartUpload: vi.fn().mockResolvedValue(null), // Mock method with correct return type
			resumeMultipartUpload: vi.fn().mockResolvedValue(null), // Mock method with correct return type
			delete: vi.fn().mockResolvedValue(null), // Mock method with correct return type
			list: vi.fn().mockResolvedValue(null) // Mock method with correct return type
		};

		const key = 'test-key';
		const response = await fetchFromR2({
			bucket: mockBucket as globalThis.R2Bucket,
			key: key
		});

		expect(mockBucket.get).toHaveBeenCalledWith(key);
		expect(response).toBeNull();
	});
});
