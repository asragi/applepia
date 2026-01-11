import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
	postGoogleCallback,
	postGoogleLink,
} from "../../../features/auth/api/authApi";
import {
	OAUTH_FLOW,
	OAUTH_STORAGE_KEYS,
} from "../../../features/auth/constants";
import { useAuth } from "../../../features/auth/hooks/useAuth";

type CallbackState = {
	status: "loading" | "success" | "error";
	message: string;
};

export const useAuthCallbackPresenter = () => {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const { login, token } = useAuth();
	const [state, setState] = useState<CallbackState>({
		status: "loading",
		message: "認証結果を確認しています...",
	});

	useEffect(() => {
		const code = params.get("code");
		const returnedState = params.get("state");
		const storedState = sessionStorage.getItem(OAUTH_STORAGE_KEYS.state);
		const codeVerifier = sessionStorage.getItem(
			OAUTH_STORAGE_KEYS.codeVerifier,
		);
		const flow =
			sessionStorage.getItem(OAUTH_STORAGE_KEYS.flow) ?? OAUTH_FLOW.login;

		if (!code || !returnedState || !codeVerifier) {
			setState({ status: "error", message: "認証情報が不足しています" });
			return;
		}
		if (storedState && storedState !== returnedState) {
			setState({ status: "error", message: "state が一致しません" });
			return;
		}

		const run = async () => {
			try {
				if (flow === OAUTH_FLOW.link) {
					if (!token) {
						throw new Error("ログイン状態がありません");
					}
					await postGoogleLink(token, code, codeVerifier);
					localStorage.setItem("oauth_google_linked", "true");
					setState({ status: "success", message: "連携が完了しました" });
					navigate("/settings/account", { replace: true });
					return;
				}

				const jwt = await postGoogleCallback(code, codeVerifier);
				login(jwt);
				setState({ status: "success", message: "ログインしました" });
				navigate("/dashboard", { replace: true });
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "認証に失敗しました";
				setState({ status: "error", message });
			} finally {
				sessionStorage.removeItem(OAUTH_STORAGE_KEYS.codeVerifier);
				sessionStorage.removeItem(OAUTH_STORAGE_KEYS.state);
				sessionStorage.removeItem(OAUTH_STORAGE_KEYS.flow);
			}
		};

		void run();
	}, [params, login, navigate, token]);

	return state;
};
