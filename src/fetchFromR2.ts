import { createR2Response } from './createR2Response';

type Params = {
	bucket: R2Bucket;
	key: string;
}

// 関数: R2からオブジェクトを取得する
export const fetchFromR2 = async ({ bucket, key }: Params): Promise<Response | null> => {
	const object = await bucket.get(key) as R2ObjectBody | null;
	return object ? createR2Response({ object: object }) : null;
};
