import { useAccountSettingsPresenter } from "./presenter";
import { AccountSettingsView } from "./view";

export const AccountSettingsPage = () => {
	const { linked, error, onLinkGoogle } = useAccountSettingsPresenter();
	return (
		<AccountSettingsView
			linked={linked}
			error={error}
			onLinkGoogle={onLinkGoogle}
		/>
	);
};
