import { DataTableView, type Column } from "../../components/data-table/index.tsx";
import type { SkillMaster } from "../../types/masters.ts";
import { useSkillsPresenter } from "./presenter.ts";

const columns: Column<SkillMaster>[] = [
	{ key: "id", label: "ID", type: "number", width: "80px", editable: false },
	{ key: "SkillId", label: "SkillID", type: "number", width: "100px" },
	{ key: "DisplayName", label: "名前", type: "text" },
];

export function SkillsView() {
	const {
		data,
		selectedId,
		isLoading,
		error,
		onSelect,
		onUpdate,
		onDelete,
		onAdd,
	} = useSkillsPresenter();

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<span className="loading loading-spinner loading-lg" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="alert alert-error">
					<span>{error}</span>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<div className="p-4 border-b border-base-300">
				<h2 className="text-xl font-bold">スキルマスタ</h2>
				<p className="text-sm text-base-content/70">
					{data.length} 件のスキル
				</p>
			</div>

			<div className="flex-1 overflow-auto">
				<DataTableView
					columns={columns}
					data={data}
					selectedId={selectedId}
					onSelect={onSelect}
					onUpdate={onUpdate}
					onDelete={onDelete}
					onAdd={onAdd}
				/>
			</div>
		</div>
	);
}
