import { describe, it, expect } from 'vitest';
import { isHtmlResponse } from '../src/isHtmlResponse';

describe('isHtmlResponse', () => {
	it('should return true if Content-Type is text/html', () => {
		const response = new Response('', { headers: { 'Content-Type': 'text/html' } });
		expect(isHtmlResponse({ response: response })).toBe(true);
	});

	it('should return true if Content-Type includes text/html with charset', () => {
		const response = new Response('', { headers: { 'Content-Type': 'text/html; charset=UTF-8' } });
		expect(isHtmlResponse({ response: response })).toBe(true);
	});

	it('should return false if Content-Type is not text/html', () => {
		const response = new Response('', { headers: { 'Content-Type': 'application/json' } });
		expect(isHtmlResponse({ response: response })).toBe(false);
	});

	it('should return false if Content-Type header is missing', () => {
		const response = new Response('');
		expect(isHtmlResponse({ response: response })).toBe(false);
	});
});
