type Props = {
	children: React.ReactNode;
};

const FilterIcon = () => {
	return (
		<svg
			className="h-4 w-4"
			viewBox="0 0 24 24"
			fill="currentColor"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			role="img"
			aria-labelledby="filter-icon-title"
		>
			<title id="filter-icon-title">Filter Icon</title>
			<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
		</svg>
	);
};

export const FilterView = ({ children }: Props) => {
	return (
		<div>
			<div className="drawer">
				<input id="my-drawer-1" type="checkbox" className="drawer-toggle" />
				<div className="drawer-content">
					{/* TODO: Enterキーに反応しない */}
					<label
						htmlFor="my-drawer-1"
						className="btn drawer-button p-0 w-9 h-9 rounded-full"
					>
						<FilterIcon />
					</label>
				</div>
				<div className="drawer-side">
					<label
						htmlFor="my-drawer-1"
						aria-label="close sidebar"
						className="drawer-overlay"
					></label>
					<ul
						id="sidebar-content-container"
						className="menu bg-base-200 min-h-full w-50 p-4"
					>
						{children}
					</ul>
				</div>
			</div>
		</div>
	);
};
