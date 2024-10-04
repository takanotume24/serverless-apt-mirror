import { handleGetRequest } from './handleGetRequest';
import type { Context } from 'hono';

export interface Env {
	APT_MIRROR_BUCKET: R2Bucket;
	ORIGIN_APT_SERVER: string;
}


export const handleCacheableGetRequest = async (context: Context<{ Bindings: Env }>): Promise<Response> => {
	const res = await handleGetRequest({
		context: context,
		isCacheableToR2: true,
	})

	return res
};
