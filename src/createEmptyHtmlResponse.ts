export const createEmptyHtmlResponse = (): Response => {
	return new Response('<html></html>', {
		headers: {
			'Content-Type': 'text/html',
		},
	});
};
