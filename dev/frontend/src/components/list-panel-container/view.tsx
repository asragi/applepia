export const ListPanelContainerView = ({
	anchorBottom,
	children,
}: {
	children: React.ReactNode;
	anchorBottom?: boolean;
}) => {
	return (
		<ul
			id="list-panel-container"
			className={`grid grid-cols-1 md:grid-cols-2 gap-1 ${anchorBottom ? "mt-auto" : "mt-0"}`}
		>
			{children}
		</ul>
	);
};
