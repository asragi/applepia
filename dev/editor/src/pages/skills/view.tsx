import { RecordListView } from "../../components/record-list/index.tsx";
import { RecordDetailView } from "../../components/record-detail/index.tsx";
import { FieldEditorView } from "../../components/field-editor/index.tsx";
import type { SkillMaster } from "../../types/masters.ts";
import { useSkillsPresenter } from "./presenter.ts";

const fields: Array<{ key: keyof SkillMaster; label: string; type: "text" | "number"; editable?: boolean }> = [
	{ key: "id", label: "ID", type: "number", editable: false },
	{ key: "SkillId", label: "SkillID", type: "number" },
	{ key: "DisplayName", label: "名前", type: "text" },
];

export function SkillsView() {
	const { data, selectedId, selectedItem, isLoading, error, onSelect, onUpdate, onDelete, onAdd } =
		useSkillsPresenter();

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
				getDisplayName={(item) => item.DisplayName}
			/>

			<div className="flex-1 flex flex-col bg-base-100">
				{selectedItem ? (
					<RecordDetailView
						title={selectedItem.DisplayName}
						onDelete={() => onDelete(selectedItem.id)}
					>
						<FieldEditorView
							fields={fields}
							values={selectedItem}
							onUpdate={(key, value) =>
								onUpdate(selectedItem.id, key as keyof SkillMaster, value)
							}
						/>
					</RecordDetailView>
				) : (
					<div className="flex-1 flex items-center justify-center text-base-content/60">
						左のリストからスキルを選択してください
					</div>
				)}
			</div>
		</div>
	);
}
