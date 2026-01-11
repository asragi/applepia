import { useCallback, useState } from "react";

type Props = {
	initialValue: number;
};

export const useRangePresenter = ({ initialValue }: Props) => {
	const [value, setValue] = useState<number>(initialValue);

	const onChangeValue = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
		(event) => {
			setValue(Number(event.target.value));
		},
		[],
	);

	return { value, onChangeValue };
};
