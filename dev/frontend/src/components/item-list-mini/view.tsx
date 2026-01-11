import { ItemPanelMiniButton } from "../item-panel-mini";
import { ListPanelContainer } from "../list-panel-container";

type Props = {
	items: {
		id: string;
		icon: string;
		name: string;
		price: number;
		stock: number;
		soldThisTerm: number;
	}[];
	selectedIndex: number;
	onSelect: (index: number) => void;
};

export const ItemList = ({ items, selectedIndex, onSelect }: Props) => {
	return (
		<section className="bg-base-200 rounded-xl max-w-4xl w-full mx-auto">
			<ListPanelContainer anchorBottom>
				{items.map((item, index) => (
					<ItemPanelMiniButton
						key={item.id}
						item={item}
						isActive={selectedIndex === index}
						onClick={() => onSelect(index)}
					/>
				))}
			</ListPanelContainer>
		</section>
	);
};
