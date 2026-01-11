import type { ReactNode } from "react";

type RecordDetailViewProps = {
	title: string;
	children: ReactNode;
	onDelete: () => void;
};

export function RecordDetailView({ title, children, onDelete }: RecordDetailViewProps) {
	return (
		<div className="flex-1 flex flex-col overflow-hidden">
			<div className="flex items-center justify-between p-4 border-b border-base-300">
				<h2 className="text-xl font-bold">{title}</h2>
				<button
					type="button"
					className="btn btn-outline btn-error btn-sm"
					onClick={onDelete}
				>
					🗑 削除
				</button>
			</div>
			<div className="flex-1 overflow-auto p-4 space-y-6">{children}</div>
		</div>
	);
}
