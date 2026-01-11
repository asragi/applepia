export const sleep = <T>(ms: number, value?: T) => {
	return new Promise<T>((resolve) => {
		setTimeout(() => resolve(value as T), ms);
	});
};
