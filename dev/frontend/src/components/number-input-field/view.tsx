type Props = {
	label?: string;
	value: string;
	onChangeValue: (newValue: string) => void;
	onBlurInput: () => void;
};

export const NumberInputFieldView = ({
	label,
	value,
	onChangeValue,
	onBlurInput,
}: Props) => {
	return (
		<label className="input">
			<span className="label">{label}</span>
			<input
				type="text"
				inputMode="numeric"
				pattern="[0-9]*"
				placeholder=""
				title="Explore count"
				value={value}
				onChange={(e) => onChangeValue(e.target.value)}
				onBlur={onBlurInput}
			/>
		</label>
	);
};
