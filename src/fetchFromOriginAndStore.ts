import { createEmptyHtmlResponse } from '../src/createEmptyHtmlResponse';
import { isHtmlResponse } from '../src/isHtmlResponse';
import { fetchFromOrigin } from '../src/fetchFromOrigin';


type Params = {
	bucket: R2Bucket;
	key: string;
	url: URL;
}


const storeInBucket = async (bucket: R2Bucket, key: string, body: ArrayBuffer): Promise<void> => {
	await bucket.put(key, body);
};

const createBinaryResponse = (body: ArrayBuffer): Response => {
	return new Response(body, {
		headers: {
			'Content-Type': 'application/octet-stream',
			'Cache-Control': 'public, max-age=31536000',
		},
	});
};

export const fetchFromOriginAndStore = async ({ bucket, key, url }: Params): Promise<Response> => {
	const originResponse = await fetchFromOrigin(url);

	if (!originResponse.ok) {
		return originResponse;
	}

	if (isHtmlResponse({ response: originResponse })) {
		return createEmptyHtmlResponse();
	}

	const originBody = await originResponse.clone().arrayBuffer();
	await storeInBucket(bucket, key, originBody);

	return createBinaryResponse(originBody);
};
