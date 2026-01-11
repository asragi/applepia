import type { ReactNode } from "react";
import { NavLink } from "react-router";
import { ListPanelLayout } from "../list-panel-layout";

type Props = {
	to: string;
	children: ReactNode;
};

export const ListPanelView = ({ children, to }: Props) => {
	return (
		<ListPanelLayout>
			<NavLink
				id="list-panel-button"
				className="w-full h-full flex gap-2 items-stretch px-3 py-2"
				type="button"
				to={to}
			>
				{children}
			</NavLink>
		</ListPanelLayout>
	);
};
