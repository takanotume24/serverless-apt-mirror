import { fetchFromOriginAndStore } from './fetchFromOriginAndStore';
import { fetchFromR2 } from './fetchFromR2';
import type { Context } from 'hono';

export interface Env {
	APT_MIRROR_BUCKET: R2Bucket;
	ORIGIN_APT_SERVER: string;
}

export const handleRelease = async (context: Context<{ Bindings: Env }>): Promise<Response> => {
	const { req, env } = context;
	const url = new URL(req.url);

	if (url.search) {
		return new Response('Forbidden', { status: 403 });
	}

	const cache = caches.default
	const cacheKey = new Request(url.toString(), req)
	const response = await cache.match(cacheKey)

	if (response) {
		console.log(`Cache hit for: ${req.url}.`);
		return response
	}

	const objectKey = url.pathname;
	const bucket = env.APT_MIRROR_BUCKET;
	const originResponse = await fetchFromOriginAndStore({
		bucket: bucket,
		key: objectKey,
		url: new URL(`http://${env.ORIGIN_APT_SERVER}${objectKey}`)
	});

	if (!originResponse.ok) {
		console.log(originResponse.url)
		return new Response('Internal Server Error', { status: 500 });
	}

	console.log(`Read from Origin for: ${req.url}.`);
	await cache.put(cacheKey, originResponse.clone())

	return originResponse
};
