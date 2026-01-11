type Props = {
	min: number;
	max: number;
	step?: number;
	labels?: string[];
	value: number;
	onChangeValue: React.ChangeEventHandler<HTMLInputElement>;
	withBar?: boolean;
};

const renderBar = (count: number, withBar: boolean) => {
	if (!withBar) return null;
	return (
		<div className="flex justify-between px-2.5 text-xs">
			{Array.from({ length: count }).map((_, index) => (
				<span key={String(index)}>|</span>
			))}
		</div>
	);
};

const renderLabels = (labels: string[], withBar: boolean) => {
	if (labels.length === 0) return null;
	return (
		<>
			{renderBar(labels.length, withBar)}
			<div className="flex justify-between px-2.5 text-xs">
				{labels.map((label, index) => (
					<span key={String(index)}>{label}</span>
				))}
			</div>
		</>
	);
};

export const RangeView = ({
	min,
	max,
	step = 1,
	value,
	onChangeValue,
	labels = [],
	withBar = true,
}: Props) => {
	return (
		<div className="w-full max-w-xs">
			<input
				type="range"
				min={min}
				max={max}
				value={value}
				onChange={onChangeValue}
				className="range"
				step={step}
			/>
			{renderLabels(labels, withBar)}
		</div>
	);
};
