import type { ReactNode } from "react";
import { Button } from "../../button";
import { ListPanelLayout } from "../list-panel-layout";

type Props = {
	children: ReactNode;
	isActive: boolean;
	onClick?: () => void;
};

export const ListPanelButtonView = ({ children, isActive, onClick }: Props) => {
	return (
		<ListPanelLayout>
			<Button isActive={isActive} onClick={onClick}>
				{children}
			</Button>
		</ListPanelLayout>
	);
};
