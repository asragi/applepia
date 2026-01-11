import { useCallback, useRef } from "react";
import type { NumberInputFieldHandle } from "../number-input-field";

export const useNumberInputPresenter = () => {
	const numberInputFieldRef = useRef<NumberInputFieldHandle>(null);

	const onInputUp = useCallback(() => {
		numberInputFieldRef.current?.setValue((prev) => {
			return prev + 1;
		});
	}, []);

	const onInputDown = useCallback(() => {
		numberInputFieldRef.current?.setValue((prev) => {
			return prev - 1;
		});
	}, []);

	return { onInputUp, onInputDown, numberInputFieldRef };
};
