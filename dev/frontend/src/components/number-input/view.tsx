import type { NumberInputFieldHandle } from "../number-input-field";
import { NumberInputField } from "../number-input-field";

type Props = {
	ref: React.Ref<NumberInputFieldHandle>;
	label?: string;
	onInputUp: () => void;
	onInputDown: () => void;
};
export const NumberInputView = ({
	ref,
	label,
	onInputUp,
	onInputDown,
}: Props) => {
	return (
		<div className="join">
			<button
				type="button"
				className="btn join-item rounded-l-full text-sm"
				onClick={onInputDown}
			>
				ー
			</button>
			<NumberInputField ref={ref} label={label} />
			<button
				type="button"
				className="btn join-item rounded-r-full text-sm"
				onClick={onInputUp}
			>
				＋
			</button>
		</div>
	);
};
