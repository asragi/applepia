import { Outlet } from "react-router";
import { TabHeaderView } from "../../components/tab-header/index.tsx";
import { useLayoutPresenter } from "./presenter.ts";

export function LayoutView() {
	const { onSave, onReload, isSaving, hasChanges } = useLayoutPresenter();

	return (
		<div className="flex flex-col h-screen bg-base-100">
			<TabHeaderView
				onSave={onSave}
				onReload={onReload}
				isSaving={isSaving}
				hasChanges={hasChanges}
			/>
			<main className="flex-1 overflow-hidden">
				<Outlet />
			</main>
		</div>
	);
}
