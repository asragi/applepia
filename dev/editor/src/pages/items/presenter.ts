import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { fetchMaster, saveMaster, fetchRelation, saveRelation } from "../../api/client.ts";
import type { ItemMaster, ExploreMaster } from "../../types/masters.ts";
import type { EarningItem, ConsumingItem, ItemExploreRelation } from "../../types/relations.ts";

export function useItemsPresenter() {
	const [data, setData] = useState<ItemMaster[]>([]);
	const [explores, setExplores] = useState<ExploreMaster[]>([]);
	const [earningItems, setEarningItems] = useState<EarningItem[]>([]);
	const [consumingItems, setConsumingItems] = useState<ConsumingItem[]>([]);
	const [itemExplores, setItemExplores] = useState<ItemExploreRelation[]>([]);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const loadData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const [items, exploreData, earning, consuming, itemExploreRel] = await Promise.all([
				fetchMaster<ItemMaster>("items"),
				fetchMaster<ExploreMaster>("explores"),
				fetchRelation<EarningItem>("earning-items"),
				fetchRelation<ConsumingItem>("consuming-items"),
				fetchRelation<ItemExploreRelation>("item-explores"),
			]);
			setData(items);
			setExplores(exploreData);
			setEarningItems(earning);
			setConsumingItems(consuming);
			setItemExplores(itemExploreRel);
		} catch (e) {
			setError(e instanceof Error ? e.message : "読み込みに失敗しました");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	useEffect(() => {
		const handleReload = () => loadData();
		const handleSave = async () => {
			try {
				await Promise.all([
					saveMaster("items", data),
					saveRelation("earning-items", earningItems),
					saveRelation("consuming-items", consumingItems),
					saveRelation("item-explores", itemExplores),
				]);
			} finally {
				window.dispatchEvent(new CustomEvent("editor:save-complete"));
			}
		};

		window.addEventListener("editor:reload", handleReload);
		window.addEventListener("editor:save", handleSave);
		return () => {
			window.removeEventListener("editor:reload", handleReload);
			window.removeEventListener("editor:save", handleSave);
		};
	}, [loadData, data, earningItems, consumingItems, itemExplores]);

	const updateSelectedParam = useCallback(
		(item: ItemMaster | null) => {
			setSearchParams((prev) => {
				const next = new URLSearchParams(prev);
				if (item) {
					next.set("selected", String(item.item_id));
				} else {
					next.delete("selected");
				}
				return next;
			});
		},
		[setSearchParams]
	);

	const onSelect = useCallback(
		(id: number) => {
			setSelectedId((prev) => {
				if (prev === id) {
					updateSelectedParam(null);
					return null;
				}
				const nextItem = data.find((item) => item.id === id) ?? null;
				updateSelectedParam(nextItem);
				return nextItem ? id : prev;
			});
		},
		[data, updateSelectedParam]
	);

	const onUpdate = useCallback(
		(id: number, field: keyof ItemMaster, value: string | number) => {
			setData((prev) =>
				prev.map((item) =>
					item.id === id ? { ...item, [field]: value } : item
				)
			);
			window.dispatchEvent(new CustomEvent("editor:change"));
		},
		[]
	);

	const onDelete = useCallback(
		(id: number) => {
			setData((prev) => prev.filter((item) => item.id !== id));
			setSelectedId((prev) => {
				if (prev === id) {
					updateSelectedParam(null);
					return null;
				}
				return prev;
			});
			window.dispatchEvent(new CustomEvent("editor:change"));
		},
		[updateSelectedParam]
	);

	const onAdd = useCallback(() => {
		const maxId = data.reduce((max, item) => Math.max(max, item.id), 0);
		const maxItemId = data.reduce(
			(max, item) => Math.max(max, item.item_id),
			0
		);
		const newItem: ItemMaster = {
			id: maxId + 1,
			item_id: maxItemId + 1,
			DisplayName: "新規アイテム",
			Description: "",
			Price: 100,
			MaxStock: 100,
			Attraction: 100,
			PurchaseProb: 0.5,
		};
		setData((prev) => [...prev, newItem]);
		setSelectedId(newItem.id);
		updateSelectedParam(newItem);
		window.dispatchEvent(new CustomEvent("editor:change"));
	}, [data, updateSelectedParam]);

	const selectedItem = data.find((item) => item.id === selectedId) ?? null;

	useEffect(() => {
		const selectedParam = searchParams.get("selected");
		if (!selectedParam || data.length === 0) return;

		const masterId = Number(selectedParam);
		if (Number.isNaN(masterId)) return;

		const record = data.find((item) => item.item_id === masterId);
		if (record) {
			setSelectedId(record.id);
		}
	}, [searchParams, data]);

	useEffect(() => {
		if (selectedId === null) return;
		const exists = data.some((item) => item.id === selectedId);
		if (!exists) {
			setSelectedId(null);
			updateSelectedParam(null);
		}
	}, [data, selectedId, updateSelectedParam]);

	// 選択中アイテムの関連探索を取得
	const getRelatedExplores = useCallback(() => {
		if (!selectedItem) return { earning: [], consuming: [], related: [] };

		const itemId = selectedItem.item_id;

		// 獲得できる探索
		const earningExplores = earningItems
			.filter((e) => e.ItemId === itemId)
			.map((e) => {
				const explore = explores.find((exp) => exp.ExploreId === e.ExploreId);
				return {
					id: e.id,
					exploreId: e.ExploreId,
					label: explore?.DisplayName ?? `探索${e.ExploreId}`,
					description: `獲得: ${e.MinCount}-${e.MaxCount}個`,
				};
			});

		// 消費される探索
		const consumingExplores = consumingItems
			.filter((c) => c.ItemId === itemId)
			.map((c) => {
				const explore = explores.find((exp) => exp.ExploreId === c.ExploreId);
				return {
					id: c.id,
					exploreId: c.ExploreId,
					label: explore?.DisplayName ?? `探索${c.ExploreId}`,
					description: `消費: 最大${c.MaxCount}個`,
				};
			});

		// 関連探索（item-explore-relations）
		const relatedExplores = itemExplores
			.filter((ie) => ie.item_id === itemId)
			.map((ie) => {
				const explore = explores.find(
					(exp) =>
						(typeof exp.ExploreId === "number" && exp.ExploreId === ie.explore_id) ||
						exp.ExploreId === ie.explore_id
				);
				return {
					id: ie.id,
					exploreId: ie.explore_id,
					label: explore?.DisplayName ?? `探索${ie.explore_id}`,
					description: "関連",
				};
			});

		return { earning: earningExplores, consuming: consumingExplores, related: relatedExplores };
	}, [selectedItem, earningItems, consumingItems, itemExplores, explores]);

	const onRemoveEarning = useCallback((id: number) => {
		setEarningItems((prev) => prev.filter((e) => e.id !== id));
		window.dispatchEvent(new CustomEvent("editor:change"));
	}, []);

	const onRemoveConsuming = useCallback((id: number) => {
		setConsumingItems((prev) => prev.filter((c) => c.id !== id));
		window.dispatchEvent(new CustomEvent("editor:change"));
	}, []);

	const onRemoveItemExplore = useCallback((id: number) => {
		setItemExplores((prev) => prev.filter((ie) => ie.id !== id));
		window.dispatchEvent(new CustomEvent("editor:change"));
	}, []);

	const onAddEarning = useCallback(
		(exploreId: number, minCount: number, maxCount: number, probability: number) => {
			if (!selectedItem) return;
			const maxId = earningItems.reduce((max, e) => Math.max(max, e.id), 0);
			const newItem: EarningItem = {
				id: maxId + 1,
				ExploreId: exploreId,
				ItemId: selectedItem.item_id,
				MinCount: minCount,
				MaxCount: maxCount,
				probability,
			};
			setEarningItems((prev) => [...prev, newItem]);
			window.dispatchEvent(new CustomEvent("editor:change"));
		},
		[selectedItem, earningItems]
	);

	const onAddConsuming = useCallback(
		(exploreId: number, maxCount: number, consumptionProb: number) => {
			if (!selectedItem) return;
			const maxId = consumingItems.reduce((max, c) => Math.max(max, c.id), 0);
			const newItem: ConsumingItem = {
				id: maxId + 1,
				ExploreId: exploreId,
				ItemId: selectedItem.item_id,
				MaxCount: maxCount,
				ConsumptionProb: consumptionProb,
			};
			setConsumingItems((prev) => [...prev, newItem]);
			window.dispatchEvent(new CustomEvent("editor:change"));
		},
		[selectedItem, consumingItems]
	);

	return {
		data,
		explores,
		selectedId,
		selectedItem,
		isLoading,
		error,
		onSelect,
		onUpdate,
		onDelete,
		onAdd,
		getRelatedExplores,
		onRemoveEarning,
		onRemoveConsuming,
		onRemoveItemExplore,
		onAddEarning,
		onAddConsuming,
	};
}
