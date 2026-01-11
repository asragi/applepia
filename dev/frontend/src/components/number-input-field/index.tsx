import { forwardRef } from "react";
import {
	type NumberInputFieldHandle,
	useNumberInputFieldPresenter,
} from "./presenter";
import { NumberInputFieldView } from "./view";

type Props = {
	label?: string;
	defaultValue?: number;
	max?: number;
};

export const NumberInputField = forwardRef<NumberInputFieldHandle, Props>(
	({ label, defaultValue, max }, ref) => {
		const { value, onChangeValue, onBlurInput } = useNumberInputFieldPresenter({
			defaultValue,
			max,
			imperativeRef: ref,
		});

		return (
			<NumberInputFieldView
				label={label}
				value={value}
				onChangeValue={onChangeValue}
				onBlurInput={onBlurInput}
			/>
		);
	},
);

export type { NumberInputFieldHandle };
