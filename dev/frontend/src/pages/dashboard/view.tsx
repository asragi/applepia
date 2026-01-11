import { ItemList } from "../../components/item-list";

export const Dashboard = () => {
	return (
		<div className="h-full flex-1 flex-col flex justify-between">
			<div>今期の売上: 987,987,987,654,321 G</div>
			<ItemList />
		</div>
	);
};
