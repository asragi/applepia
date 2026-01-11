const base64UrlEncode = (bytes: Uint8Array): string => {
	let binary = "";
	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}
	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
};

const randomBytes = (length: number): Uint8Array => {
	const bytes = new Uint8Array(length);
	crypto.getRandomValues(bytes);
	return bytes;
};

export const generateCodeVerifier = (): string => {
	return base64UrlEncode(randomBytes(64));
};

export const generateCodeChallenge = async (
	verifier: string,
): Promise<string> => {
	const data = new TextEncoder().encode(verifier);
	const digest = await crypto.subtle.digest("SHA-256", data);
	return base64UrlEncode(new Uint8Array(digest));
};

export const generateState = (): string => {
	return base64UrlEncode(randomBytes(16));
};
