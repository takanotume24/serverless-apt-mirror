type Params = {
	response: Response;
}

export const isHtmlResponse = ({ response }: Params): boolean => {
	const contentType = response.headers.get('Content-Type') || '';
	return contentType.includes('text/html');
};
