import { ItemExploreView } from "./view";

const earningItems = [
	{ icon: "⛏️" },
	{ icon: "⚡" },
	{ icon: "💎" },
	{ icon: "🥇" },
	{ icon: "🪄" },
	{ icon: "🔮" },
	{ icon: "🏺" },
	{ icon: "🌿" },
	{ icon: "🐉" },
	{ icon: "🔥" },
];

const consumingItems = [
	{ icon: "🧪", count: "1" },
	{ icon: "🔥", count: "2" },
	{ icon: "🗝️", count: "3" },
	{ icon: "🌼", count: "1" },
	{ icon: "🏕️", count: "1" },
	{ icon: "🎣", count: "2" },
	{ icon: "🗺️", count: "1" },
	{ icon: "🔨", count: "2" },
	{ icon: "🛠️", count: "1" },
	{ icon: "🍱", count: "5" },
];

export const ItemExplorePage = () => {
	const history = [
		{ label: "倉庫", href: "/inventory" },
		{ label: "アイテム詳細", href: "/inventory/detail/42" },
	];
	const currentLabel = "探索";
	return (
		<ItemExploreView
			history={history}
			currentLabel={currentLabel}
			earningItems={earningItems}
			consumingItems={consumingItems}
		/>
	);
};
