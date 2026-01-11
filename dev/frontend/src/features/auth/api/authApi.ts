import { BACKEND_HTTP_URL } from "../constants";

type TokenResponse = {
	token: string;
};

type StatusResponse = {
	status: string;
};

type ErrorResponse = {
	error: string;
};

const postJson = async <T>(path: string, body: Record<string, string>) => {
	const response = await fetch(`${BACKEND_HTTP_URL}${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

	if (!response.ok) {
		const payload = (await response
			.json()
			.catch(() => null)) as ErrorResponse | null;
		const message = payload?.error ?? "リクエストに失敗しました";
		throw new Error(message);
	}

	return (await response.json()) as T;
};

export const postGoogleCallback = async (
	code: string,
	codeVerifier: string,
): Promise<string> => {
	const data = await postJson<TokenResponse>("/auth/google/callback", {
		code,
		code_verifier: codeVerifier,
	});
	return data.token;
};

export const postGoogleLink = async (
	token: string,
	code: string,
	codeVerifier: string,
): Promise<void> => {
	await postJson<StatusResponse>("/auth/google/link", {
		token,
		code,
		code_verifier: codeVerifier,
	});
};
