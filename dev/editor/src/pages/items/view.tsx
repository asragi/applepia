import { useState } from "react";
import { DataTableView, type Column } from "../../components/data-table/index.tsx";
import { DetailPanelView } from "../../components/detail-panel/index.tsx";
import { RelationListView } from "../../components/relation-list/index.tsx";
import { RelationEditorView } from "../../components/relation-editor/index.tsx";
import type { ItemMaster } from "../../types/masters.ts";
import { useItemsPresenter } from "./presenter.ts";

const columns: Column<ItemMaster>[] = [
	{ key: "id", label: "ID", type: "number", width: "60px", editable: false },
	{ key: "item_id", label: "ItemID", type: "number", width: "80px" },
	{ key: "DisplayName", label: "名前", type: "text", width: "150px" },
	{ key: "Description", label: "説明", type: "text" },
	{ key: "Price", label: "価格", type: "number", width: "100px" },
	{ key: "MaxStock", label: "最大在庫", type: "number", width: "100px" },
	{ key: "Attraction", label: "魅力", type: "number", width: "80px" },
	{ key: "PurchaseProb", label: "購入確率", type: "number", width: "100px" },
];

type ModalType = "earning" | "consuming" | null;

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

	const [modalType, setModalType] = useState<ModalType>(null);
	const [modalValues, setModalValues] = useState<Record<string, number | string>>({});

	const relatedExplores = getRelatedExplores();

	const handleOpenModal = (type: ModalType) => {
		setModalType(type);
		setModalValues({});
	};

	const handleCloseModal = () => {
		setModalType(null);
		setModalValues({});
	};

	const handleSaveModal = () => {
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

	const exploreOptions = explores.map((e) => ({
		value: typeof e.ExploreId === "number" ? e.ExploreId : 0,
		label: e.DisplayName,
	}));

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
				<h2 className="text-xl font-bold">アイテムマスタ</h2>
				<p className="text-sm text-base-content/70">
					{data.length} 件のアイテム
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
					title={`${selectedItem.DisplayName} の詳細`}
					onClose={() => onSelect(selectedItem.id)}
				>
					<div className="grid grid-cols-2 gap-4 mb-6">
						<div>
							<span className="text-sm text-base-content/70">ID</span>
							<p className="font-mono">{selectedItem.id}</p>
						</div>
						<div>
							<span className="text-sm text-base-content/70">ItemID</span>
							<p className="font-mono">{selectedItem.item_id}</p>
						</div>
						<div>
							<span className="text-sm text-base-content/70">価格</span>
							<p>{selectedItem.Price.toLocaleString()} G</p>
						</div>
						<div>
							<span className="text-sm text-base-content/70">最大在庫</span>
							<p>{selectedItem.MaxStock.toLocaleString()}</p>
						</div>
						<div className="col-span-2">
							<span className="text-sm text-base-content/70">説明</span>
							<p>{selectedItem.Description || "(なし)"}</p>
						</div>
					</div>

					<div className="border-t border-base-300 pt-4">
						<h4 className="font-bold mb-4">関連する探索</h4>

						<RelationListView
							title="獲得できる探索"
							items={relatedExplores.earning}
							onItemClick={() => {}}
							onRemove={onRemoveEarning}
							onAdd={() => handleOpenModal("earning")}
						/>

						<RelationListView
							title="消費される探索"
							items={relatedExplores.consuming}
							onItemClick={() => {}}
							onRemove={onRemoveConsuming}
							onAdd={() => handleOpenModal("consuming")}
						/>

						<RelationListView
							title="関連探索"
							items={relatedExplores.related}
							onItemClick={() => {}}
							onRemove={onRemoveItemExplore}
							onAdd={() => {}}
						/>
					</div>
				</DetailPanelView>
			)}

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
