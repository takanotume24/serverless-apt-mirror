export const fetchFromOrigin = async (url: URL): Promise<Response> => {
	const response = await fetch(url);
	
	return response;
};
