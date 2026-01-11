import { createContext, type ReactNode, useContext } from "react";

type AuthContextType = {
	isAuthenticated: boolean;
	token: string | null;
	userId: string | null;
	password: string | null;
	login: (token: string) => void;
	logout: () => void;
	saveCredentials: (userId: string, password: string) => void;
};

export const TOKEN_KEY = "auth_token";
export const USER_ID_KEY = "auth_user_id";
export const PASSWORD_KEY = "auth_password";

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within AuthProvider");
	}
	return context;
};

export type { AuthContextType, ReactNode };
