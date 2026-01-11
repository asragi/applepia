export const ItemName = ({ name }: { name: string }) => {
	return (
		<div className="item-name flex flex-col">
			<span className="text-left text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
				{name}
			</span>
		</div>
	);
};
