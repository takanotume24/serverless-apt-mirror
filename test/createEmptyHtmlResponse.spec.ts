import { describe, it, expect } from 'vitest';
import { createEmptyHtmlResponse } from '../src/createEmptyHtmlResponse';

describe('createEmptyHtmlResponse', () => {
	it('should return a Response object', () => {
		const response = createEmptyHtmlResponse();
		expect(response).toBeInstanceOf(Response);
	});

	it('should have Content-Type header set to text/html', () => {
		const response = createEmptyHtmlResponse();
		expect(response.headers.get('Content-Type')).toBe('text/html');
	});

	it('should have an HTML body with <html></html>', async () => {
		const response = createEmptyHtmlResponse();
		const text = await response.text();
		expect(text).toBe('<html></html>');
	});
});
