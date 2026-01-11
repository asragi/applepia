import { ItemDetailView } from "./view";

const sampleExplores = [
	{ label: "月面探査", id: "moon" },
	{ label: "火星探査", id: "mars" },
	{ label: "小惑星探査", id: "asteroid" },
];

const history = [{ label: "倉庫", href: "/inventory" }];

export const ItemDetailPage = () => (
	<ItemDetailView
		history={history}
		currentLabel="アイテム詳細"
		explores={sampleExplores}
	/>
);
