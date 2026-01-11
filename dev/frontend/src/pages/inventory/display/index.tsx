import { usePresenter } from "./presenter";
import { DisplayPageView } from "./view";

const displayItems = [
	{
		id: "item-1",
		name: "蜜たっぷり特選りんご",
		icon: "🍎",
		price: 1480,
		stock: 24,
		soldThisTerm: 12,
	},
	{
		id: "item-2",
		name: "焼きたてアップルパイ",
		icon: "🥧",
		price: 2200,
		stock: 15,
		soldThisTerm: 7,
	},
	{
		id: "item-3",
		name: "ハーブフォカッチャ",
		icon: "🍞",
		price: 680,
		stock: 40,
		soldThisTerm: 19,
	},
];

export const ItemDisplayPage = () => {
	const { onSubmit, loading } = usePresenter();
	const history = [
		{ label: "倉庫", href: "/inventory" },
		{ label: "アイテム詳細", href: "/inventory/detail/42" },
	];
	const currentLabel = "陳列";

	return (
		<DisplayPageView
			history={history}
			currentLabel={currentLabel}
			displayItems={displayItems}
			numberInputLabel="価格"
			onSubmit={onSubmit}
			loading={loading}
		/>
	);
};
