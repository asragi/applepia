type RelationItem = {
	id: number;
	label: string;
	description?: string;
};

type RelationListViewProps = {
	title: string;
	items: RelationItem[];
	onItemClick: (id: number) => void;
	onRemove: (id: number) => void;
	onAdd: () => void;
};

export function RelationListView({
	title,
	items,
	onItemClick,
	onRemove,
	onAdd,
}: RelationListViewProps) {
	return (
		<div className="mb-4">
			<div className="flex justify-between items-center mb-2">
				<h4 className="font-semibold">{title}</h4>
				<button
					type="button"
					className="btn btn-ghost btn-xs"
					onClick={onAdd}
				>
					+ 追加
				</button>
			</div>

			{items.length === 0 ? (
				<p className="text-base-content/50 text-sm">なし</p>
			) : (
				<ul className="space-y-1">
					{items.map((item) => (
						<li
							key={item.id}
							className="flex justify-between items-center bg-base-200 rounded px-3 py-2"
						>
							<button
								type="button"
								className="text-left flex-1 hover:text-primary"
								onClick={() => onItemClick(item.id)}
							>
								<span className="font-medium">{item.label}</span>
								{item.description && (
									<span className="text-sm text-base-content/70 ml-2">
										{item.description}
									</span>
								)}
							</button>
							<button
								type="button"
								className="btn btn-ghost btn-xs text-error"
								onClick={() => onRemove(item.id)}
							>
								削除
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
