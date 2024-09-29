type Params = {
	method: string;
}
export const authorizeRequest = ({ method }: Params): boolean => method === "GET";
