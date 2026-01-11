import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { fetchMaster, saveMaster } from "../../api/client.ts";
import type { StageMaster } from "../../types/masters.ts";

export function useStagesPresenter() {
	const [data, setData] = useState<StageMaster[]>([]);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const loadData = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const stages = await fetchMaster<StageMaster>("stages");
			setData(stages);
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
				await saveMaster("stages", data);
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
	}, [loadData, data]);

	const updateSelectedParam = useCallback(
		(item: StageMaster | null) => {
			setSearchParams((prev) => {
				const next = new URLSearchParams(prev);
				if (item) {
					next.set("selected", String(item.stage_id));
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
		(id: number, field: keyof StageMaster, value: string | number) => {
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
		const maxStageId = data.reduce(
			(max, item) => Math.max(max, item.stage_id),
			0
		);
		const newItem: StageMaster = {
			id: maxId + 1,
			stage_id: maxStageId + 1,
			display_name: "新規ステージ",
			description: "",
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

		const record = data.find((item) => item.stage_id === masterId);
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

	return {
		data,
		selectedId,
		selectedItem,
		isLoading,
		error,
		onSelect,
		onUpdate,
		onDelete,
		onAdd,
	};
}
