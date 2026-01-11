import { useCallback, useState } from "react";
import {
	GOOGLE_AUTH_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_SCOPES,
	getRedirectUri,
	OAUTH_FLOW,
	OAUTH_STORAGE_KEYS,
} from "../../../features/auth/constants";
import { useAuth } from "../../../features/auth/hooks/useAuth";
import {
	generateCodeChallenge,
	generateCodeVerifier,
	generateState,
} from "../../../features/auth/utils/pkce";

export const useAccountSettingsPresenter = () => {
	const { token } = useAuth();
	const [error, setError] = useState<string | null>(null);
	const [linked] = useState(
		() => localStorage.getItem("oauth_google_linked") === "true",
	);

	const onLinkGoogle = useCallback(async () => {
		if (!token) {
			setError("ログイン後に連携してください");
			return;
		}
		if (!GOOGLE_CLIENT_ID) {
			setError("Google Client ID が未設定です");
			return;
		}
		const codeVerifier = generateCodeVerifier();
		const codeChallenge = await generateCodeChallenge(codeVerifier);
		const state = generateState();
		sessionStorage.setItem(OAUTH_STORAGE_KEYS.codeVerifier, codeVerifier);
		sessionStorage.setItem(OAUTH_STORAGE_KEYS.state, state);
		sessionStorage.setItem(OAUTH_STORAGE_KEYS.flow, OAUTH_FLOW.link);

		const params = new URLSearchParams({
			client_id: GOOGLE_CLIENT_ID,
			redirect_uri: getRedirectUri(),
			response_type: "code",
			scope: GOOGLE_SCOPES.join(" "),
			code_challenge: codeChallenge,
			code_challenge_method: "S256",
			state,
		});
		window.location.assign(`${GOOGLE_AUTH_URL}?${params.toString()}`);
	}, [token]);

	return {
		linked,
		error,
		onLinkGoogle,
	};
};
