type StatBarProps = {
	label: string;
	value: number;
	barClassName: string;
};

export const StatBar = ({ label, value, barClassName }: StatBarProps) => {
	return (
		<div className="relative h-4">
			<div className="absolute inset-0 flex justify-between items-end text-sm leading-none z-10">
				<span>{label}</span>
				<span>{value}%</span>
			</div>
			<div className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-base-300 overflow-hidden">
				<div
					className={`h-full ${barClassName}`}
					style={{ width: `${value}%` }}
				/>
			</div>
		</div>
	);
};
