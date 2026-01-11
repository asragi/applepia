import { ItemPanel } from "../../../../components/item-panel";
import { ListPanelContainer } from "../../../../components/list-panel-container";
import { EmptyView } from "./empty/view";

export type ItemViewType = {
	id: string;
	name: string;
	icon: string;
	stock: number;
	price: number;
};

type Props = {
	items: ItemViewType[];
};

export const ListView = ({ items }: Props) => {
	return (
		<ListPanelContainer>
			{items.map((item) => (
				<ItemPanel
					key={item.id}
					icon={item.icon}
					name={item.name}
					stock={item.stock}
					price={item.price}
					to={`/inventory/detail/${item.id}`}
				/>
			))}
			{items.length === 0 ? <EmptyView /> : null}
		</ListPanelContainer>
	);
};
