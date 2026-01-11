import { ListPanelNavLink } from "../../list-panel";
import { ItemPanelMiniContent } from "../common/view";

type ItemViewProps = {
	item: {
		name: string;
		icon: string;
		price: number;
		stock: number;
	};
	to?: string;
};

export const ItemView = ({ item, to = "" }: ItemViewProps) => {
	return (
		<ListPanelNavLink to={to}>
			<ItemPanelMiniContent item={item} />
		</ListPanelNavLink>
	);
};
