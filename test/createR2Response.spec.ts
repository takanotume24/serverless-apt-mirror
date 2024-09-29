import { describe, it, expect } from 'vitest';
import { createR2Response } from '../src/createR2Response';

// Helper function to create a ReadableStream from a string
function stringToReadableStream(str: string) {
	const encoder = new TextEncoder();
	const uint8Array = encoder.encode(str);
	return new ReadableStream({
		start(controller) {
			controller.enqueue(uint8Array);
			controller.close();
		}
	});
}

describe('createR2Response', () => {
	it('should create a Response with the correct body and headers', () => {
		const stream = stringToReadableStream('test content');
		const object = { body: stream } as R2ObjectBody;
		const response = createR2Response({ object: object });

		expect(response).not.toBeNull();
		return response.text().then(text => {
			expect(text).toBe('test content');
			expect(response.headers.get('Content-Type')).toBe('application/octet-stream');
			expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000');
		});
	});
});
