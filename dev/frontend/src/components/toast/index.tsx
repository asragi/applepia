import { usePresenter } from "./presenter";
import type { InfoType } from "./types";
import { View } from "./view";

type Props = {
	infoType: InfoType;
	children: React.ReactNode;
};

export const Toast = ({ infoType, children }: Props) => {
	const { infoClass, render, visible } = usePresenter({ infoType });
	return (
		<View infoClass={infoClass} render={render} visible={visible}>
			{children}
		</View>
	);
};

export type { InfoType } from "./types";
