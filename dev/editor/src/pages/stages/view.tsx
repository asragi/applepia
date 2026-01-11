import { DataTableView, type Column } from "../../components/data-table/index.tsx";
import { DetailPanelView } from "../../components/detail-panel/index.tsx";
import type { StageMaster } from "../../types/masters.ts";
import { useStagesPresenter } from "./presenter.ts";

const columns: Column<StageMaster>[] = [
	{ key: "id", label: "ID", type: "number", width: "80px", editable: false },
	{ key: "stage_id", label: "StageID", type: "number", width: "100px" },
	{ key: "display_name", label: "名前", type: "text", width: "150px" },
	{ key: "description", label: "説明", type: "text" },
];

export function StagesView() {
	const {
		data,
		selectedId,
		selectedItem,
		isLoading,
		error,
		onSelect,
		onUpdate,
		onDelete,
		onAdd,
	} = useStagesPresenter();

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
				<h2 className="text-xl font-bold">ステージマスタ</h2>
				<p className="text-sm text-base-content/70">
					{data.length} 件のステージ
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

			{selectedItem && (
				<DetailPanelView
					title={`${selectedItem.display_name} の詳細`}
					onClose={() => onSelect(selectedItem.id)}
				>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<span className="text-sm text-base-content/70">ID</span>
							<p className="font-mono">{selectedItem.id}</p>
						</div>
						<div>
							<span className="text-sm text-base-content/70">StageID</span>
							<p className="font-mono">{selectedItem.stage_id}</p>
						</div>
						<div className="col-span-2">
							<span className="text-sm text-base-content/70">説明</span>
							<p className="whitespace-pre-wrap">
								{selectedItem.description || "(なし)"}
							</p>
						</div>
					</div>
				</DetailPanelView>
			)}
		</div>
	);
}
