import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { fetchMaster, saveMaster, fetchRelation, saveRelation } from "../../api/client.ts";
import type { ExploreMaster, ItemMaster, SkillMaster } from "../../types/masters.ts";
import type { EarningItem, ConsumingItem, RequiredSkill, SkillGrowth } from "../../types/relations.ts";

export function useExploresPresenter() {
	const [data, setData] = useState<ExploreMaster[]>([]);
	const [items, setItems] = useState<ItemMaster[]>([]);
	const [skills, setSkills] = useState<SkillMaster[]>([]);
	const [earningItems, setEarningItems] = useState<EarningItem[]>([]);
	const [consumingItems, setConsumingItems] = useState<ConsumingItem[]>([]);
	const [requiredSkills, setRequiredSkills] = useState<RequiredSkill[]>([]);
	const [skillGrowth, setSkillGrowth] = useState<SkillGrowth[]>([]);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const loadData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const [explores, itemData, skillData, earning, consuming, required, growth] =
				await Promise.all([
					fetchMaster<ExploreMaster>("explores"),
					fetchMaster<ItemMaster>("items"),
					fetchMaster<SkillMaster>("skills"),
					fetchRelation<EarningItem>("earning-items"),
					fetchRelation<ConsumingItem>("consuming-items"),
					fetchRelation<RequiredSkill>("required-skills"),
					fetchRelation<SkillGrowth>("skill-growth"),
				]);
			setData(explores);
			setItems(itemData);
			setSkills(skillData);
			setEarningItems(earning);
			setConsumingItems(consuming);
			setRequiredSkills(required);
			setSkillGrowth(growth);
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
					saveMaster("explores", data),
					saveRelation("earning-items", earningItems),
					saveRelation("consuming-items", consumingItems),
					saveRelation("required-skills", requiredSkills),
					saveRelation("skill-growth", skillGrowth),
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
	}, [loadData, data, earningItems, consumingItems, requiredSkills, skillGrowth]);

	const updateSelectedParam = useCallback(
		(item: ExploreMaster | null) => {
			setSearchParams((prev) => {
				const next = new URLSearchParams(prev);
				if (item && typeof item.ExploreId === "number") {
					next.set("selected", String(item.ExploreId));
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
				updateSelectedParam(nextItem ?? null);
				return nextItem ? id : prev;
			});
		},
		[data, updateSelectedParam]
	);

	const onUpdate = useCallback(
		(id: number, field: keyof ExploreMaster, value: string | number) => {
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
		const maxExploreId = data.reduce(
			(max, item) =>
				typeof item.ExploreId === "number"
					? Math.max(max, item.ExploreId)
					: max,
			0
		);
		const newItem: ExploreMaster = {
			id: maxId + 1,
			ExploreId: maxExploreId + 1,
			DisplayName: "新規探索",
			Description: "",
			ConsumingStamina: 100,
			RequiredPayment: 0,
			StaminaReducibleRate: 0.5,
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

		const record = data.find(
			(item) => typeof item.ExploreId === "number" && item.ExploreId === masterId
		);
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

	// 選択中探索の関連データを取得
	const getRelatedData = useCallback(() => {
		if (!selectedItem) return { earning: [], consuming: [], required: [], growth: [] };

		const exploreId = selectedItem.ExploreId;

		// 獲得アイテム
		const earningItemsList = earningItems
			.filter((e) => e.ExploreId === exploreId)
			.map((e) => {
				const item = items.find((i) => i.item_id === e.ItemId);
				return {
					id: e.id,
					itemId: e.ItemId,
					label: item?.DisplayName ?? `アイテム${e.ItemId}`,
					description: `${e.MinCount}-${e.MaxCount}個 (確率: ${e.probability})`,
				};
			});

		// 消費アイテム
		const consumingItemsList = consumingItems
			.filter((c) => c.ExploreId === exploreId)
			.map((c) => {
				const item = items.find((i) => i.item_id === c.ItemId);
				return {
					id: c.id,
					itemId: c.ItemId,
					label: item?.DisplayName ?? `アイテム${c.ItemId}`,
					description: `最大${c.MaxCount}個 (確率: ${c.ConsumptionProb})`,
				};
			});

		// 必要スキル
		const requiredSkillsList = requiredSkills
			.filter((r) => r.ExploreId === exploreId)
			.map((r) => {
				const skill = skills.find((s) => s.SkillId === r.RequiredSkillId);
				return {
					id: r.id,
					skillId: r.RequiredSkillId,
					label: skill?.DisplayName ?? `スキル${r.RequiredSkillId}`,
					description: `Lv.${r.SkillLv}`,
				};
			});

		// スキル成長
		const skillGrowthList = skillGrowth
			.filter((g) => g.explore_id === exploreId)
			.map((g) => {
				const skill = skills.find((s) => s.SkillId === g.skill_id);
				return {
					id: g.id,
					skillId: g.skill_id,
					label: skill?.DisplayName ?? `スキル${g.skill_id}`,
					description: `+${g.gaining_point}pt`,
				};
			});

		return {
			earning: earningItemsList,
			consuming: consumingItemsList,
			required: requiredSkillsList,
			growth: skillGrowthList,
		};
	}, [selectedItem, earningItems, consumingItems, requiredSkills, skillGrowth, items, skills]);

	const onRemoveEarning = useCallback((id: number) => {
		setEarningItems((prev) => prev.filter((e) => e.id !== id));
		window.dispatchEvent(new CustomEvent("editor:change"));
	}, []);

	const onRemoveConsuming = useCallback((id: number) => {
		setConsumingItems((prev) => prev.filter((c) => c.id !== id));
		window.dispatchEvent(new CustomEvent("editor:change"));
	}, []);

	const onRemoveRequired = useCallback((id: number) => {
		setRequiredSkills((prev) => prev.filter((r) => r.id !== id));
		window.dispatchEvent(new CustomEvent("editor:change"));
	}, []);

	const onRemoveGrowth = useCallback((id: number) => {
		setSkillGrowth((prev) => prev.filter((g) => g.id !== id));
		window.dispatchEvent(new CustomEvent("editor:change"));
	}, []);

	const onAddEarning = useCallback(
		(itemId: number, minCount: number, maxCount: number, probability: number) => {
			if (!selectedItem || typeof selectedItem.ExploreId !== "number") return;
			const maxId = earningItems.reduce((max, e) => Math.max(max, e.id), 0);
			const newItem: EarningItem = {
				id: maxId + 1,
				ExploreId: selectedItem.ExploreId,
				ItemId: itemId,
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
		(itemId: number, maxCount: number, consumptionProb: number) => {
			if (!selectedItem) return;
			const maxId = consumingItems.reduce((max, c) => Math.max(max, c.id), 0);
			const newItem: ConsumingItem = {
				id: maxId + 1,
				ExploreId: selectedItem.ExploreId,
				ItemId: itemId,
				MaxCount: maxCount,
				ConsumptionProb: consumptionProb,
			};
			setConsumingItems((prev) => [...prev, newItem]);
			window.dispatchEvent(new CustomEvent("editor:change"));
		},
		[selectedItem, consumingItems]
	);

	const onAddRequired = useCallback(
		(skillId: number, skillLv: number) => {
			if (!selectedItem || typeof selectedItem.ExploreId !== "number") return;
			const maxId = requiredSkills.reduce((max, r) => Math.max(max, r.id), 0);
			const newItem: RequiredSkill = {
				id: maxId + 1,
				ExploreId: selectedItem.ExploreId,
				RequiredSkillId: skillId,
				SkillLv: skillLv,
			};
			setRequiredSkills((prev) => [...prev, newItem]);
			window.dispatchEvent(new CustomEvent("editor:change"));
		},
		[selectedItem, requiredSkills]
	);

	const onAddGrowth = useCallback(
		(skillId: number, gainingPoint: number) => {
			if (!selectedItem || typeof selectedItem.ExploreId !== "number") return;
			const maxId = skillGrowth.reduce((max, g) => Math.max(max, g.id), 0);
			const newItem: SkillGrowth = {
				id: maxId + 1,
				explore_id: selectedItem.ExploreId,
				skill_id: skillId,
				gaining_point: gainingPoint,
			};
			setSkillGrowth((prev) => [...prev, newItem]);
			window.dispatchEvent(new CustomEvent("editor:change"));
		},
		[selectedItem, skillGrowth]
	);

	return {
		data,
		items,
		skills,
		selectedId,
		selectedItem,
		isLoading,
		error,
		onSelect,
		onUpdate,
		onDelete,
		onAdd,
		getRelatedData,
		onRemoveEarning,
		onRemoveConsuming,
		onRemoveRequired,
		onRemoveGrowth,
		onAddEarning,
		onAddConsuming,
		onAddRequired,
		onAddGrowth,
	};
}
