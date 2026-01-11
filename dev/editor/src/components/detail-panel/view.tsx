import type { ReactNode } from "react";

type DetailPanelViewProps = {
	title: string;
	children: ReactNode;
	onClose: () => void;
};

export function DetailPanelView({ title, children, onClose }: DetailPanelViewProps) {
	return (
		<div className="border-t border-base-300 bg-base-100 p-4">
			<div className="flex justify-between items-center mb-4">
				<h3 className="font-bold text-lg">{title}</h3>
				<button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
					✕
				</button>
			</div>
			<div>{children}</div>
		</div>
	);
}
