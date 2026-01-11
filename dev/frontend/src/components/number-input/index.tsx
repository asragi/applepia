import { useNumberInputPresenter } from "./presenter";
import { NumberInputView } from "./view";

type Props = {
	label?: string;
};

export const NumberInput = ({ label }: Props) => {
	const { onInputUp, onInputDown, numberInputFieldRef } =
		useNumberInputPresenter();
	return (
		<NumberInputView
			ref={numberInputFieldRef}
			label={label}
			onInputUp={onInputUp}
			onInputDown={onInputDown}
		/>
	);
};
