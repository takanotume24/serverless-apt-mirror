import { describe, it, expect } from 'vitest';
import { authorizeRequest } from '../src/authorizeRequest';

describe('authorizeRequest', () => {
	it('should return true for GET method', () => {
		expect(authorizeRequest({ method: 'GET' })).toBe(true);
	});

	it('should return false for POST method', () => {
		expect(authorizeRequest({ method: 'POST' })).toBe(false);
	});

	it('should return false for PUT method', () => {
		expect(authorizeRequest({ method: 'PUT' })).toBe(false);
	});

	it('should return false for DELETE method', () => {
		expect(authorizeRequest({ method: 'DELETE' })).toBe(false);
	});

	it('should return false for an empty string', () => {
		expect(authorizeRequest({ method: '' })).toBe(false);
	});

	it('should return false for null or undefined', () => {
		expect(authorizeRequest({ method: null as unknown as string })).toBe(false);
		expect(authorizeRequest({ method: undefined as unknown as string })).toBe(false);
	});
});
