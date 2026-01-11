import { useCallback, useEffect, useState } from "react";
import { fetchMaster, saveMaster } from "../../api/client.ts";
import type { StageMaster } from "../../types/masters.ts";

export function useStagesPresenter() {
	const [data, setData] = useState<StageMaster[]>([]);
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	const onSelect = useCallback((id: number) => {
		setSelectedId((prev) => (prev === id ? null : id));
	}, []);

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

	const onDelete = useCallback((id: number) => {
		setData((prev) => prev.filter((item) => item.id !== id));
		setSelectedId((prev) => (prev === id ? null : prev));
		window.dispatchEvent(new CustomEvent("editor:change"));
	}, []);

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
		window.dispatchEvent(new CustomEvent("editor:change"));
	}, [data]);

	const selectedItem = data.find((item) => item.id === selectedId) ?? null;

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
