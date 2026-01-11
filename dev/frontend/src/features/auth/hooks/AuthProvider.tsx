import { type ReactNode, useCallback, useMemo, useState } from "react";
import {
	AuthContext,
	type AuthContextType,
	PASSWORD_KEY,
	TOKEN_KEY,
	USER_ID_KEY,
} from "./useAuth";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [token, setToken] = useState<string | null>(() =>
		localStorage.getItem(TOKEN_KEY),
	);
	const [userId, setUserId] = useState<string | null>(() =>
		localStorage.getItem(USER_ID_KEY),
	);
	const [password, setPassword] = useState<string | null>(() =>
		localStorage.getItem(PASSWORD_KEY),
	);

	const login = useCallback((nextToken: string) => {
		setToken(nextToken);
		localStorage.setItem(TOKEN_KEY, nextToken);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		localStorage.removeItem(TOKEN_KEY);
	}, []);

	const saveCredentials = useCallback(
		(nextUserId: string, nextPassword: string) => {
			setUserId(nextUserId);
			setPassword(nextPassword);
			localStorage.setItem(USER_ID_KEY, nextUserId);
			localStorage.setItem(PASSWORD_KEY, nextPassword);
		},
		[],
	);

	const value = useMemo<AuthContextType>(
		() => ({
			isAuthenticated: Boolean(token),
			token,
			userId,
			password,
			login,
			logout,
			saveCredentials,
		}),
		[token, userId, password, login, logout, saveCredentials],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
