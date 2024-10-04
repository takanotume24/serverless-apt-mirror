type Params = {
	bucket: R2Bucket;
	key: string;
	origin_response: Response
}

export const storeToR2 = async ({ bucket, key, origin_response }: Params): Promise<Response> => {
	const originBody = await origin_response.clone().arrayBuffer();
	const res = await bucket.put(key, originBody);

	if (!res) {
		return new Response('Internal Server Error', { status: 500 })
	}

	return new Response('Success', { status: 200 });
};
