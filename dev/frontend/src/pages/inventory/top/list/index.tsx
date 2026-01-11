import { type ItemViewType, ListView } from "./view";

export const List = ({ items }: { items: ItemViewType[] }) => {
	return <ListView items={items} />;
};
