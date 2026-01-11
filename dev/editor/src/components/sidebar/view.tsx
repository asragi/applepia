import { NavLink } from "react-router";

type SidebarViewProps = {
	onSave: () => void;
	onReload: () => void;
	isSaving: boolean;
	hasChanges: boolean;
};

export function SidebarView({ onSave, onReload, isSaving, hasChanges }: SidebarViewProps) {
	const navItems = [
		{ to: "/items", icon: "box", label: "アイテム" },
		{ to: "/skills", icon: "zap", label: "スキル" },
		{ to: "/explores", icon: "map", label: "探索" },
		{ to: "/stages", icon: "mountain", label: "ステージ" },
	];

	return (
		<aside className="w-56 bg-base-200 h-screen flex flex-col">
			<div className="p-4 border-b border-base-300">
				<h1 className="text-lg font-bold">Master Editor</h1>
			</div>

			<nav className="flex-1 p-2">
				<ul className="menu">
					{navItems.map((item) => (
						<li key={item.to}>
							<NavLink
								to={item.to}
								className={({ isActive }) =>
									isActive ? "active" : ""
								}
							>
								{item.label}
							</NavLink>
						</li>
					))}
				</ul>
			</nav>

			<div className="p-4 border-t border-base-300 space-y-2">
				<button
					type="button"
					className="btn btn-primary btn-block"
					onClick={onSave}
					disabled={isSaving || !hasChanges}
				>
					{isSaving ? (
						<span className="loading loading-spinner loading-sm" />
					) : null}
					保存
				</button>
				<button
					type="button"
					className="btn btn-ghost btn-block"
					onClick={onReload}
					disabled={isSaving}
				>
					リロード
				</button>
			</div>
		</aside>
	);
}
