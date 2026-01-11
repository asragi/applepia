export type Column<T> = {
	key: keyof T;
	label: string;
	type: "text" | "number";
	width?: string;
	editable?: boolean;
};

export type DataTableProps<T extends { id: number }> = {
	columns: Column<T>[];
	data: T[];
	selectedId: number | null;
	onSelect: (id: number) => void;
	onUpdate: (id: number, field: keyof T, value: string | number) => void;
	onDelete: (id: number) => void;
	onAdd: () => void;
};
