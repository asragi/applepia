import { useState } from "react";
import { DataTableView, type Column } from "../../components/data-table/index.tsx";
import { DetailPanelView } from "../../components/detail-panel/index.tsx";
import { RelationListView } from "../../components/relation-list/index.tsx";
import { RelationEditorView } from "../../components/relation-editor/index.tsx";
import type { ExploreMaster } from "../../types/masters.ts";
import { useExploresPresenter } from "./presenter.ts";

const columns: Column<ExploreMaster>[] = [
	{ key: "id", label: "ID", type: "number", width: "60px", editable: false },
	{ key: "ExploreId", label: "ExploreID", type: "text", width: "100px" },
	{ key: "DisplayName", label: "名前", type: "text", width: "150px" },
	{ key: "Description", label: "説明", type: "text" },
	{ key: "ConsumingStamina", label: "スタミナ", type: "number", width: "100px" },
	{ key: "RequiredPayment", label: "費用", type: "number", width: "100px" },
	{ key: "StaminaReducibleRate", label: "軽減率", type: "number", width: "80px" },
];

type ModalType = "earning" | "consuming" | "required" | "growth" | null;

export function ExploresView() {
	const {
		data,
		items,
		skills,
		selectedId,
		selectedItem,
		isLoading,
		error,
		onSelect,
		onUpdate,
		onDelete,
		onAdd,
		getRelatedData,
		onRemoveEarning,
		onRemoveConsuming,
		onRemoveRequired,
		onRemoveGrowth,
		onAddEarning,
		onAddConsuming,
		onAddRequired,
		onAddGrowth,
	} = useExploresPresenter();

	const [modalType, setModalType] = useState<ModalType>(null);
	const [modalValues, setModalValues] = useState<Record<string, number | string>>({});

	const relatedData = getRelatedData();

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
				Number(modalValues.itemId),
				Number(modalValues.minCount) || 1,
				Number(modalValues.maxCount) || 1,
				Number(modalValues.probability) || 1
			);
		} else if (modalType === "consuming") {
			onAddConsuming(
				Number(modalValues.itemId),
				Number(modalValues.maxCount) || 1,
				Number(modalValues.consumptionProb) || 1
			);
		} else if (modalType === "required") {
			onAddRequired(Number(modalValues.skillId), Number(modalValues.skillLv) || 1);
		} else if (modalType === "growth") {
			onAddGrowth(Number(modalValues.skillId), Number(modalValues.gainingPoint) || 10);
		}
		handleCloseModal();
	};

	const itemOptions = items.map((i) => ({
		value: i.item_id,
		label: i.DisplayName,
	}));

	const skillOptions = skills.map((s) => ({
		value: s.SkillId,
		label: s.DisplayName,
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
				<h2 className="text-xl font-bold">探索マスタ</h2>
				<p className="text-sm text-base-content/70">
					{data.length} 件の探索
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
							<span className="text-sm text-base-content/70">ExploreID</span>
							<p className="font-mono">{selectedItem.ExploreId}</p>
						</div>
						<div>
							<span className="text-sm text-base-content/70">消費スタミナ</span>
							<p>{selectedItem.ConsumingStamina}</p>
						</div>
						<div>
							<span className="text-sm text-base-content/70">必要費用</span>
							<p>{selectedItem.RequiredPayment.toLocaleString()} G</p>
						</div>
						<div className="col-span-2">
							<span className="text-sm text-base-content/70">説明</span>
							<p>{selectedItem.Description || "(なし)"}</p>
						</div>
					</div>

					<div className="border-t border-base-300 pt-4">
						<h4 className="font-bold mb-4">関連データ</h4>

						<RelationListView
							title="獲得アイテム"
							items={relatedData.earning}
							onItemClick={() => {}}
							onRemove={onRemoveEarning}
							onAdd={() => handleOpenModal("earning")}
						/>

						<RelationListView
							title="消費アイテム"
							items={relatedData.consuming}
							onItemClick={() => {}}
							onRemove={onRemoveConsuming}
							onAdd={() => handleOpenModal("consuming")}
						/>

						<RelationListView
							title="必要スキル"
							items={relatedData.required}
							onItemClick={() => {}}
							onRemove={onRemoveRequired}
							onAdd={() => handleOpenModal("required")}
						/>

						<RelationListView
							title="スキル成長"
							items={relatedData.growth}
							onItemClick={() => {}}
							onRemove={onRemoveGrowth}
							onAdd={() => handleOpenModal("growth")}
						/>
					</div>
				</DetailPanelView>
			)}

			{modalType === "earning" && (
				<RelationEditorView
					title="獲得アイテムを追加"
					fields={[
						{ name: "itemId", label: "アイテム", type: "select", options: itemOptions },
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
						{ name: "itemId", label: "アイテム", type: "select", options: itemOptions },
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

			{modalType === "required" && (
				<RelationEditorView
					title="必要スキルを追加"
					fields={[
						{ name: "skillId", label: "スキル", type: "select", options: skillOptions },
						{ name: "skillLv", label: "必要レベル", type: "number" },
					]}
					values={modalValues}
					onFieldChange={(name, value) =>
						setModalValues((prev) => ({ ...prev, [name]: value }))
					}
					onSave={handleSaveModal}
					onCancel={handleCloseModal}
				/>
			)}

			{modalType === "growth" && (
				<RelationEditorView
					title="スキル成長を追加"
					fields={[
						{ name: "skillId", label: "スキル", type: "select", options: skillOptions },
						{ name: "gainingPoint", label: "獲得ポイント", type: "number" },
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
