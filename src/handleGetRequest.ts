import { fetchFromR2 } from './fetchFromR2';
import { fetchFromOrigin } from './fetchFromOrigin';
import { storeToR2 } from './storeToR2';
import type { Context } from 'hono';

export interface Env {
	APT_MIRROR_BUCKET: R2Bucket;
	ORIGIN_APT_SERVER: string;
}

type Params = {
	context: Context<{ Bindings: Env }>;
	isCacheableToR2: boolean,
}
// 関数: GETリクエストを処理する
export const handleGetRequest = async ({ context, isCacheableToR2 }: Params): Promise<Response> => {
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

	if (isCacheableToR2) {
		const r2Response = await fetchFromR2({
			bucket: bucket,
			key: objectKey
		});

		if (r2Response) {
			console.log(`Read from R2 for: ${req.url}.`);
			await cache.put(cacheKey, r2Response.clone())
			return r2Response;
		}
	}

	const originRequestUrl = new URL(`http://${env.ORIGIN_APT_SERVER}${url.pathname}`)
	const originResponse = await fetchFromOrigin(originRequestUrl)

	if (!originResponse.ok) {
		return new Response('Forbidden', { status: 403 });
	}

	if (isCacheableToR2) {
		const res = await storeToR2({
			bucket: bucket,
			key: objectKey,
			origin_response: originResponse,
		})

		if(!res.ok){
			return new Response('Internal Server Error', { status: 500 });
		}
	}

	console.log(`Read from Origin for: ${req.url}.`);
	await cache.put(cacheKey, originResponse.clone())
	return originResponse
};
