import { useLoginPresenter } from "./presenter";
import { LoginView } from "./view";

export const LoginPage = () => {
	const {
		userId,
		password,
		error,
		savedNotice,
		hasSavedCredentials,
		onSubmit,
		onGoogleLogin,
		onUserIdChange,
		onPasswordChange,
	} = useLoginPresenter();

	return (
		<LoginView
			userId={userId}
			password={password}
			error={error}
			savedNotice={savedNotice}
			hasSavedCredentials={hasSavedCredentials}
			onSubmit={onSubmit}
			onGoogleLogin={onGoogleLogin}
			onUserIdChange={onUserIdChange}
			onPasswordChange={onPasswordChange}
		/>
	);
};
