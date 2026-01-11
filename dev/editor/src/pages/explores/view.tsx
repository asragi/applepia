import { useMemo, useState } from "react";
import { RecordListView } from "../../components/record-list/index.tsx";
import { RecordDetailView } from "../../components/record-detail/index.tsx";
import { FieldEditorView } from "../../components/field-editor/index.tsx";
import { RelationListView } from "../../components/relation-list/index.tsx";
import { RelationEditorView } from "../../components/relation-editor/index.tsx";
import { useNavigateToRecord } from "../../hooks/useNavigateToRecord.ts";
import type { ExploreMaster } from "../../types/masters.ts";
import { useExploresPresenter } from "./presenter.ts";

type ModalType = "earning" | "consuming" | "required" | "growth" | null;

const fields: Array<{ key: keyof ExploreMaster; label: string; type: "text" | "number"; editable?: boolean }> = [
	{ key: "id", label: "ID", type: "number", editable: false },
	{ key: "ExploreId", label: "ExploreID", type: "number" },
	{ key: "DisplayName", label: "名前", type: "text" },
	{ key: "Description", label: "説明", type: "text" },
	{ key: "ConsumingStamina", label: "スタミナ", type: "number" },
	{ key: "RequiredPayment", label: "費用", type: "number" },
	{ key: "StaminaReducibleRate", label: "軽減率", type: "number" },
];

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

	const navigateToRecord = useNavigateToRecord();
	const [modalType, setModalType] = useState<ModalType>(null);
	const [modalValues, setModalValues] = useState<Record<string, number | string>>({});

	const relatedData = getRelatedData();

	const itemOptions = useMemo(
		() =>
			items.map((i) => ({
				value: i.item_id,
				label: i.DisplayName,
			})),
		[items]
	);

	const skillOptions = useMemo(
		() =>
			skills.map((s) => ({
				value: s.SkillId,
				label: s.DisplayName,
			})),
		[skills]
	);

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
								onUpdate(selectedItem.id, key as keyof ExploreMaster, value)
							}
						/>

						<div className="border-t border-base-300 pt-4">
							<h4 className="font-bold mb-4">関連データ</h4>

							<RelationListView
								title="獲得アイテム"
								items={relatedData.earning}
								onItemClick={(id) => {
									const target = relatedData.earning.find((e) => e.id === id);
									if (target) navigateToRecord("items", target.itemId);
								}}
								onRemove={onRemoveEarning}
								onAdd={() => handleOpenModal("earning")}
							/>

							<RelationListView
								title="消費アイテム"
								items={relatedData.consuming}
								onItemClick={(id) => {
									const target = relatedData.consuming.find((e) => e.id === id);
									if (target) navigateToRecord("items", target.itemId);
								}}
								onRemove={onRemoveConsuming}
								onAdd={() => handleOpenModal("consuming")}
							/>

							<RelationListView
								title="必要スキル"
								items={relatedData.required}
								onItemClick={(id) => {
									const target = relatedData.required.find((e) => e.id === id);
									if (target) navigateToRecord("skills", target.skillId);
								}}
								onRemove={onRemoveRequired}
								onAdd={() => handleOpenModal("required")}
							/>

							<RelationListView
								title="スキル成長"
								items={relatedData.growth}
								onItemClick={(id) => {
									const target = relatedData.growth.find((e) => e.id === id);
									if (target) navigateToRecord("skills", target.skillId);
								}}
								onRemove={onRemoveGrowth}
								onAdd={() => handleOpenModal("growth")}
							/>
						</div>
					</RecordDetailView>
				) : (
					<div className="flex-1 flex items-center justify-center text-base-content/60">
						左のリストから探索を選択してください
					</div>
				)}
			</div>

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
