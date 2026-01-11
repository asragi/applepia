import { useCallback, useState } from "react";
import type { Column } from "./type.ts";

type UseDataTablePresenterProps<T extends { id: number }> = {
	data: T[];
	onUpdate: (id: number, field: keyof T, value: string | number) => void;
};

export function useDataTablePresenter<T extends { id: number }>({
	data,
	onUpdate,
}: UseDataTablePresenterProps<T>) {
	const [editingCell, setEditingCell] = useState<{
		id: number;
		field: keyof T;
	} | null>(null);
	const [editValue, setEditValue] = useState<string>("");

	const startEditing = useCallback(
		(id: number, field: keyof T, currentValue: unknown) => {
			setEditingCell({ id, field });
			setEditValue(String(currentValue ?? ""));
		},
		[]
	);

	const cancelEditing = useCallback(() => {
		setEditingCell(null);
		setEditValue("");
	}, []);

	const commitEdit = useCallback(
		(column: Column<T>) => {
			if (!editingCell) return;

			const newValue =
				column.type === "number" ? Number(editValue) : editValue;
			onUpdate(editingCell.id, editingCell.field, newValue);
			setEditingCell(null);
			setEditValue("");
		},
		[editingCell, editValue, onUpdate]
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent, column: Column<T>) => {
			if (e.key === "Enter") {
				commitEdit(column);
			} else if (e.key === "Escape") {
				cancelEditing();
			}
		},
		[commitEdit, cancelEditing]
	);

	const isEditing = useCallback(
		(id: number, field: keyof T) => {
			return editingCell?.id === id && editingCell?.field === field;
		},
		[editingCell]
	);

	return {
		data,
		editingCell,
		editValue,
		setEditValue,
		startEditing,
		cancelEditing,
		commitEdit,
		handleKeyDown,
		isEditing,
	};
}
