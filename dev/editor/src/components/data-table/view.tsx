import { useDataTablePresenter } from "./presenter.ts";
import type { Column, DataTableProps } from "./type.ts";

export function DataTableView<T extends { id: number }>({
	columns,
	data,
	selectedId,
	onSelect,
	onUpdate,
	onDelete,
	onAdd,
}: DataTableProps<T>) {
	const {
		editValue,
		setEditValue,
		startEditing,
		commitEdit,
		handleKeyDown,
		isEditing,
	} = useDataTablePresenter({ data, onUpdate });

	const renderCell = (row: T, column: Column<T>) => {
		const value = row[column.key];
		const editing = isEditing(row.id, column.key);

		if (editing && column.editable !== false) {
			return (
				<input
					type={column.type === "number" ? "number" : "text"}
					className="input input-bordered input-sm w-full"
					value={editValue}
					onChange={(e) => setEditValue(e.target.value)}
					onBlur={() => commitEdit(column)}
					onKeyDown={(e) => handleKeyDown(e, column)}
					autoFocus
				/>
			);
		}

		return (
			<span
				className={column.editable !== false ? "cursor-pointer hover:bg-base-300 px-1 rounded" : ""}
				onDoubleClick={() => {
					if (column.editable !== false) {
						startEditing(row.id, column.key, value);
					}
				}}
			>
				{String(value ?? "")}
			</span>
		);
	};

	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra table-pin-rows">
				<thead>
					<tr>
						{columns.map((column) => (
							<th
								key={String(column.key)}
								style={{ width: column.width }}
							>
								{column.label}
							</th>
						))}
						<th className="w-20">操作</th>
					</tr>
				</thead>
				<tbody>
					{data.map((row) => (
						<tr
							key={row.id}
							className={`cursor-pointer ${selectedId === row.id ? "bg-primary/20" : "hover:bg-base-200"}`}
							onClick={() => onSelect(row.id)}
						>
							{columns.map((column) => (
								<td key={String(column.key)}>
									{renderCell(row, column)}
								</td>
							))}
							<td>
								<button
									type="button"
									className="btn btn-ghost btn-xs text-error"
									onClick={(e) => {
										e.stopPropagation();
										onDelete(row.id);
									}}
								>
									削除
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className="p-4">
				<button
					type="button"
					className="btn btn-outline btn-sm"
					onClick={onAdd}
				>
					+ 行を追加
				</button>
			</div>
		</div>
	);
}
