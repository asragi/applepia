import { useItemListPresenter } from "./presenter";
import type { ItemListItem } from "./type";
import { ItemListView } from "./view";

const mockItems: ItemListItem[] = [
	{
		id: "item-1",
		icon: "🍎",
		name: "蜜たっぷり特選りんご",
		price: 1480,
		stock: 24,
		soldThisTerm: 12,
		to: "/inventory/detail/item-1",
	},
	{
		id: "item-2",
		icon: "🥧",
		name: "焼きたてアップルパイ",
		price: 2200,
		stock: 15,
		soldThisTerm: 7,
		to: "/inventory/detail/item-2",
	},
	{
		id: "item-3",
		icon: "🍞",
		name: "ハーブフォカッチャ",
		price: 680,
		stock: 40,
		soldThisTerm: 19,
		to: "/inventory/detail/item-3",
	},
	{
		id: "item-4",
		icon: "🍜",
		name: "月光スパイス麺",
		price: 1250,
		stock: 18,
		soldThisTerm: 5,
		to: "/inventory/detail/item-4",
	},
	{
		id: "item-5",
		icon: "🍯",
		name: "森のはちみつ",
		price: 980,
		stock: 33,
		soldThisTerm: 16,
		to: "/inventory/detail/item-5",
	},
	{
		id: "item-6",
		icon: "🧀",
		name: "熟成チーズプレート",
		price: 2650,
		stock: 8,
		soldThisTerm: 3,
		to: "/inventory/detail/item-6",
	},
	{
		id: "item-7",
		icon: "🚀",
		name: "ロケット",
		price: 312000000,
		stock: 12,
		soldThisTerm: 4,
		to: "/inventory/detail/item-7",
	},
	{
		id: "item-8",
		icon: "🍰",
		name: "星屑ショートケーキ",
		price: 1980,
		stock: 20,
		soldThisTerm: 9,
		to: "/inventory/detail/item-8",
	},
];

export const ItemList = () => {
	const { items, isEmpty } = useItemListPresenter({ items: mockItems });

	return <ItemListView items={items} isEmpty={isEmpty} />;
};
