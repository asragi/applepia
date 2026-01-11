import { useState, useMemo } from "react";
import { RecordListView } from "../../components/record-list/index.tsx";
import { RecordDetailView } from "../../components/record-detail/index.tsx";
import { FieldEditorView } from "../../components/field-editor/index.tsx";
import { RelationListView } from "../../components/relation-list/index.tsx";
import { RelationEditorView } from "../../components/relation-editor/index.tsx";
import { useNavigateToRecord } from "../../hooks/useNavigateToRecord.ts";
import type { ItemMaster } from "../../types/masters.ts";
import { useItemsPresenter } from "./presenter.ts";

type ModalType = "earning" | "consuming" | null;

const fields: Array<{ key: keyof ItemMaster; label: string; type: "text" | "number"; editable?: boolean }> = [
	{ key: "id", label: "ID", type: "number", editable: false },
	{ key: "item_id", label: "ItemID", type: "number" },
	{ key: "DisplayName", label: "名前", type: "text" },
	{ key: "Description", label: "説明", type: "text" },
	{ key: "Price", label: "価格", type: "number" },
	{ key: "MaxStock", label: "最大在庫", type: "number" },
	{ key: "Attraction", label: "魅力", type: "number" },
	{ key: "PurchaseProb", label: "購入確率", type: "number" },
];

export function ItemsView() {
	const {
		data,
		explores,
		selectedId,
		selectedItem,
		isLoading,
		error,
		onSelect,
		onUpdate,
		onDelete,
		onAdd,
		getRelatedExplores,
		onRemoveEarning,
		onRemoveConsuming,
		onRemoveItemExplore,
		onAddEarning,
		onAddConsuming,
	} = useItemsPresenter();

	const navigateToRecord = useNavigateToRecord();
	const [modalType, setModalType] = useState<ModalType>(null);
	const [modalValues, setModalValues] = useState<Record<string, number | string>>({});

	const exploreOptions = useMemo(
		() =>
			explores.map((e) => ({
				value: typeof e.ExploreId === "number" ? e.ExploreId : 0,
				label: e.DisplayName,
			})),
		[explores]
	);

	const relatedExplores = getRelatedExplores();

	const handleOpenModal = (type: ModalType) => {
		if (!selectedItem) return;
		setModalType(type);
		setModalValues({});
	};

	const handleCloseModal = () => {
		setModalType(null);
		setModalValues({});
	};

	const handleSaveModal = () => {
		if (!selectedItem) return;

		if (modalType === "earning") {
			onAddEarning(
				Number(modalValues.exploreId),
				Number(modalValues.minCount) || 1,
				Number(modalValues.maxCount) || 1,
				Number(modalValues.probability) || 1
			);
		} else if (modalType === "consuming") {
			onAddConsuming(
				Number(modalValues.exploreId),
				Number(modalValues.maxCount) || 1,
				Number(modalValues.consumptionProb) || 1
			);
		}
		handleCloseModal();
	};

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
								onUpdate(selectedItem.id, key as keyof ItemMaster, value)
							}
						/>

						<div className="border-t border-base-300 pt-4">
							<h4 className="font-bold mb-4">関連する探索</h4>

							<RelationListView
								title="獲得できる探索"
								items={relatedExplores.earning}
								onItemClick={(id) => {
									const target = relatedExplores.earning.find((e) => e.id === id);
									if (target) navigateToRecord("explores", target.exploreId);
								}}
								onRemove={onRemoveEarning}
								onAdd={() => handleOpenModal("earning")}
							/>

							<RelationListView
								title="消費される探索"
								items={relatedExplores.consuming}
								onItemClick={(id) => {
									const target = relatedExplores.consuming.find((e) => e.id === id);
									if (target) navigateToRecord("explores", target.exploreId);
								}}
								onRemove={onRemoveConsuming}
								onAdd={() => handleOpenModal("consuming")}
							/>

							<RelationListView
								title="関連探索"
								items={relatedExplores.related}
								onItemClick={(id) => {
									const target = relatedExplores.related.find((e) => e.id === id);
									if (target) navigateToRecord("explores", target.exploreId);
								}}
								onRemove={onRemoveItemExplore}
								onAdd={() => {}}
							/>
						</div>
					</RecordDetailView>
				) : (
					<div className="flex-1 flex items-center justify-center text-base-content/60">
						左のリストからアイテムを選択してください
					</div>
				)}
			</div>

			{modalType === "earning" && (
				<RelationEditorView
					title="獲得アイテムを追加"
					fields={[
						{ name: "exploreId", label: "探索", type: "select", options: exploreOptions },
						{ name: "minCount", label: "最小数", type: "number" },
						{ name: "maxCount", label: "最大数", type: "number" },
						{ name: "probability", label: "確率", type: "number" },
					]}
					values={modalValues}
					onFieldChange={(name, value) =>
						setModalValues((prev) => ({ ...prev, [name]: value }))
					}
					onSave={handleSaveModal}
					onCancel={handleCloseModal}
				/>
			)}

			{modalType === "consuming" && (
				<RelationEditorView
					title="消費アイテムを追加"
					fields={[
						{ name: "exploreId", label: "探索", type: "select", options: exploreOptions },
						{ name: "maxCount", label: "最大消費数", type: "number" },
						{ name: "consumptionProb", label: "消費確率", type: "number" },
					]}
					values={modalValues}
					onFieldChange={(name, value) =>
						setModalValues((prev) => ({ ...prev, [name]: value }))
					}
					onSave={handleSaveModal}
					onCancel={handleCloseModal}
				/>
			)}
		</div>
	);
}
