import { handleGetRequest } from './handleGetRequest';
import { fetchFromR2 } from './fetchFromR2';
import type { Context } from 'hono';

export interface Env {
	APT_MIRROR_BUCKET: R2Bucket;
	ORIGIN_APT_SERVER: string;
}

// 関数: GETリクエストを処理する
export const handleRelease = async (context: Context<{ Bindings: Env }>): Promise<Response> => {
	const res = await handleGetRequest({
		context: context,
		isCacheableToR2: false,
	})

	return res
};
