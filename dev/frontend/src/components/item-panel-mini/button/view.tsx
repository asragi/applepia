import { ListPanelButton } from "../../list-panel";
import { ItemPanelMiniContent } from "../common/view";

type ItemViewProps = {
	item: {
		name: string;
		icon: string;
		price: number;
		stock: number;
	};
	onClick: () => void;
	isActive: boolean;
};

export const ItemView = ({ item, onClick, isActive }: ItemViewProps) => {
	return (
		<ListPanelButton onClick={onClick} isActive={isActive}>
			<ItemPanelMiniContent item={item} />
		</ListPanelButton>
	);
};
