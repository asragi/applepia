import { useImperativeHandle } from "react";
import { useCounter } from "./use-counter";

type Props = {
	max?: number;
	defaultValue?: number;
	imperativeRef?: React.Ref<NumberInputFieldHandle>;
};

export type NumberInputFieldHandle = {
	setValue: (updater: (prev: number) => number) => void;
};

export const useNumberInputFieldPresenter = ({
	defaultValue,
	imperativeRef,
	max,
}: Props) => {
	const { value, onChangeValue, onBlurInput, setValue } = useCounter({
		defaultValue,
		max,
	});

	useImperativeHandle(
		imperativeRef ?? null,
		() => ({
			setValue,
		}),
		[setValue],
	);

	return {
		value,
		onChangeValue,
		onBlurInput,
		setValue,
	};
};
