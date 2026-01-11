type RecordListViewProps<T extends { id: number }> = {
	items: T[];
	selectedId: number | null;
	onSelect: (id: number) => void;
	onAdd: () => void;
	getDisplayName: (item: T) => string;
};

export function RecordListView<T extends { id: number }>({
	items,
	selectedId,
	onSelect,
	onAdd,
	getDisplayName,
}: RecordListViewProps<T>) {
	return (
		<div className="w-64 border-r border-base-300 h-full flex flex-col bg-base-200">
			<div className="p-3 border-b border-base-300 flex items-center justify-between">
				<h3 className="text-sm font-semibold text-base-content/80">レコード</h3>
				<button
					type="button"
					className="btn btn-primary btn-xs"
					onClick={onAdd}
				>
					+ 新規作成
				</button>
			</div>
			<div className="flex-1 overflow-auto p-2">
				{items.length === 0 ? (
					<p className="text-sm text-base-content/60 px-2">データがありません</p>
				) : (
					<ul className="menu menu-sm bg-base-200 rounded-box">
						{items.map((item) => {
							const isActive = selectedId === item.id;
							return (
								<li key={item.id}>
									<button
										type="button"
										className={isActive ? "active" : ""}
										onClick={() => onSelect(item.id)}
									>
										<span className="truncate">{getDisplayName(item)}</span>
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
}
