export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const GOOGLE_SCOPES = ["openid", "email", "profile"];
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";
export const BACKEND_HTTP_URL =
	import.meta.env.VITE_BACKEND_HTTP_URL ?? "http://localhost:8080";

export const OAUTH_STORAGE_KEYS = {
	codeVerifier: "oauth_code_verifier",
	state: "oauth_state",
	flow: "oauth_flow",
};

export const OAUTH_FLOW = {
	login: "login",
	link: "link",
} as const;

export const getRedirectUri = () => `${window.location.origin}/auth/callback`;
