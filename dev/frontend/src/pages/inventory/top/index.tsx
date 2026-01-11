import type { InventoryItem } from "./list/type";
import { useInventoryTopPresenter } from "./presenter";
import type { InventoryCategory } from "./type";
import { InventoryView } from "./view";

const items: InventoryItem[] = [
	{
		id: "item-1",
		name: "蜜たっぷり特選りんご",
		icon: "🍎",
		categoryId: "produce",
		stock: 142,
		price: 1480,
	},
	{
		id: "item-2",
		name: "星屑ショートケーキ",
		icon: "🍰",
		categoryId: "bakery",
		stock: 26,
		price: 3200,
	},
	{
		id: "item-3",
		name: "焼きたてアップルパイ",
		icon: "🥧",
		categoryId: "bakery",
		stock: 43,
		price: 2200,
	},
	{
		id: "item-4",
		name: "森のはちみつ",
		icon: "🍯",
		categoryId: "craft",
		stock: 64,
		price: 980,
	},
	{
		id: "item-5",
		name: "熟成チーズプレート",
		icon: "🧀",
		categoryId: "craft",
		stock: 12,
		price: 2500,
	},
	{
		id: "item-6",
		name: "月光スパイス麺",
		icon: "🍜",
		categoryId: "special",
		stock: 8,
		price: 1500,
	},
	{
		id: "item-7",
		name: "ロケット",
		icon: "🚀",
		categoryId: "special",
		stock: 2,
		price: 123456789,
	},
	{
		id: "item-8",
		name: "ハーブフォカッチャ",
		icon: "🍞",
		categoryId: "bakery",
		stock: 57,
		price: 680,
	},
	{
		id: "item-9",
		name: "霧木の枝束",
		icon: "🪵",
		categoryId: "craft",
		stock: 310,
		price: 300,
	},
];

const categories: InventoryCategory[] = [
	{ id: "all", label: "すべて" },
	{ id: "produce", label: "生鮮" },
	{ id: "bakery", label: "ベーカリー" },
	{ id: "craft", label: "クラフト" },
	{ id: "special", label: "特別" },
];

export const InventoryPage = () => {
	const {
		items: paginatedItems,
		categories: availableCategories,
		activeCategoryId,
		currentPage,
		totalPages,
		changePage,
		selectCategory,
		showToast,
	} = useInventoryTopPresenter({ items, categories });

	return (
		<InventoryView
			items={paginatedItems}
			categories={availableCategories}
			activeCategoryId={activeCategoryId}
			currentPage={currentPage}
			totalPages={totalPages}
			changePage={changePage}
			selectCategory={selectCategory}
			showToast={showToast}
		/>
	);
};
