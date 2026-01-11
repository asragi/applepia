import type { FormEvent } from "react";

interface LoginViewProps {
	userId: string;
	password: string;
	error: string | null;
	savedNotice: string | null;
	hasSavedCredentials: boolean;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onGoogleLogin: () => void;
	onUserIdChange: (value: string) => void;
	onPasswordChange: (value: string) => void;
}

export const LoginView = ({
	userId,
	password,
	error,
	savedNotice,
	hasSavedCredentials,
	onSubmit,
	onGoogleLogin,
	onUserIdChange,
	onPasswordChange,
}: LoginViewProps) => {
	return (
		<div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
			<div className="card w-full max-w-md bg-base-100 shadow-xl">
				<div className="card-body gap-4">
					<h1 className="card-title text-2xl">RinGo ログイン</h1>
					{error && <div className="alert alert-error">{error}</div>}
					{savedNotice && (
						<div className="alert alert-success">{savedNotice}</div>
					)}
					<form className="space-y-4" onSubmit={onSubmit}>
						<label className="form-control w-full">
							<span className="label-text">ユーザーID</span>
							<input
								className="input input-bordered w-full"
								value={userId}
								onChange={(event) => onUserIdChange(event.target.value)}
								placeholder="user-xxxx"
							/>
						</label>
						<label className="form-control w-full">
							<span className="label-text">パスワード</span>
							<input
								className="input input-bordered w-full"
								type="password"
								value={password}
								onChange={(event) => onPasswordChange(event.target.value)}
								placeholder="••••••••"
							/>
						</label>
						<button className="btn btn-primary w-full" type="submit">
							端末に保存してログイン
						</button>
					</form>
					<div className="divider">または</div>
					<button
						className="btn btn-outline w-full"
						type="button"
						onClick={onGoogleLogin}
					>
						Googleでログイン
					</button>
					{hasSavedCredentials && (
						<div className="text-sm text-base-content/70">
							端末に保存済みのアカウントがあります。Google連携で端末移行ができます。
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
