import { authorizeRequest } from './authorizeRequest';
import { fetchFromOriginAndStore } from './fetchFromOriginAndStore';
import { fetchFromR2 } from './fetchFromR2';
import type { Context } from 'hono';

export interface Env {
	APT_MIRROR_BUCKET: R2Bucket;
	ORIGIN_APT_SERVER: string;
}

// 関数: GETリクエストを処理する
export const handleGetRequest = async (context: Context<{ Bindings: Env }>): Promise<Response> => {
	const { req, env } = context;
	const url = new URL(req.url);
	const objectKey = url.pathname;
	const bucket = env.APT_MIRROR_BUCKET;

	if (!authorizeRequest({ method: req.method })) {
		return new Response('Unauthorized', { status: 401 });
	}

	const cache = caches.default
	const cacheKey = new Request(url.toString(), req)
	const response = await cache.match(cacheKey)

	if (response) {
		console.log(`Cache hit for: ${req.url}.`);
		return response
	}

	const r2Response = await fetchFromR2({
		bucket: bucket,
		key: objectKey
	});

	if (r2Response) {
		console.log(`Read from R2 for: ${req.url}.`);
		await cache.put(cacheKey, r2Response.clone())
		return r2Response;
	}

	const originResponse = await fetchFromOriginAndStore({
		bucket: bucket,
		key: objectKey,
		url: new URL(`http://${env.ORIGIN_APT_SERVER}${objectKey}`)
	});

	if (!originResponse.ok) {
		return new Response('Internal Server Error', { status: 500 });
	}

	console.log(`Read from Origin for: ${req.url}.`);
	await cache.put(cacheKey, originResponse.clone())
	return originResponse
};
