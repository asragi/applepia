import { Outlet } from "react-router";
import { SidebarView } from "../../components/sidebar/index.tsx";
import { useLayoutPresenter } from "./presenter.ts";

export function LayoutView() {
	const { onSave, onReload, isSaving, hasChanges } = useLayoutPresenter();

	return (
		<div className="flex h-screen">
			<SidebarView
				onSave={onSave}
				onReload={onReload}
				isSaving={isSaving}
				hasChanges={hasChanges}
			/>
			<main className="flex-1 overflow-auto bg-base-100">
				<Outlet />
			</main>
		</div>
	);
}
