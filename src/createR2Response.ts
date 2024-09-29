type Params = {
	object: R2ObjectBody;
}

export const createR2Response = ({ object }: Params): Response => new Response(object.body, {
	headers: {
		'Content-Type': 'application/octet-stream',
		'Cache-Control': 'public, max-age=31536000',
	},
});
