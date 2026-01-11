import { ItemListEmpty } from "../item-list-empty";
import { ItemPanel, type ItemPanelProps } from "../item-panel";
import { ListPanelContainer } from "../list-panel-container";

type Props = {
	items: ItemPanelProps[];
	isEmpty: boolean;
};

export const ItemListView = ({ items, isEmpty }: Props) => {
	return (
		<section className="bg-base-200 rounded-xl h-full max-w-4xl w-full mx-auto">
			<ListPanelContainer anchorBottom>
				{items.map((item, index) => (
					<ItemPanel key={String(index)} {...item} />
				))}
				{isEmpty ? <ItemListEmpty /> : null}
			</ListPanelContainer>
		</section>
	);
};
