import { ItemDetailPage } from "../../../detail";
import { ItemExplorePage } from "../../../explore";
import type { Mode } from "./mode";

type Props = {
	mode: Mode;
	renderModal: ({ children }: { children: React.ReactNode }) => React.ReactNode;
};

export const InventoryModalView = ({ mode, renderModal }: Props) => {
	const renderChildren = (mode: Mode) => {
		if (mode === "detail") return <ItemDetailPage />;
		if (mode === "explore") return <ItemExplorePage />;
		throw new Error("Invalid mode");
	};

	return renderModal({ children: renderChildren(mode) });
};
