import { RecordListView } from "../../components/record-list/index.tsx";
import { RecordDetailView } from "../../components/record-detail/index.tsx";
import { FieldEditorView } from "../../components/field-editor/index.tsx";
import type { StageMaster } from "../../types/masters.ts";
import { useStagesPresenter } from "./presenter.ts";

const fields: Array<{ key: keyof StageMaster; label: string; type: "text" | "number"; editable?: boolean }> = [
	{ key: "id", label: "ID", type: "number", editable: false },
	{ key: "stage_id", label: "StageID", type: "number" },
	{ key: "display_name", label: "名前", type: "text" },
	{ key: "description", label: "説明", type: "text" },
];

export function StagesView() {
	const { data, selectedId, selectedItem, isLoading, error, onSelect, onUpdate, onDelete, onAdd } =
		useStagesPresenter();

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
		<div className="flex h-full">
			<RecordListView
				items={data}
				selectedId={selectedId}
				onSelect={onSelect}
				onAdd={onAdd}
				getDisplayName={(item) => item.display_name}
			/>

			<div className="flex-1 flex flex-col bg-base-100">
				{selectedItem ? (
					<RecordDetailView
						title={selectedItem.display_name}
						onDelete={() => onDelete(selectedItem.id)}
					>
						<FieldEditorView
							fields={fields}
							values={selectedItem}
							onUpdate={(key, value) =>
								onUpdate(selectedItem.id, key as keyof StageMaster, value)
							}
						/>
					</RecordDetailView>
				) : (
					<div className="flex-1 flex items-center justify-center text-base-content/60">
						左のリストからステージを選択してください
					</div>
				)}
			</div>
		</div>
	);
}
