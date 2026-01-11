import { ItemExploreResultView } from "./view";

const earningItems = [
	{ icon: "🌕" },
	{ icon: "💎" },
	{ icon: "🪨" },
	{ icon: "🧭" },
	{ icon: "🔭" },
];

const consumingItems = [
	{ icon: "🧪", count: "1" },
	{ icon: "🔥", count: "2" },
	{ icon: "🗺️", count: "1" },
	{ icon: "🍱", count: "3" },
];

export const ItemExploreResultPage = () => {
	const history = [
		{ label: "倉庫", href: "/inventory" },
		{ label: "アイテム詳細", href: "/inventory/detail/42" },
		{ label: "探索", href: "/inventory/explore/42" },
	];
	const currentLabel = "探索結果";

	return (
		<ItemExploreResultView
			history={history}
			currentLabel={currentLabel}
			earningItems={earningItems}
			consumingItems={consumingItems}
		/>
	);
};
