import type { ItemListItem } from "./type";

type Props = {
	items: ItemListItem[];
};

export const useItemListPresenter = ({ items }: Props) => {
	const isEmpty = items.length === 0;

	return {
		items,
		isEmpty,
	};
};
