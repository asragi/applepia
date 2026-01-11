import { useAuthCallbackPresenter } from "./presenter";
import { AuthCallbackView } from "./view";

export const AuthCallbackPage = () => {
	const { status, message } = useAuthCallbackPresenter();
	return <AuthCallbackView status={status} message={message} />;
};
