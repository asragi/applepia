import { ItemIconMini } from "../../item-icon-mini";
import { ItemName } from "../../item-name";
import { StockView } from "../../stock/view";

type Props = {
	item: {
		name: string;
		icon: string;
		price: number;
		stock: number;
	};
};

export const ItemPanelMiniContent = ({ item }: Props) => {
	return (
		<>
			<ItemIconMini icon={item.icon} />
			<div className="flex gap-x-2 text-sm justify-between w-full">
				<ItemName name={item.name} />
				<div className="flex grow gap-x-1 justify-end">
					<StockView stock={item.stock} />
				</div>
			</div>
		</>
	);
};
