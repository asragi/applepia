import { type FormEvent, useCallback, useState } from "react";
import {
	GOOGLE_AUTH_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_SCOPES,
	getRedirectUri,
	OAUTH_FLOW,
	OAUTH_STORAGE_KEYS,
} from "../../features/auth/constants";
import { useAuth } from "../../features/auth/hooks/useAuth";
import {
	generateCodeChallenge,
	generateCodeVerifier,
	generateState,
} from "../../features/auth/utils/pkce";

export const useLoginPresenter = () => {
	const {
		userId: savedUserId,
		password: savedPassword,
		saveCredentials,
	} = useAuth();
	const [userId, setUserId] = useState(savedUserId ?? "");
	const [password, setPassword] = useState(savedPassword ?? "");
	const [error, setError] = useState<string | null>(null);
	const [savedNotice, setSavedNotice] = useState<string | null>(null);

	const onSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			if (!userId || !password) {
				setError("ユーザーIDとパスワードを入力してください");
				setSavedNotice(null);
				return;
			}
			saveCredentials(userId, password);
			setError(null);
			setSavedNotice("端末に認証情報を保存しました");
		},
		[userId, password, saveCredentials],
	);

	const onGoogleLogin = useCallback(async () => {
		if (!GOOGLE_CLIENT_ID) {
			setError("Google Client ID が未設定です");
			return;
		}
		const codeVerifier = generateCodeVerifier();
		const codeChallenge = await generateCodeChallenge(codeVerifier);
		const state = generateState();
		sessionStorage.setItem(OAUTH_STORAGE_KEYS.codeVerifier, codeVerifier);
		sessionStorage.setItem(OAUTH_STORAGE_KEYS.state, state);
		sessionStorage.setItem(OAUTH_STORAGE_KEYS.flow, OAUTH_FLOW.login);

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
	}, []);

	return {
		userId,
		password,
		error,
		savedNotice,
		hasSavedCredentials: Boolean(savedUserId && savedPassword),
		onSubmit,
		onGoogleLogin,
		onUserIdChange: setUserId,
		onPasswordChange: setPassword,
	};
};
