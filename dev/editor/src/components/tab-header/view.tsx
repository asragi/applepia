import { NavLink } from "react-router";

type TabHeaderViewProps = {
	onSave: () => void;
	onReload: () => void;
	isSaving: boolean;
	hasChanges: boolean;
};

const tabs = [
	{ to: "/items", label: "アイテム" },
	{ to: "/skills", label: "スキル" },
	{ to: "/explores", label: "探索" },
	{ to: "/stages", label: "ステージ" },
];

export function TabHeaderView({
	onSave,
	onReload,
	isSaving,
	hasChanges,
}: TabHeaderViewProps) {
	return (
		<header className="navbar bg-base-200 border-b border-base-300 px-4">
			<div className="flex-1 items-center gap-4">
				<span className="text-lg font-bold">Master Editor</span>
				<div className="tabs tabs-boxed">
					{tabs.map((tab) => (
						<NavLink
							key={tab.to}
							to={tab.to}
							className={({ isActive }) =>
								`tab px-4 ${isActive ? "tab-active" : ""}`
							}
						>
							{tab.label}
						</NavLink>
					))}
				</div>
			</div>
			<div className="flex-none flex items-center gap-2">
				{hasChanges ? (
					<span className="badge badge-warning gap-1 text-xs">
						<span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
						未保存
					</span>
				) : (
					<span className="badge text-xs">保存済み</span>
				)}
				<button
					type="button"
					className="btn btn-ghost btn-sm"
					onClick={onReload}
					disabled={isSaving}
				>
					🔄 リロード
				</button>
				<button
					type="button"
					className="btn btn-primary btn-sm"
					onClick={onSave}
					disabled={isSaving || !hasChanges}
				>
					{isSaving ? <span className="loading loading-spinner loading-xs" /> : "💾 保存"}
				</button>
			</div>
		</header>
	);
}
